<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\ValidationException;



class ResetPasswordAction
{
    public function execute(string $email, string $token, string $password, ?string $passwordConfirmation = null): array
    {
        if ($password !== $passwordConfirmation) {
            throw ValidationException::withMessages([
                'password' => [__('auth.password_mismatch', ['default' => 'Passwords do not match.'])],
            ]);
        }

        $credentials = [
            'email' => $email,
            'token' => $token,
            'password' => $password,
            'password_confirmation' => $passwordConfirmation ?? $password,
        ];

        $status = Password::broker()->reset(
            $credentials,
            function (User $user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                event(new PasswordReset($user));

                if (method_exists($user, 'tokens')) {
                    $user->tokens()->delete();
                }

                Log::info('User passoword reset successfully,', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            Log::warning('Password reset failed', [
                'email' =>  $email,
                'status' => $status,
            ]);

            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return [
            'message' => __('passwords.reset', ['default' => 'Password has been reset successfully.']),
            'status' => $status,
        ];
    }
}
