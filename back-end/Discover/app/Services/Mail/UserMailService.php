<?php

namespace App\Services\Mail;

use App\Mail\User\{
    WelcomeUserMail,
    EmailVerificationMail,
    PasswordResetMail,
    AccountBannedMail
};
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class UserMailService
{
    protected int $maxAttempts = 3;
    protected int $retryDelaySeconds = 5;

    //send welcome email
    public function sendWelcome(User $user): bool
    {
        return $this->sendWithRetry(
            fn() => Mail::to($user->email)->send(new WelcomeUserMail($user)), "welcome_user", $user
        );
    }

    //send verification email
    public function sendEmailVerification(User $user, string $verificationUrl): bool
    {
        return $this->sendWithRetry(
            fn() => Mail::to($user->email)->send(new EmailVerificationMail($user, $verificationUrl)),
            "email_verification",
            $user
        );
    }

    //send reset password email
    public function sendPasswordReset(string $email, string $resetUrl): bool
    {
        return $this->sendWithRetry(
            fn() => Mail::to($user->email)->send(new PasswordResetEmail($user, $resetUrl)), "password_reset"
        )
    }

    //send accountt baned email
    public function sendAccountBanned(User $user, ?string $reason = null): bool
    {
        return $this->sendWithRetry(
            fn() => Mail::to($user->email)->send(new AccountBannedMail($user, $reason)),
            "account_banned",
            $user
        );
    }


    protected function sendWithRetry(callable $callback, string $type, User $user): bool
    {
        $attempts = 0;

        do {
            try {
                $callback();
                Log::info("E-mail enviado com sucesso ({$type})", [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'attempts' => $attempts + 1,
                ]);
                return true;
            } catch (Throwable $e) {
                $attempts++;
                Log::warning("Falha ao enviar e-mail ({$type}), tentativa {$attempts}", [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ]);

                if ($attempts >= $this->maxAttempts) {
                    Log::error("E-mail ({$type}) falhou após {$attempts} tentativas.", [
                        'user_id' => $user->id,
                        'email' => $user->email,
                    ]);
                    return false;
                }

                sleep($this->retryDelaySeconds);
            }
        } while ($attempts < $this->maxAttempts);

        return false;
    }
}