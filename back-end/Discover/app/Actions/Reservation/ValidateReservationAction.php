<?php

namespace App\Actions\Reservation;

use App\DTOs\Reservation\ReservationData;
use App\Models\Property;
use App\Models\Reservation;
use App\Exceptions\Reservation\ReservationCreationException;
use Carbon\Carbon;
use InvalidArgumentException;

class ValidateReservationAction
{
    /**
     * Valida todos os aspectos de uma reserva antes da criação
     */
    public function execute(ReservationData $data): void
    {
        // 1. BASIC VALIDATIONS (structural)
        $this->validateBasicRules($data);

        // 2. BUSINESS VALIDATIONS (database)
        $this->validateBusinessRules($data);
    }

    /**
     * Validações estruturais básicas
     */
    private function validateBasicRules(ReservationData $data): void
    {
        // Valid IDs
        if ($data->property_id < 1 || $data->user_id < 1 || $data->status_id < 1) {
            throw new InvalidArgumentException('IDs de propriedade, usuário e status devem ser maiores que 0.');
        }

        // Guests
        if ($data->adults < 1) {
            throw new InvalidArgumentException('At least one adult is required.');
        }
        if ($data->children < 0 || $data->infants < 0) {
            throw new InvalidArgumentException('The number of children and babies cannot be negative.');
        }

        // Datas
        $this->validateDates($data);

        // Prices
        $this->validatePricing($data);
    }

    /**
     * Validações específicas de datas
     */
    private function validateDates(ReservationData $data): void
    {
        if ($data->check_out->lessThanOrEqualTo($data->check_in)) {
            throw new InvalidArgumentException('Data de check-out deve ser após check-in.');
        }

        $nights = $data->check_in->diffInDays($data->check_out);
        if ($nights < 1) {
            throw new InvalidArgumentException('Reserva deve ter pelo menos 1 noite.');
        }

        if ($data->check_in->isPast()) {
            throw new InvalidArgumentException('Check-in não pode ser no passado.');
        }
    }

    /**
     * Validações de preços
     */
    private function validatePricing(ReservationData $data): void
    {
        if ($data->price_per_night <= 0) {
            throw new InvalidArgumentException('Preço por noite deve ser maior que 0.');
        }

        if ($data->amount_paid > $data->total_amount) {
            throw new InvalidArgumentException('Valor pago não pode exceder o total da reserva.');
        }

        if ($data->total_amount <= 0) {
            throw new InvalidArgumentException('Valor total da reserva deve ser maior que 0.');
        }
    }

    /**
     * Validações que precisam consultar o banco de dados
     */
    private function validateBusinessRules(ReservationData $data): void
    {
        $property = Property::find($data->property_id);

        if (!$property) {
            throw new ReservationCreationException(
                "Propriedade não encontrada.",
                404
            );
        }

        // Check if property is active
        if (!$property->active || !$property->published) {
            throw new ReservationCreationException(
                "Propriedade não está disponível para reservas."
            );
        }

        // Valida capacidade
        $this->validateCapacity($data, $property);

        // Valida conflitos de datas
        $this->validateDateConflicts($data, $property);

        // Validate property policies
        $this->validatePropertyPolicies($data, $property);
    }

    /**
     * Valida capacidade da propriedade
     */
    private function validateCapacity(ReservationData $data, Property $property): void
    {
        $totalGuests = $data->getTotalGuests();

        if ($totalGuests > $property->max_guests) {
            throw new ReservationCreationException(
                "Número de hóspedes ({$totalGuests}) excede a capacidade máxima ({$property->max_guests})."
            );
        }

        // Validate minimum nights
        $nights = $data->check_in->diffInDays($data->check_out);
        if ($property->min_nights && $nights < $property->min_nights) {
            throw new ReservationCreationException(
                "Mínimo de {$property->min_nights} noites necessário. Selecionado: {$nights} noites."
            );
        }
    }

    /**
     * Valida conflitos de datas com outras reservas
     */
    private function validateDateConflicts(ReservationData $data, Property $property): void
    {
        $hasConflict = Reservation::where('property_id', $property->id)
            ->where(function ($query) use ($data) {
                $query->where('check_in', '<', $data->check_out)
                    ->where('check_out', '>', $data->check_in);
            })

            ->whereHas('status', function ($query) {
                $query->whereIn('name', ['Pendente', 'Confirmada']);
            })
            ->exists();

        if ($hasConflict) {
            throw new ReservationCreationException(
                "Propriedade indisponível para as datas selecionadas."
            );
        }
    }

    /**
     * Valida políticas específicas da propriedade
     */
    private function validatePropertyPolicies(ReservationData $data, Property $property): void
    {
        $nights = $data->check_in->diffInDays($data->check_out);

        // Maximum nights
        if ($property->max_nights && $nights > $property->max_nights) {
            throw new ReservationCreationException(
                "Máximo de {$property->max_nights} noites permitido. Selecionado: {$nights} noites."
            );
        }

        // Check if it's possible to book 1 year in advance
        $maxAdvance = now()->addYear();
        if ($data->check_in->gt($maxAdvance)) {
            throw new ReservationCreationException(
                "Reservas só podem ser feitas com até 1 ano de antecedência."
            );
        }
    }
}
