<?php

namespace Database\Seeders;

use App\Models\ReservationStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReservationStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Pendente',
                'description' => 'Reserva aguardando confirmação',
                'color' => '#FFA500',
                'order' => 1,
                'active' => true,
            ],
            [
                'name' => 'Confirmada',
                'description' => 'Reserva confirmada e paga',
                'color' => '#22C55E',
                'order' => 2,
                'active' => true,
            ],
            [
                'name' => 'Em Andamento',
                'description' => 'Hóspede está na propriedade',
                'color' => '#3B82F6',
                'order' => 3,
                'active' => true,
            ],
            [
                'name' => 'Concluída',
                'description' => 'Reserva finalizada com sucesso',
                'color' => '#6B7280',
                'order' => 4,
                'active' => true,
            ],
            [
                'name' => 'Cancelada',
                'description' => 'Reserva cancelada',
                'color' => '#EF4444',
                'order' => 5,
                'active' => true,
            ],
        ];

        foreach ($statuses as $status) {
            ReservationStatus::create($status);
        }
    }
}
