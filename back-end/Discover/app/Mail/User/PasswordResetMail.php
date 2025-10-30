<?php

namespace App\Mail\User;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $resetUrl) {}

    public function build(): self
    {
        return $this->subject('Password reset')
            ->view('emails.user.password-reset')
            ->with(['url' => $this->resetUrl]);
    }
}
