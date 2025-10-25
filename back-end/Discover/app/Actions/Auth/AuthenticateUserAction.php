<?php

namespace App\Actions\Auth;


use Throwable;
use App\Services\AuthService;
use Illuminate\Support\Facades\Log;
use App\Repositories\UserRepository;
use App\DTOs\User\Auth\AuthenticateUserDto;
use App\Models\User;

class AuthenticateUserAction
{
    public function __construct(
        protected UserRepository $userRepository,
        protected AuthService $authService,
    ) {}

    public function execute(AuthenticateUserDto $dto): ?array
    {
        try {
            $user = $this->authService->authenticate(
                $dto->email,
                $dto->password,
                $dto->remember_me
            );

            if (!$user) {
                Log::warning('Authentication failed', [
                    'email' => $dto->email,
                    'ip' => request()->ip()
                ]);
                return null;
            }

            $token = $this->authService->generateToken($user);
            $user = $this->updateUserAfterAuthentication($user);

            Log::info('User authenticated successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'remember_me' => $dto->remember_me,
            ];
        } catch (Throwable $e) {
            Log::error('Authentication action failed', [
                'email' => $dto->email,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function updateUserAfterAuthentication(User $user): User
    {
        return $user->load(['roles', 'profile']);
    }
}