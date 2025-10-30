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
use App\Jobs\Mail\SendEmailWithRetryJob;

class UserMailService
{
    protected int $maxAttempts = 3;
    protected int $retryDelaySeconds = 5;

    //send welcome email
    public function sendWelcome(User $user): bool
    {
        return $this->sendWithRetry(
            fn() => Mail::to($user->email)->send(new WelcomeUserMail($user)),
            "welcome_user",
            $user
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
            fn() => Mail::to($email)->send(new PasswordResetMail($resetUrl)),
            "password_reset",
            $email // just for logging
        );
    }

    //send account banned email
    public function sendAccountBanned(User $user, ?string $reason = null): bool
    {
        return $this->sendWithRetry(
            fn() => Mail::to($user->email)->send(new AccountBannedMail($user, $reason)),
            "account_banned",
            $user
        );
    }


    protected function sendWithRetry(callable $callback, string $type, string|User $target): bool
    {
        $identifier = $target instanceof User ? $target->email : $target;

        try {
            SendEmailWithRetryJob::dispatch($type, $identifier, $callback);

            Log::info("Email queued for sending ({$type})", [
                'target' => $identifier,
            ]);

            return true;
        } catch (Throwable $e) {
            Log::error("Failed to queue email ({$type})", [
                'target' => $identifier,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
