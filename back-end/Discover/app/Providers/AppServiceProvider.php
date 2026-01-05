<?php

namespace App\Providers;


use App\Models\User;
use App\Observers\UserObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(\App\Providers\PropertyServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        User::observe(UserObserver::class);
        
        // Fix SSL certificate issues in development
        if (app()->environment('local') || config('app.debug')) {
            $guzzleConfig = [
                'verify' => false, // Disable SSL verification for development
            ];
            
            // Apply to Socialite's Guzzle client
            $this->app->bind('guzzle.config', function () use ($guzzleConfig) {
                return $guzzleConfig;
            });
        }
    }
}
