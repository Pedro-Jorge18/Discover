<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            RoleSeeder::class,
            CountrySeeder::class,
            StateSeeder::class,
            CitySeeder::class,
            PropertyTypeSeeder::class,
            ListingTypeSeeder::class,
            PropertyCategorySeeder::class,
            AmenityCategorySeeder::class,
            AmenitySeeder::class,
            ReservationStatusSeeder::class,
            PropertySeeder::class,
            PropertyImageSeeder::class,
            PaymentMethodSeeder::class,
            ReservationSeeder::class,
            PaymentSeeder::class,
            ConversationSeeder::class,
            ConversationMessageSeeder::class,
            FavoriteSeeder::class,
            MessageSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
