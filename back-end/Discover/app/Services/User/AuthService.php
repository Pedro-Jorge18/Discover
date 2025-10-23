<?php
namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepository,
    ){}

    //auth user and create a sanctum token
    public function authenticate(string $email, string $password, bool $remember = false): ?array
    {
        $user = $this->userRepository->findByEmail($email);

        if(!$user || !Hash::check($password, $user->password)){
            return null;
        }

        $token = $this->generateToken($user);

        $this->updateLastLogin($user);

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'remember_me' => $remember,
        ];
    }


    //create a new token sanctum for user
    public function generateToken(User $user, string $name = 'auth-token', array $abilities = ['*']): string
    {
        try {

            $token = $user->createToken($name, $abilities);

            Log::info('New Sanctum token created.', [
                'user_id' => $user->id,
                'token_name' => $name,
                'token_id' => $token->accessToken->id,
            ]);

            return $token->plainTextToken;

        } catch (Throwable $e) {
            Log::error('Failed to generate token', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    //revoke actual token
    public function revokeCurrentToken(User $user): bool
    {
        try {
            $token = $user->currentAccessToken();

            if (!$token) {
                Log::warning('No current access token found for user', ['user_id' => $user->id]);
                return false;
            }

            $tokenId = $token->id;
            $token->delete();

            Log::info('Current token revoked', [
                'user_id' => $user->id,
                'token_id' => $tokenId,
            ]);

            return true;

        } catch (Throwable $e) {
            Log::error('Failed to revoke current token', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }


    public function revokeAllTokens(User $user): int
    {
        try {
            $count = $user->tokens()->delete();

            Log::info('All user tokens revoked', [
                'user_id' => $user->id,
                'count' => $count,
            ]);

            return $count;
        } catch (Throwable $e) {
            Log::error('Failed to revoke all tokens', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return 0;
        }
    }


    public function getAuthenticatedUser(): ?User
    {
        return Auth::user();
    }

    public function updateLastLogin(User $user): void
    {
        try {
            $this->userRepository->update($user->id, [
                'last_login_date' => now(),
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to update last login', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function logout(): bool
    {
        $user = Auth::user();

        if (!$user) {
            Log::warning('Logout attempt with no authenticated user');
            return false;
        }

        return $this->revokeCurrentToken($user);
    }

    public function isAuthenticated(): bool
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        try {

            if (method_exists($user, 'currentAccessToken')) {
                $currentToken = $user->currentAccessToken();
                if ($currentToken !== null) {
                    return true;
                }
            }

            return $this->hasValidTokens($user);

        } catch (Throwable $e) {
            Log::warning('Error checking authentication', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

}