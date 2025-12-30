<?php

namespace App\Http\Controllers\Auth;

use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\User;
use App\Services\User\AuthService;
use Exception;
use GuzzleHttp\Client as GuzzleClient;

class GoogleAuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle(): JsonResponse
    {
        try {
            // Configure Socialite with SSL settings for development
            $driver = Socialite::driver('google')
                ->stateless()
                ->scopes(['openid', 'profile', 'email'])
                ->with([
                    'access_type' => 'offline',
                    'prompt' => 'consent select_account'
                ]);
            
            // Apply SSL fix for development environment
            if (app()->environment('local') || config('app.debug')) {
                $driver->setHttpClient(new GuzzleClient([
                    'verify' => false, // Disable SSL verification in development
                    'timeout' => 30,
                ]));
            }
            
            $url = $driver->redirect()->getTargetUrl();
            
            Log::info('Google OAuth redirect generated', [
                'url' => $url,
                'redirect_uri' => config('services.google.redirect')
            ]);
            
            return response()->json([
                'url' => $url
            ]);
        } catch (Exception $e) {
            Log::error('Google OAuth redirect error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'config' => [
                    'client_id' => config('services.google.client_id') ? 'set' : 'missing',
                    'client_secret' => config('services.google.client_secret') ? 'set' : 'missing',  
                    'redirect_uri' => config('services.google.redirect')
                ]
            ]);
            
            return response()->json([
                'message' => 'Failed to generate Google OAuth URL. Please try again later.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
     
    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback(Request $request): JsonResponse
    {
        try {
            // Configure Socialite with SSL settings for development
            $driver = Socialite::driver('google')->stateless();
            
            // Apply SSL fix for development environment  
            if (app()->environment('local') || config('app.debug')) {
                $driver->setHttpClient(new GuzzleClient([
                    'verify' => false, // Disable SSL verification in development
                    'timeout' => 30,
                ]));
            }
            
            $googleUser = $driver->user();
            
            // Validate Google user data
            if (!$googleUser->email || !filter_var($googleUser->email, FILTER_VALIDATE_EMAIL)) {
                Log::warning('Invalid or missing email from Google OAuth', [
                    'google_id' => $googleUser->id ?? 'unknown',
                    'email' => $googleUser->email ?? 'null'
                ]);
                
                return response()->json([
                    'message' => 'Invalid email received from Google. Please try again.',
                ], 400);
            }
            
            // Check if user already exists with this Google ID
            $user = User::where('google_id', $googleUser->id)->first();
            
            if ($user) {
                // User exists with Google ID - login
                $token = $this->authService->generateToken($user);
                $this->authService->updateLastLogin($user);
                
                Log::info('User logged in via Google', ['user_id' => $user->id]);
                
                return response()->json([
                    'user' => new UserResource($user),
                    'token' => $token,
                    'token_type' => 'Bearer',
                    'message' => 'Successfully logged in via Google'
                ]);
            }
            
            // Check if user exists with same email
            $existingUser = User::where('email', $googleUser->email)->first();
            
            if ($existingUser) {
                // Link Google account to existing user
                $existingUser->update(['google_id' => $googleUser->id]);
                
                $token = $this->authService->generateToken($existingUser);
                $this->authService->updateLastLogin($existingUser);
                
                Log::info('Google account linked to existing user', ['user_id' => $existingUser->id]);
                
                return response()->json([
                    'user' => new UserResource($existingUser),
                    'token' => $token,
                    'token_type' => 'Bearer',
                    'message' => 'Google account successfully linked'
                ]);
            }
            
            // Create new user
            $user = User::create([
                'name' => $googleUser->name ?? $this->extractFirstName($googleUser->email),
                'last_name' => $this->extractLastName($googleUser->name) ?? 'User',
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'password' => bcrypt(Str::random(32)), // Random password
                'email_verified_at' => now(),
                'verified' => true,
                'active' => true,
                'phone' => '+000000000', // Default value required by schema
                'birthday' => now()->subYears(25)->format('Y-m-d'), // Default age 25
                'role' => 'guest'
            ]);
            
            $token = $this->authService->generateToken($user);
            
            Log::info('New user created via Google', ['user_id' => $user->id]);
            
            return response()->json([
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer',
                'message' => 'Account created successfully via Google'
            ], 201);
            
        } catch (Exception $e) {
            Log::error('Google authentication error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Google authentication error',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Extract first name from email if name is not available
     */
    private function extractFirstName(string $email): string
    {
        $parts = explode('@', $email);
        $username = $parts[0] ?? 'User';
        
        // Remove numbers and special characters
        $firstName = preg_replace('/[^a-zA-Z]/', '', $username);

        // If no alphabetic characters remain or an error occurred, fall back to a generic name
        if (!is_string($firstName) || $firstName === '') {
            return 'User';
        }
        // Normalize case and capitalize first letter
        $normalized = strtolower($firstName);
        return ucfirst($normalized);
    }
    
    /**
     * Extract last name from full name
     */
    private function extractLastName(?string $fullName): ?string
    {
        if (!$fullName) {
            return null;
        }
        
        $parts = explode(' ', trim($fullName));
        
        if (count($parts) > 1) {
            array_shift($parts); // Remove the first name
            return implode(' ', $parts);
        }
        
        return null;
    }
}
