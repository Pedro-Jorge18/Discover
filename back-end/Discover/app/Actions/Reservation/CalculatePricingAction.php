<?php

namespace App\Actions\Reservation;

use App\Models\Property;
use Carbon\Carbon;

class CalculatePricingAction
{
    /**
     * Calcula todos os valores financeiros para uma reserva
     */
    public function execute(Property $property, Carbon $checkIn, Carbon $checkOut): array
    {
        $nights = $checkIn->diffInDays($checkOut);

        // Cálculos principais
        $subtotal = $this->calculateSubtotal($property->price_per_night, $nights);
        $totalAmount = $this->calculateTotalAmount($subtotal, $property->cleaning_fee, $property->service_fee);

        return [
            'nights' => $nights,
            'price_per_night' => $property->price_per_night,
            'cleaning_fee' => $property->cleaning_fee,
            'service_fee' => $property->service_fee,
            'security_deposit' => $property->security_deposit,
            'subtotal' => $subtotal,
            'total_amount' => $totalAmount,

            // Valores formatados para exibição
            'formatted' => [
                'price_per_night' => number_format($property->price_per_night, 2, '.', ''),
                'cleaning_fee' => number_format($property->cleaning_fee, 2, '.', ''),
                'service_fee' => number_format($property->service_fee, 2, '.', ''),
                'subtotal' => number_format($subtotal, 2, '.', ''),
                'total_amount' => number_format($totalAmount, 2, '.', ''),
            ]
        ];
    }

    /**
     * Calcula o subtotal (preço das noites)
     */
    private function calculateSubtotal(float $pricePerNight, int $nights): float
    {
        return $pricePerNight * $nights;
    }

    /**
     * Calcula o valor total com todas as taxas
     */
    private function calculateTotalAmount(float $subtotal, float $cleaningFee, float $serviceFee): float
    {
        return $subtotal + $cleaningFee + $serviceFee;
    }

    /**
     * Calcula o valor devido (total - já pago)
     */
    public function calculateBalanceDue(float $totalAmount, float $amountPaid = 0): float
    {
        return max(0, $totalAmount - $amountPaid);
    }

    /**
     * Calcula preço para múltiplas propriedades (futuro uso)
     */
    public function calculateMultipleProperties(array $properties, Carbon $checkIn, Carbon $checkOut): array
    {
        $results = [];

        foreach ($properties as $property) {
            $results[$property->id] = $this->execute($property, $checkIn, $checkOut);
        }

        return $results;
    }
}
