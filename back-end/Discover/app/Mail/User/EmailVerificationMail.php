<?php

namespace App\Mail\User;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $verificationUrl
    ) {}


    public function build(): self
    {
        return $this->subject('Check your e-mail address')
            ->view('emails.user.verify-email')
            ->with([
                'user' => $this->user,
                'url' => $this->verificationUrl,
            ]);
    }
}
