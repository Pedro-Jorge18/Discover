<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Refund;
use App\Models\Reservation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RefundSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar uma reserva cancelada para testar reembolso
        $cancelledReservation = Reservation::create([
            // ... dados da reserva cancelada
            'payment_status' => 'refunded',
        ]);

        $payment = Payment::create([
            // ... dados do pagamento
            'reservation_id' => $cancelledReservation->id,
            'status' => 'refunded',
        ]);

        Refund::create([
            'payment_id' => $payment->id,
            'reservation_id' => $cancelledReservation->id,
            'amount' => $payment->amount * 0.8, // 80% de reembolso
            'reason' => 'Cancelamento por parte do cliente',
            'status' => 'processed',
            'gateway_refund_id' => 're_' . str_random(14),
            'notes' => 'Reembolso processado conforme política de cancelamento',
            'processed_at' => now(),
        ]);
    }
}
