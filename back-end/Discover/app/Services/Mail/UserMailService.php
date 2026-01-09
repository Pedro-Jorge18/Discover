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
        try {
            SendEmailWithRetryJob::dispatch(
                'PasswordResetMail',
                $email,
                ['resetUrl' => $resetUrl]
            );

            Log::info('Password reset email queued for sending', [
                'target' => $email,
            ]);

            return true;
        } catch (Throwable $e) {
            Log::error('Failed to queue password reset email', [
                'target' => $email,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
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
            // The callback may be a Closure that cannot be serialized for queueing
            // Execute the callback synchronously to avoid serialization issues.
            $callback();

            Log::info("Email sent synchronously ({$type})", [
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