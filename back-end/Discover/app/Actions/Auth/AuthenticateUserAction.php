<?php

namespace App\Actions\Users\Auth;


use App\Services\AuthService;
use Illuminate\Support\Facades\DB;
use App\Repositories\UserRepository;
use App\DTOs\Auth\AuthenticateUserDto;
use Illuminate\Validation\ValidationException;

class AuthenticateUserAction
{
    public function __construct(
        protected UserRepository $userRepository,
        protected AuthService $authService,
    ) {}

    public function execute(AuthenticateUserDto $data): array
    {
        return DB::transaction(function() use ($data){
            //auth user
            $user = $this->authService->authenticate($data->email, $data->password);

            if(!$user){
                $this->handleFailedAuthentication();
            }

            //last login update
            $this->userRepository->update($user->id, [
                'last_login_date' => now(),
            ]);

            //token sanctum
            $token = $this->authService->generateToken($user);

            return [
                'user' => $user->fresh(),
                'token' => $token,
                'token_type' => 'Bearer',
            ];
        });
    }

    public function handleFailedAuthentication(): void
    {
        throw ValidationException::withMessages([
            'email' => [__('auth.login.invalid_credentials')],
            'password' => [__('auth.login.invalid_credentials')],
        ]);
    }


}