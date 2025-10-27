<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            [
                'name' => 'Brazil',
                'code' => 'BRA',
                'phone_code' => '+55',
                'currency' => 'BRL',
                'currency_symbol' => 'R$',
                'language' => 'pt',
                'active' => true,
            ],
            [
                'name' => 'United States',
                'code' => 'USA',
                'phone_code' => '+1',
                'currency' => 'USD',
                'currency_symbol' => '$',
                'language' => 'en',
                'active' => true,
            ],
            [
                'name' => 'Portugal',
                'code' => 'PRT',
                'phone_code' => '+351',
                'currency' => 'EUR',
                'currency_symbol' => '€',
                'language' => 'pt',
                'active' => true,
            ],
        ];

        foreach ($countries as $country) {
            Country::create($country);
        }


    }
}
