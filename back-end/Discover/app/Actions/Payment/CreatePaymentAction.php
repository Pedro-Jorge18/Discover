<?php

namespace App\Actions\Payment;

use Throwable;
use App\Models\Payment;
use App\DTOs\Payment\PaymentDTO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Services\Payment\PaymentServiceInterface;

class CreatePaymentAction
{

    public function __construct(
        protected PaymentServiceInterface $paymentService
    ) {}

    public function execute(PaymentDTO $dto): array
    {

        try {
            return DB::transaction(function () use ($dto) {

                $userId = Auth::id();

                //create Stripe checkout
                $session = $this->paymentService->createCheckoutSession($dto);

                //create payment record
                $payment = Payment::create([
                    'user_id'  => $userId,
                    'reservation_id' => $dto->reservation_id,
                    'amount' => $dto->amount,
                    'currency' => $dto->currency,
                    'status' => 'pending', // Initial status
                    'stripe_session_id' => null, // Will be updated after Stripe session creation
                ]);

                //return data (payment link...)
                return [
                    'checkout_url' => $session['checkout_url'] ?? $session['url'] ?? null,
                    'payment' => Payment::where('reservation_id', $dto->reservation_id)->latest()->first(),
                ];
            });
        } catch (Throwable $e) {
            report($e);
            throw new \RuntimeException('Error creating payment: ' . $e->getMessage());
        }
    }
}
