<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Mail\UserMailService;

class MailServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(UserMailService::class, function ($app) {
            return new UserMailService();
        });
    }

    public function boot(): void
    {
        //
    }
}
