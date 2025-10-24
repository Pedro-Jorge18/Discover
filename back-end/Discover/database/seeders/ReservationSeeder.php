<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\Property;
use App\Models\User;
use App\Models\ReservationStatus;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $properties = Property::take(2)->get();
        $client = User::where('email', 'client@example.com')->first();
        $confirmedStatus = ReservationStatus::where('name', 'Confirmada')->first();
        $pendingStatus = ReservationStatus::where('name', 'Pendente')->first();

        foreach ($properties as $index => $property) {
            $checkIn = Carbon::now()->addDays(30 + ($index * 15));
            $checkOut = $checkIn->copy()->addDays(5);
            $nights = $checkIn->diffInDays($checkOut);

            $pricePerNight = $property->price_per_night;
            $subtotal = $pricePerNight * $nights;
            $totalAmount = $subtotal + $property->cleaning_fee + $property->service_fee;

            $status = $index === 0 ? $confirmedStatus : $pendingStatus;

            Reservation::create([
                'property_id' => $property->id,
                'user_id' => $client->id,
                'status_id' => $status->id,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'nights' => $nights,
                'adults' => 2,
                'children' => $index === 0 ? 1 : 0,
                'infants' => 0,
                'special_requests' => $index === 0 ? 'Precisamos de um berço extra' : null,
                'price_per_night' => $pricePerNight,
                'cleaning_fee' => $property->cleaning_fee,
                'service_fee' => $property->service_fee,
                'security_deposit' => 200.00,
                'subtotal' => $subtotal,
                'total_amount' => $totalAmount,
                'amount_paid' => $status->name === 'Confirmada' ? $totalAmount : 0,
                'payment_method' => 'credit_card',
                'transaction_id' => $status->name === 'Confirmada' ? 'tx_' . Str::random(10) : null,
                'payment_date' => $status->name === 'Confirmada' ? now() : null,
                'payment_status' => $status->name === 'Confirmada' ? 'paid' : 'pending',
                'reservation_code' => 'RES' . Str::upper(Str::random(8)),
                'confirmed_at' => $status->name === 'Confirmada' ? now() : null,
            ]);
        }
    }
}
