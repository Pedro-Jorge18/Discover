<?php

namespace App\Actions\Amenities;

use App\Models\Property;

class CreatePropertyAmenitiesAction
{
    public function execute(Property $property, array $amenities): void
    {
        foreach ($amenities as $amenityData) {
            $property->amenities()->attach($amenityData['id'], [
                'value_boolean' => $amenityData['value_boolean'] ?? null,
                'value_numeric' => $amenityData['value_numeric'] ?? null,
                'value_text' => $amenityData['value_text'] ?? null,
            ]);
        }
    }
}
