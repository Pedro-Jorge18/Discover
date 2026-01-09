<?php

namespace App\Actions\Auth;

use App\DTOs\User\Auth\ResetPasswordDto;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\ValidationException;



class ResetPasswordAction
{
    public function execute(ResetPasswordDto $dto): array
    {

        $credentials = [
            'email' => $dto->email,
            'token' => $dto->token,
            'password' => $dto->password,
            'password_confirmation' => $dto->password_confirmation,
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

                Log::info('User password reset successfully', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            Log::warning('Password reset failed', [
                'email' =>  $dto->email,
                'status' => $status,
            ]);

            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return [
            'message' => __('passwords.reset'),
            'status' => $status,
        ];
    }
}
