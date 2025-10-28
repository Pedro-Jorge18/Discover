<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendEmailWithRetryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [5, 15, 30];

    public function __construct(
        private string $type,
        private string $target,
        private callable $callback
    ) {}

    public function handle(): void
    {
        try {
            ($this->callback)();

            Log::info("Email sent successfully ({$this->type})", [
                'target' => $this->target,
            ]);
        } catch (Throwable $e) {
            Log::warning("Failed to send email ({$this->type})", [
                'target' => $this->target,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            throw $e; // Faz o Laravel re-tentar automaticamente
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
