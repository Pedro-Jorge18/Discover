<?php

namespace App\Mail\User;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountBannedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user, public ?string $reason = null) {}

    public function build(): self
    {
        return $this->subject('Account suspended')
            ->view('emails.user.account-banned')
            ->with([
                'user' => $this->user,
                'reason' => $this->reason ?? 'violation of terms of use',
            ]);
    }
}