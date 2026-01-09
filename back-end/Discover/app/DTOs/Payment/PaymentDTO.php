<?php

namespace App\DTOs\Payment;

use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Payment\CreatePaymentRequest;

class PaymentDTO
{
    public function __construct(
        public readonly int $reservation_id,
        public readonly int $user_id,
        public readonly float $amount,
        public readonly string $currency = 'EUR',
        public readonly string $payment_gateway = 'stripe',
        public readonly ?int $payment_method_id = null,
        public readonly ?string $description = null,
        public readonly ?array $metadata = null,
    ) {}


    public static function fromRequest(CreatePaymentRequest $request): self
    {
        $data = $request->validated();

        return new self(
            reservation_id: (int) ($data['reservation_id'] ?? 0),
            user_id: Auth::id(),
            amount: (float) $data['amount'],
            currency: strtoupper($data['currency'] ?? 'EUR'),
            payment_gateway: $data['payment_gateway'] ?? 'stripe',
            payment_method_id: $data['payment_method_id'] ?? null,
            description: $data['description'] ?? null,
            metadata: $data['metadata'] ?? null,
        );
    }


    public static function fromArray(array $data): self
    {
        return new self(
            reservation_id: (int) ($data['reservation_id'] ?? 0),
            user_id: (int) ($data['user_id'] ?? 0),
            amount: (float) $data['amount'],
            currency: strtoupper($data['currency'] ?? 'EUR'),
            payment_gateway: $data['payment_gateway'] ?? 'stripe',
            payment_method_id: $data['payment_method_id'] ?? null,
            description: $data['description'] ?? null,
            metadata: $data['metadata'] ?? null,
        );
    }


    public function toArray(): array
    {
        return [
            'reservation_id' => $this->reservation_id,
            'user_id' => $this->user_id,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'payment_gateway' => $this->payment_gateway,
            'payment_method_id' => $this->payment_method_id,
            'description' => $this->description,
            'metadata' => $this->metadata,
        ];
    }
}
