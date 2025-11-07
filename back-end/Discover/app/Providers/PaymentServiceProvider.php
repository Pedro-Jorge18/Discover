<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Actions\Payment\FailPaymentAction;
use App\Actions\Payment\CreatePaymentAction;
use App\Actions\Payment\RefundPaymentAction;
use App\Actions\Payment\ConfirmPaymentAction;
use App\Services\Payment\StripePaymentService;
use App\Services\Payment\PaymentServiceInterface;



class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CreatePaymentAction::class, function ($app) {
            return new CreatePaymentAction($app->make(PaymentServiceInterface::class));
        });

        $this->app->bind(ConfirmPaymentAction::class, fn() => new ConfirmPaymentAction());
        $this->app->bind(FailPaymentAction::class, fn() => new FailPaymentAction());

        $this->app->bind(RefundPaymentAction::class, function ($app) {
            return new RefundPaymentAction($app->make(PaymentServiceInterface::class));
        });

        $this->app->bind(PaymentServiceInterface::class, StripePaymentService::class);
    }

    public function boot(): void
    {
        //
    }
}