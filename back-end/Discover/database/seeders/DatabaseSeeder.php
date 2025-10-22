<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            ListingTypeSeeder::class,
            PropertyTypeSeeder::class,
            ReservationStatusSeeder::class,
            AmenityCategorySeeder::class,
            AmenitySeeder::class,
            PropertyCategorySeeder::class,
            CountrySeeder::class,
            StateSeeder::class,
            CitySeeder::class,

        ]);
    }
}
