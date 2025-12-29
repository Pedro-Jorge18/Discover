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
            $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
            
            return response()->json([
                'url' => $url
            ]);
        } catch (Exception $e) {
            Log::error('Google redirect error', ['error' => $e->getMessage()]);
            
            return response()->json([
                'message' => 'Error redirecting to Google'
            ], 500);
        }
    }
     
    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback(Request $request): JsonResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
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
        
        // Remove numbers and special characters, capitalize
        $firstName = preg_replace('/[^a-zA-Z]/', '', $username);
        
        return ucfirst(strtolower($firstName)) ?: 'User';
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
