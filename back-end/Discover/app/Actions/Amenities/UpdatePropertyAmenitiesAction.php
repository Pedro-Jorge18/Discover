<?php

namespace App\Actions\Amenities;

use App\Models\Property;

class UpdatePropertyAmenitiesAction
{
    public function execute(Property $property, array $amenities): void
    {
        $amenitiesData = [];
        foreach ($amenities as $amenity) {
            $amenitiesData[$amenity['id']] = [
                'value_boolean' => $amenity['value_boolean'] ?? null,
                'value_numeric' => $amenity['value_numeric'] ?? null,
                'value_text' => $amenity['value_text'] ?? null,
            ];
        }

        $property->amenities()->sync($amenitiesData);
    }
}
