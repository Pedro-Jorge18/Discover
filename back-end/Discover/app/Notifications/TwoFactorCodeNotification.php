<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TwoFactorCodeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected string $code
    ) {}

    //channels through which the notification will be sent
    public function via($notifiable): array
    {
        return ['email'];
    }

    //email message sent with 2FA code
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Your Two-Factor Authentication Code'))
            ->greeting(__('Hello, :name!', ['name' => $notifiable->name]))
            ->line(__('Here is your two-factor authentication code:'))
            ->line("**{$this->code}**")
            ->line(__('The code will expire in 5 minutes.'))
            ->line(__('If you did not request this, please secure your account.'));
    }
}