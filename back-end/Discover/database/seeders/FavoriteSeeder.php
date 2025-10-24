<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FavoriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = Property::take(3)->get();
        $client = User::where('email', 'client@example.com')->first();

        foreach ($properties as $property) {
            Favorite::create([
                'user_id' => $client->id,
                'property_id' => $property->id,
            ]);
        }
    }
}
