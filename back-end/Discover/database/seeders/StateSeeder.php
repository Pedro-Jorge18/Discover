<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\State;
use App\Models\Country;

class StateSeeder extends Seeder
{
    public function run(): void
    {
        $brazil = Country::where('code', 'BRA')->first();
        $usa = Country::where('code', 'USA')->first();

        $states = [

            ['country_id' => $brazil->id, 'name' => 'Pernambuco', 'code' => 'PE', 'timezone' => 'America/Pernambuco'],
            ['country_id' => $brazil->id, 'name' => 'Rio de Janeiro', 'code' => 'RJ', 'timezone' => 'America/Sao_Paulo'],


            // EUA

            ['country_id' => $usa->id, 'name' => 'Nova York', 'code' => 'NY', 'timezone' => 'America/New_York'],
            ['country_id' => $usa->id, 'name' => 'Flórida', 'code' => 'FL', 'timezone' => 'America/New_York'],

            ['country_id' => $usa->id, 'name' => 'Porto', 'code' => 'OPO', 'timezone' => 'Europe/Porto'],
            ['country_id' => $usa->id, 'name' => 'Lisbon', 'code' => 'Lis', 'timezone' => 'America/Lisbon'],
        ];

        foreach ($states as $state) {
            State::create($state);
        }


    }
}
