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
                'name' => 'Portugal',
                'code' => 'PRT',
                'phone_code' => '+351',
                'currency' => 'EUR',
                'currency_symbol' => '€',
                'language' => 'pt',
                'active' => true,
            ],
            [
                'name' => 'Espanha',
                'code' => 'ESP',
                'phone_code' => '+34',
                'currency' => 'EUR',
                'currency_symbol' => '€',
                'language' => 'es',
                'active' => true,
            ],
            [
                'name' => 'França',
                'code' => 'FRA',
                'phone_code' => '+33',
                'currency' => 'EUR',
                'currency_symbol' => '€',
                'language' => 'fr',
                'active' => true,
            ],
            [
                'name' => 'Alemanha',
                'code' => 'DEU',
                'phone_code' => '+49',
                'currency' => 'EUR',
                'currency_symbol' => '€',
                'language' => 'de',
                'active' => true,
            ],
            [
                'name' => 'Itália',
                'code' => 'ITA',
                'phone_code' => '+39',
                'currency' => 'EUR',
                'currency_symbol' => '€',
                'language' => 'it',
                'active' => true,
            ],
            [
                'name' => 'Reino Unido',
                'code' => 'GBR',
                'phone_code' => '+44',
                'currency' => 'GBP',
                'currency_symbol' => '£',
                'language' => 'en',
                'active' => true,
            ],
            [
                'name' => 'Brasil',
                'code' => 'BRA',
                'phone_code' => '+55',
                'currency' => 'BRL',
                'currency_symbol' => 'R$',
                'language' => 'pt',
                'active' => true,
            ],
            [
                'name' => 'Estados Unidos',
                'code' => 'USA',
                'phone_code' => '+1',
                'currency' => 'USD',
                'currency_symbol' => '$',
                'language' => 'en',
                'active' => true,
            ],
        ];

        foreach ($countries as $country) {
            Country::create($country);
        }


    }
}
