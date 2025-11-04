<?php

namespace App\Providers;

use App\Actions\Payment\ConfirmPaymentAction;
use App\Actions\Payment\FailPaymentAction;
use App\Actions\Payment\RefundPaymentAction;
use CreatePaymentAction;
use Illuminate\Support\ServiceProvider;
use App\Services\Payment\PaymentService;

class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CreatePaymentAction::class, function ($app) {
            return new CreatePaymentAction($app->make(PaymentService::class));
        });

        $this->app->bind(ConfirmPaymentAction::class, fn() => new ConfirmPaymentAction());
        $this->app->bind(FailPaymentAction::class, fn() => new FailPaymentAction());

        $this->app->bind(RefundPaymentAction::class, function ($app) {
            return new RefundPaymentAction($app->make(RefundPaymentAction::class));
        });
    }

    public function boot(): void
    {
        //
    }
}