<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\State;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $pe = State::where('code', 'PE')->first();
        $porto = State::where('code', 'POR')->first();


        $cities = [

            ['state_id' => $pe->id, 'name' => 'Recife', 'postal_code' => '01001-000', 'latitude' => -8.05428, 'longitude' => -34.8813],


            ['state_id' => $porto->id, 'name' => 'Porto', 'postal_code' => '4000-000', 'latitude' => 41.1579, 'longitude' => -8.6291],
        ];

        foreach ($cities as $city) {
            City::create($city);
        }


    }
}
