<?php

namespace App\Services\Payment;

use App\DTOs\Payment\PaymentDTO;


interface PaymentServiceInterface
{
    //create a gateway checkout session
    public function createCheckoutSession(PaymentDTO $dto): array;

    //Confirms a payment based on a webhook or intent ID
    public function confirmPayment(string $intentId): array;

    //refund
    public function refund(string $paymentId): array;
}