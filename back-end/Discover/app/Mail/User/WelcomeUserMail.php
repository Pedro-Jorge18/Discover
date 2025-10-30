<?php

namespace App\Mail\User;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeUserMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user){}

    public function build(): self
    {
        return $this->subject('Welcome to Discover!')
            ->view('emails.user.welcome')
            ->with(['user' => $this->user]);
    }
}
