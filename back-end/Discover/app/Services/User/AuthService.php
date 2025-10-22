<?php
namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\NewAccessToken;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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
        ];
    }


    //create a new token sanctum for user
    public function generateToken(User $user): string
    {
        $token = $user->createToken('auth-token', ['*'], now()->addWeek());

        Log::info('New token sanctum created.', [
            'user_id' => $user->id,
            'token_id' => $token->accessToken->id ?? null,
        ]);

        return $token->plainTextToken;
    }

    //revoke actual token
    public function revokeCurrentToken(User $user): bool
    {
        try {
            $token = $user->currentAccessToken();

            if (!$token) {
                return false;
            }

            $token->delete();

            Log::info('Token atual revogado', [
                'user_id' => $user->id,
                'token_id' => $token->id,
            ]);

            return true;

        } catch (Throwable $e) {
            Log::error('Falha ao revogar token atual', [
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

            Log::info('Todos os tokens revogados', [
                'user_id' => $user->id,
                'count' => $count,
            ]);

            return $count;
        } catch (Throwable $e) {
            Log::error('Falha ao revogar todos os tokens', [
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
        $user->update([
            'last_login_date' => now(),
        ]);
    }

    public function logout(): bool
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        return $this->revokeCurrentToken($user);
    }

    public function isAuthenticated(): bool
    {
        $user = Auth::user();

        return $user !== null && $user->currentAccessToken() !== null;
    }

}
