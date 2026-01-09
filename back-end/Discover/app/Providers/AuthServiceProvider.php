<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Payment;
use App\Policies\UserPolicy;
use App\Policies\PaymentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    //map between models and policies
    protected $policies = [
        User::class => UserPolicy::class,
        Payment::class => PaymentPolicy::class,
    ];

    //register services of authenticate and authorization
    public function boot(): void
    {
        $this->registerPolicies();
    }
}