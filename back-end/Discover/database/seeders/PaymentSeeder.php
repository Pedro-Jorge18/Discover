<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use App\Models\PaymentMethod;
use Illuminate\Support\Str;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $reservations = Reservation::where('payment_status', 'paid')->get();

        foreach ($reservations as $reservation) {
            $user = User::find($reservation->user_id);
            $paymentMethod = PaymentMethod::where('user_id', $user->id)
                ->where('is_default', true)
                ->first();

            if ($paymentMethod) {
                Payment::create([
                    'reservation_id' => $reservation->id,
                    'user_id' => $reservation->user_id,
                    'payment_method_id' => $paymentMethod->id,
                    'payment_gateway' => $paymentMethod->provider,
                    'gateway_payment_id' => 'pi_' . Str::random(14),
                    'gateway_intent_id' => 'pi_' . Str::random(14),
                    'amount' => $reservation->total_amount,
                    'gateway_fee' => $reservation->total_amount * 0.029 + 0.30,
                    'currency' => 'BRL',
                    'status' => 'completed',
                    'processed_at' => now(),
                    'description' => 'Pagamento da reserva #' . $reservation->reservation_code,
                ]);
            }
        }
    }
}
