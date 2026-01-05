<?php

namespace App\Jobs\Mail;

use Throwable;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;


class SendEmailWithRetryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [5, 15, 30];

    public function __construct(
        private string $type,
        private string $target,
        private array $mailData = []
    ) {}

    public function handle(): void
    {
        try {
            $mailableClass = "App\\Mail\\User\\{$this->type}";

            if (!class_exists($mailableClass)) {
                throw new \Exception("Mailable class {$mailableClass} not found");
            }

            // Create mailable instance based on type
            $mailable = match($this->type) {
                'PasswordResetMail' => new $mailableClass($this->mailData['resetUrl']),
                'WelcomeUserMail' => new $mailableClass($this->mailData['user']),
                'EmailVerificationMail' => new $mailableClass($this->mailData['user'], $this->mailData['verificationUrl']),
                'AccountBannedMail' => new $mailableClass($this->mailData['user'], $this->mailData['reason'] ?? null),
                default => new $mailableClass(...array_values($this->mailData))
            };

            Mail::to($this->target)->send($mailable);

            Log::info("Email sent successfully ({$this->type})", [
                'target' => $this->target,
            ]);
        } catch (Throwable $e) {
            Log::warning("Failed to send email ({$this->type})", [
                'target' => $this->target,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            throw $e; // Causes Laravel to automatically retry
        }
    }

    public function failed(Throwable $e): void
    {
        Log::error("Email ({$this->type}) failed after {$this->tries} attempts", [
            'target' => $this->target,
            'error' => $e->getMessage(),
        ]);
    }
}