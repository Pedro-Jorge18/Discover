<?php

namespace App\Actions\Auth;


use Illuminate\Support\Facades\Log;
use App\Services\Mail\UserMailService;
use Illuminate\Support\Facades\Password;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Validation\ValidationException;

class RequestPasswordResetAction
{
    public function __construct(
        protected UserRepository $userRepository,
        protected UserMailService $userMailService,
    ) {}

    //send redefinition password email
    public function  execute(string $email): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => __('auth.user_not_found', ['email' => $email]),
            ]);
        }

        try {
            //auth token
            $token = Password::broker()->createToken($user);

            //create reset url, route will be used by react
            $resetUrl = config('app.frontend_url') . "/reset-password?token={$token}&email={$email}";

            //send email
            $this->userMailService->sendPasswordReset($email, $resetUrl);

            Log::info('Password reset email send', ['email' => $email]);

            return [
                'message' => __('auth.reset_link_sent'),
            ];
        } catch (\Throwable $e) {
            Log::error('Error requesting password reset.', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'email' => __('auth.reset_failed'),
            ]);
        }
    }
}