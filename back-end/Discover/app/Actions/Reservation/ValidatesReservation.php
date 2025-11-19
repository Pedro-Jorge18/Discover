<?php

namespace App\Actions\Reservation;

use Carbon\Carbon;
use InvalidArgumentException;

class ValidatesReservation
{
    private const MIN_NIGHTS = 1;
    private const MAX_NIGHTS = 30;
    private const MAX_GUESTS_TOTAL = 10;

    public function validateDates(Carbon $check_in, Carbon $check_out): void
    {
        // check_in não pode ser no passado
        if ($check_in->isPast()) {
            throw new InvalidArgumentException('Check-in date cannot be in the past');
        }

        // check_out deve ser DEPOIS de check_in
        if ($check_out->lte($check_in)) {
            throw new InvalidArgumentException('Check-out date must be after check-in date');
        }

        // Mínimo de noites
        $calculatedNights = $check_in->diffInDays($check_out);
        if ($calculatedNights < self::MIN_NIGHTS) {
            throw new InvalidArgumentException("Minimum stay is " . self::MIN_NIGHTS . " nights");
        }

        // Máximo de noites
        if ($calculatedNights > self::MAX_NIGHTS) {
            throw new InvalidArgumentException("Maximum stay is " . self::MAX_NIGHTS . " nights");
        }

        // Não pode reservar com mais de 1 ano de antecedência
        $maxAdvance = now()->addYear();
        if ($check_in->gt($maxAdvance)) {
            throw new InvalidArgumentException('Reservations cannot be made more than 1 year in advance');
        }
    }

    public function validateGuests(int $adults, int $children, int $infants): void
    {
        $totalGuests = $adults + $children;

        // Pelo menos 1 adulto
        if ($adults < 1) {
            throw new InvalidArgumentException('At least one adult is required');
        }

        // Limite máximo de hóspedes
        if ($totalGuests > self::MAX_GUESTS_TOTAL) {
            throw new InvalidArgumentException("Maximum " . self::MAX_GUESTS_TOTAL . " guests allowed");
        }

        // Crianças não podem ser negativas
        if ($children < 0 || $infants < 0) {
            throw new InvalidArgumentException('Number of children and infants cannot be negative');
        }
    }
    public function validateFinancials(
        float $price_per_night,
        float $cleaning_fee,
        float $service_fee,
        float $security_deposit,
        float $amount_paid,
        float $total_amount
    ): void {
        // Preços não podem ser negativos
        if ($price_per_night < 0 || $cleaning_fee < 0 || $service_fee < 0) {
            throw new InvalidArgumentException('Prices and fees cannot be negative');
        }

        // Valor pago não pode ser maior que o total
        if ($amount_paid > $total_amount) {
            throw new InvalidArgumentException('Amount paid cannot exceed total amount');
        }

        // Depósito de segurança razoável
        if ($security_deposit < 0) {
            throw new InvalidArgumentException('Security deposit cannot be negative');
        }
    }
}
