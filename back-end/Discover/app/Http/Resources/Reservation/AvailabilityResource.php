<?php

namespace App\Http\Resources\Reservation;

use Illuminate\Http\Resources\Json\JsonResource;

class AvailabilityResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'available' => $this->available,
            'message' => $this->message,
            'property' => $this->when($this->available, [
                'id' => $this->property['id'],
                'title' => $this->property['title'],
                'max_guests' => $this->property['max_guests'],
            ]),
            'pricing' => $this->when($this->available, [
                'nights' => $this->pricing['nights'],
                'price_per_night' => $this->pricing['price_per_night'],
                'cleaning_fee' => $this->pricing['cleaning_fee'],
                'service_fee' => $this->pricing['service_fee'],
                'subtotal' => $this->pricing['subtotal'],
                'total_amount' => $this->pricing['total_amount'],
            ]),
            'dates' => $this->when($this->available, [
                'check_in' => $this->dates['check_in'],
                'check_out' => $this->dates['check_out'],
                'nights' => $this->dates['nights'],
            ]),
        ];
    }
}
