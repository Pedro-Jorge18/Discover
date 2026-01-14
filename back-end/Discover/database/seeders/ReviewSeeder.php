<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Reservation;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Create some example reviews
        $reservations = Reservation::take(2)->get();
        $client = User::where('email', 'client@example.com')->first();

        foreach ($reservations as $reservation) {
            Review::create([
                'property_id' => $reservation->property_id,
                'user_id' => $client->id,
                'reservation_id' => $reservation->id,
                'rating_cleanliness' => 5,
                'rating_communication' => 4,
                'rating_checkin' => 5,
                'rating_accuracy' => 5,
                'rating_location' => 4,
                'rating_value' => 5,
                'rating_overall' => 5,
                'comment' => 'Ótima experiência! Localização perfeita e anfitrião muito atencioso.',
                'recommend' => true,
            ]);
        }


    }
}
