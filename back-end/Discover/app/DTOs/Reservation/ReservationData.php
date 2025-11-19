<?php

namespace App\DTOs\Reservation;

use Carbon\Carbon;
use App\Actions\Reservation\validatesReservation;
use InvalidArgumentException;

class ReservationData
{
    public function __construct(

        public int $property_id,
        public int $user_id,
        public int $status_id,

        public Carbon $check_in,
        public Carbon $check_out,
        public int $nights,

        public int $adults = 1,
        public int $children = 0,
        public int $infants = 0,

        public float $price_per_night,
        public float $cleaning_fee = 0,
        public float $service_fee = 0,
        public float $security_deposit = 0,
        public float $subtotal = 0,
        public float $total_amount = 0,

        public float $amount_paid = 0,
        public ?string $payment_method = null,
        public ?string $transaction_id = null,
        public ?string $payment_status = 'pending',

        public ?string $special_requests = null,
        public ?string $reservation_code = null,
        public ?Carbon $confirmed_at = null,
        public ?Carbon $payment_date = null,
    )
    {
        $this->ValidateBasicRules();
        $this->calculateDerivedFields();
        $this->validateWithAction();

    }

    private function validateBasicRules(): void
    {
        //  IDs devem ser positivos
        if ($this->property_id < 1 || $this->user_id < 1 || $this->status_id < 1) {
            throw new InvalidArgumentException('Property, user and status IDs must be greater than 0');
        }

        //  Quantidades básicas
        if ($this->adults < 1) {
            throw new InvalidArgumentException('At least one adult is required');
        }

        if ($this->children < 0 || $this->infants < 0) {
            throw new InvalidArgumentException('Number of children and infants cannot be negative');
        }

        //  Preços básicos
        if ($this->price_per_night < 0) {
            throw new InvalidArgumentException('Price per night cannot be negative');
        }
    }

    private function validateWithAction(): void
    {
        $validator = new ValidatesReservation();

        // 🎯 DELEGA validações complexas para a Action
        $validator->validateDates($this->check_in, $this->check_out);
        $validator->validateGuests($this->adults, $this->children, $this->infants);
        $validator->validateFinancials(
            $this->price_per_night,
            $this->cleaning_fee,
            $this->service_fee,
            $this->security_deposit,
            $this->amount_paid,
            $this->total_amount
        );
    }

    private function calculateDerivedFields(): void
    {
        // Calcular numero de noites
        $this->nights = $this->check_in->diffInDays($this->check_out);
        // preço por noite
        $this->subtotal = $this->price_per_night * $this->nights;

        //  Calcula total (subtotal + taxas)
        $this->total_amount = $this->subtotal + $this->cleaning_fee + $this->service_fee;

        //  Sincroniza amount_paid com payment_status
        if ($this->amount_paid === 0.0 && $this->payment_status === 'paid') {
            $this->amount_paid = $this->total_amount;
        }

    }

    public static function fromArray(array $data): self
    {
        return new self(
            property_id: (int) $data['property_id'],
            user_id: (int) $data['user_id'],
            status_id: (int) $data['status_id'],
            check_in: Carbon::parse($data['check_in']),
            check_out: Carbon::parse($data['check_out']),
            nights: (int) $data['nights'],
            adults: (int) ($data['adults'] ?? 1),
            children: (int) ($data['children'] ?? 0),
            infants: (int) ($data['infants'] ?? 0),
            price_per_night: (float) $data['price_per_night'],
            cleaning_fee: (float) ($data['cleaning_fee'] ?? 0),
            service_fee: (float) ($data['service_fee'] ?? 0),
            security_deposit: (float) ($data['security_deposit'] ?? 0),
            subtotal: (float) ($data['subtotal'] ?? 0),
            total_amount: (float) ($data['total_amount'] ?? 0),
            amount_paid: (float) ($data['amount_paid'] ?? 0),
            payment_method: $data['payment_method'] ?? null,
            transaction_id: $data['transaction_id'] ?? null,
            payment_status: $data['payment_status'] ?? 'pending',
            special_requests: $data['special_requests'] ?? null,
            reservation_code: $data['reservation_code'] ?? null,
            confirmed_at: isset($data['confirmed_at']) ? Carbon::parse($data['confirmed_at']) : null,
            payment_date: isset($data['payment_date']) ? Carbon::parse($data['payment_date']) : null,
        );
    }

    public function toArray(): array
    {
        return [
            'property_id' => $this->property_id,
            'user_id' => $this->user_id,
            'status_id' => $this->status_id,
            'check_in' => $this->check_in->toDateTimeString(),
            'check_out' => $this->check_out->toDateTimeString(),
            'nights' => $this->nights,
            'adults' => $this->adults,
            'children' => $this->children,
            'infants' => $this->infants,
            'price_per_night' => $this->price_per_night,
            'cleaning_fee' => $this->cleaning_fee,
            'service_fee' => $this->service_fee,
            'security_deposit' => $this->security_deposit,
            'subtotal' => $this->subtotal,
            'total_amount' => $this->total_amount,
            'amount_paid' => $this->amount_paid,
            'payment_method' => $this->payment_method,
            'transaction_id' => $this->transaction_id,
            'payment_status' => $this->payment_status,
            'special_requests' => $this->special_requests,
            'reservation_code' => $this->reservation_code,
            'confirmed_at' => $this->confirmed_at?->toDateTimeString(),
            'payment_date' => $this->payment_date?->toDateTimeString(),
        ];
    }

    public function getTotalGuests(): int
    {
        return $this->adults + $this->children;
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid' && $this->amount_paid >= $this->total_amount;
    }

    public function isConfirmed(): bool
    {
        return $this->confirmed_at !== null;
    }

}
