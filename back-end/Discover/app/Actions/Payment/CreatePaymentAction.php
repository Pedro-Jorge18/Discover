<?php

use App\Models\Payment;
use App\DTOs\Payment\PaymentDTO;
use Illuminate\Support\Facades\DB;
use App\Services\Payment\PaymentService;

class CreatePaymentAction
{

    public function __construct(
        protected PaymentService $paymentService
    ) {}

    public function execute(PaymentDTO $dto): array
    {

        try {
            return DB::transaction(function () use ($dto) {
                //create Stripe checkout
                $session = $this->paymentService->createCheckoutSession($dto);

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
