<?php

namespace App\Actions\Property;


class validatePropertyUpdateAction
{
    public function execute(array $data): void
    {
        // The price cannot be less than 1
        if (isset($data['price_per_night']) && $data['price_per_night'] < 1) {
            throw new \Exception('Price per night must be greater than 1');
        }

        // Validation of number of guests
        if (isset($data['max_guests']) && $data['max_guests'] < 1) {
            throw new \Exception('Maximum number of guests must be greater than 1');
        }

        // Validation of number of beds
        if (isset($data['beds']) && $data['beds'] < 1) {
            throw new \Exception('Beds must be greater than 1');
        }


    }
}
