<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reservations = Reservation::take(2)->get();
        $client = User::where('email', 'client@example.com')->first();

        foreach ($reservations as $reservation) {
            // Mensagem do cliente para o host
            Message::create([
                'reservation_id' => $reservation->id,
                'sender_id' => $client->id,
                'receiver_id' => $reservation->property->host_id,
                'message' => 'Olá! Acabei de fazer a reserva. Há alguma informação adicional que preciso saber?',
                'is_read' => true,
                'read_at' => now(),
                'type' => 'booking',
            ]);

            // Resposta do host
            Message::create([
                'reservation_id' => $reservation->id,
                'sender_id' => $reservation->property->host_id,
                'receiver_id' => $client->id,
                'message' => 'Obrigado pela reserva! Enviarei as instruções de check-in 24h antes da sua chegada.',
                'is_read' => false,
                'type' => 'booking',
            ]);
        }
    }
}
