<?php

namespace App\Actions\Reservation;

use App\Models\Property;
use App\Models\Reservation;
use Carbon\Carbon;

class CheckAvailabilityAction
{
    public function execute(int $propertyId, Carbon $checkIn, Carbon $checkOut, int $adults, int $children = 0, int $infants = 0): array
    {
        // 1. FIND PROPERTY
        $property = Property::find($propertyId);
        if (!$property) {
            return $this->error('Property not found');
        }

        // 2. VALIDATE DATES
        $dateError = $this->validateDates($checkIn, $checkOut, $property);
        if ($dateError) {
            return $this->error($dateError);
        }

        // 3. VALIDATE GUESTS
        $guestError = $this->validateGuests($property, $adults, $children, $infants);
        if ($guestError) {
            return $this->error($guestError);
        }

        // 4. CHECK FOR CONFLICTS
        if ($this->hasDateConflicts($propertyId, $checkIn, $checkOut)) {
            return $this->error('Selected dates are not available');
        }

        // 5. SUCCESS - CAN RESERVE
        return [
            'available' => true,
            'property' => [
                'id' => $property->id,
                'title' => $property->title,
                'max_guests' => $property->max_guests
            ],
            'nights' => $checkIn->diffInDays($checkOut)
        ];
    }

    private function validateDates(Carbon $checkIn, Carbon $checkOut, Property $property): ?string
    {
        // Allow check-in starting from today (not before today)
        if ($checkIn->startOfDay()->lt(Carbon::today())) {
            return 'Check-in date cannot be in the past';
        }

        $nights = $checkIn->diffInDays($checkOut);

        if ($property->min_nights && $nights < $property->min_nights) {
            return "Minimum stay is {$property->min_nights} nights";
        }

        if ($property->max_nights && $nights > $property->max_nights) {
            return "Maximum stay is {$property->max_nights} nights";
        }

        return null;
    }

    private function validateGuests(Property $property, int $adults, int $children, int $infants): ?string
    {
        $totalGuests = $adults + $children;

        if ($adults < 1) {
            return 'At least 1 adult is required';
        }

        if ($totalGuests > $property->max_guests) {
            return "Maximum {$property->max_guests} guests allowed";
        }

        return null;
    }

    private function hasDateConflicts(int $propertyId, Carbon $checkIn, Carbon $checkOut): bool
    {
        // Format dates consistently for database comparison
        $checkInDate = $checkIn->format('Y-m-d');
        $checkOutDate = $checkOut->format('Y-m-d');
        
        \Log::info('Checking date conflicts', [
            'property_id' => $propertyId,
            'requested_checkin' => $checkInDate,
            'requested_checkout' => $checkOutDate
        ]);
        
        $conflicts = Reservation::where('property_id', $propertyId)
            ->where(function ($query) use ($checkInDate, $checkOutDate) {
                // Detect overlaps: Any reservation where the dates overlap
                // Overlap when: (existing_check_in < new_check_out) AND (existing_check_out > new_check_in)
                // This blocks same dates and overlapping dates
                $query->whereRaw('check_in < ?', [$checkOutDate])
                      ->whereRaw('check_out > ?', [$checkInDate]);
            })
            ->whereHas('status', function ($query) {
                // Only check active reservations (not cancelled or completed)
                $query->whereIn('name', ['Pendente', 'Confirmada', 'Confirmed', 'Em Andamento', 'Pending', 'Devolvido']);
            })
            ->with('status')
            ->get();
            
        // Log all results for debugging
        \Log::info('Conflict check results', [
            'property_id' => $propertyId,
            'requested_checkin' => $checkInDate,
            'requested_checkout' => $checkOutDate,
            'conflicts_found' => $conflicts->count(),
            'conflicts' => $conflicts->map(fn($r) => [
                'id' => $r->id,
                'check_in' => $r->check_in,
                'check_out' => $r->check_out,
                'status' => $r->status->name ?? 'unknown'
            ])
        ]);
        
        return $conflicts->count() > 0;
    }

    private function error(string $message): array
    {
        return [
            'available' => false,
            'message' => $message
        ];
    }
}
