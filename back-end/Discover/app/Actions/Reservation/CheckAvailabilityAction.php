<?php

namespace App\Actions\Reservation;

use App\DTOs\Reservation\AvailabilityResult;
use App\Exceptions\Reservation\ReservationConflictException;
use App\Exceptions\Reservation\ReservationCapacityException;
use App\Exceptions\Reservation\PropertyNotAvailableException;
use App\Models\Property;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CheckAvailabilityAction
{
    /**
     *
     * @param int $propertyId
     * @param Carbon $checkIn
     * @param Carbon $checkOut
     * @param int $adults
     * @param int $children
     * @param int $infants
     * @return AvailabilityResult
     */
    public function execute(
        int $propertyId,
        Carbon $checkIn,
        Carbon $checkOut,
        int $adults = 1,
        int $children = 0,
        int $infants = 0
    ): AvailabilityResult {
        try {
            //  ENCONTRA A PROPRIEDADE
            $property = Property::with('host')->find($propertyId);

            if (!$property) {
                return AvailabilityResult::validationFailed([
                    'property_id' => 'Property not found.'
                ]);
            }

            //  VALIDA STATUS DA PROPRIEDADE
            if (!$this->validatePropertyStatus($property)) {
                return AvailabilityResult::validationFailed([
                    'property' => 'Property is not available for reservations.'
                ]);
            }

            //  VALIDA DATAS
            $dateValidation = $this->validateDates($checkIn, $checkOut, $property);
            if (!$dateValidation['valid']) {
                return AvailabilityResult::validationFailed($dateValidation['errors']);
            }

            //  VALIDA CAPACIDADE
            $capacityValidation = $this->validateCapacity($property, $adults, $children, $infants);
            if (!$capacityValidation['valid']) {
                return AvailabilityResult::validationFailed($capacityValidation['errors']);
            }

            //  VERIFICA CONFLITOS DE RESERVA
            $conflicts = $this->checkReservationConflicts($propertyId, $checkIn, $checkOut);
            if (!empty($conflicts)) {
                return AvailabilityResult::conflicted($conflicts, $this->formatConflictMessage($conflicts));
            }

            //  TODAS AS VALIDAÇÕES PASSARAM
            return AvailabilityResult::available();

        } catch (\Exception $e) {
            // RO INESPERADO
            return AvailabilityResult::validationFailed([
                'system' => 'Unable to check availability at this time.'
            ]);
        }
    }

    //Valida se a propriedade está disponível para reservas
    private function validatePropertyStatus(Property $property): bool
    {
        return $property->published && $property->active;
    }

    //Valida as datas conforme regras da propriedade
    private function validateDates(Carbon $checkIn, Carbon $checkOut, Property $property): array
    {
        $errors = [];
        $nights = $checkIn->diffInDays($checkOut);

        //  Check-in não pode ser no passado
        if ($checkIn->isPast()) {
            $errors['check_in'] = 'Check-in date cannot be in the past.';
        }

        //  Mínimo de noites
        if ($property->min_nights && $nights < $property->min_nights) {
            $errors['nights'] = "Minimum stay is {$property->min_nights} nights.";
        }

        //  Máximo de noites
        if ($property->max_nights && $nights > $property->max_nights) {
            $errors['nights'] = "Maximum stay is {$property->max_nights} nights.";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    //Valida capacidade da propriedade
    private function validateCapacity(Property $property, int $adults, int $children, int $infants): array
    {
        $errors = [];
        $totalGuests = $adults + $children;

        // Pelo menos 1 adulto
        if ($adults < 1) {
            $errors['adults'] = 'At least one adult is required.';
        }

        //  Excede capacidade máxima
        if ($totalGuests > $property->max_guests) {
            $errors['guests'] = "This property accommodates maximum {$property->max_guests} guests.";
        }

        //  Números negativos
        if ($children < 0 || $infants < 0) {
            $errors['guests'] = 'Number of children and infants cannot be negative.';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    //Verifica conflitos com reservas existentes
    private function checkReservationConflicts(int $propertyId, Carbon $checkIn, Carbon $checkOut): array
    {
        $conflictingReservations = Reservation::where('property_id', $propertyId)
            ->active()->where(function ($query) use ($checkIn, $checkOut) {
                // Lógica de conflito: reservas que se sobrepõem
                $query->whereBetween('check_in', [$checkIn, $checkOut->copy()->subDay()])
                    ->orWhereBetween('check_out', [$checkIn->copy()->addDay(), $checkOut])
                    ->orWhere(function ($q) use ($checkIn, $checkOut) {
                        $q->where('check_in', '<=', $checkIn)
                            ->where('check_out', '>=', $checkOut);
                    });
            })
            ->get();

        if ($conflictingReservations->isEmpty()) {
            return [];
        }

        return $conflictingReservations->map(function ($reservation) {
            return [
                'reservation_code' => $reservation->reservation_code,
                'check_in' => $reservation->check_in->toDateString(),
                'check_out' => $reservation->check_out->toDateString(),
                'status' => $reservation->status->name,
            ];
        })->toArray();
    }

   //Formata mensagem de conflito para o usuário
    private function formatConflictMessage(array $conflicts): string
    {
        if (empty($conflicts)) {
            return 'No conflicts found.';
        }

        $conflict = $conflicts[0]; // Pega o primeiro conflito
        return "Property is not available. Conflicting reservation {$conflict['reservation_code']} from {$conflict['check_in']} to {$conflict['check_out']}.";
    }

       public function isAvailable(int $propertyId, Carbon $checkIn, Carbon $checkOut): bool
    {
        $result = $this->execute($propertyId, $checkIn, $checkOut);
        return $result->available;
    }
}
