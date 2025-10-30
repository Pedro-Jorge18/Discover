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
            Mail::to($this->target)->send(new $this->type($this->mailData));

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
