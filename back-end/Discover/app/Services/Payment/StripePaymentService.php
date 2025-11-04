<?php

namespace App\Services\Payment;

use Stripe\StripeClient;
use App\DTOs\Payment\PaymentDTO;
use Illuminate\Support\Facades\Log;

class StripePaymentService implements PaymentServiceInterface
{
    private StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    //create a checkout session
    public function createCheckoutSession(PaymentDTO $dto): array
    {
        $baseUrl = config('app.frontend_url') ?? config('app.url');

        $session = $this->stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'customer_email' => $dto->user?->email ?? null,
            'line-itens' => [[
                'price_data' => [
                    'currency' => strtolower($dto->currency),
                    'unit_amount' => (int)($dto->amount * 100), // for cents
                    'product_data' => [
                        'name' => $dto->description ?? 'Reserva Discover',
                    ],
                ],
                'quantity' => 1,
            ]],
            'metadata' => [
                'reservation_id' => $dto->reservation_id,
                'user_id' => $dto->user_id,
            ],
            'success_url' => "{$baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url' => "{$baseUrl}/checkout/cancel",
        ]);

        Log::info('Stripe Checkout Session created', ['id' => $session->id]);

        return $session->toArray();
    }


    //confirms the payment based on the intent (used in the webhook).
    public function confirmPayment(string $intentId): array
    {
        $intent = $this->stripe->paymentIntents->retrieve($intentId);

        if ($intent->status === 'succeeded') {
            Log::info('Stripe payment confirmed', ['intent' => $intentId]);
        }

        return $intent->toArray();
    }

    //refund
    public function refund(string $paymentId): array
    {
        $refund = $this->stripe->refunds->create([
            'paymente_intent' => $paymentId,
        ]);

        Log::info('Stripe refund processed', ['refund' => $refund->id]);

        return $refund->toArray();
    }
}