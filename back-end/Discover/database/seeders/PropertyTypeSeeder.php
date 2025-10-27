<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PropertyType;

class PropertyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Apartamento',
                'description' => 'Unidade em um edifício residencial',
                'icon' => 'apartment',
                'order' => 1,
                'active' => true,
            ],
            [
                'name' => 'Casa',
                'description' => 'Casa ou vila inteira',
                'icon' => 'house',
                'order' => 2,
                'active' => true,
            ],
            [
                'name' => 'Cabana',
                'description' => 'Moradia rústica ou de campo',
                'icon' => 'cabin',
                'order' => 3,
                'active' => true,
            ],
            [
                'name' => 'Quarto de Hotel',
                'description' => 'Quarto em um hotel ou resort',
                'icon' => 'hotel',
                'order' => 4,
                'active' => true,
            ],
        ];

        foreach ($types as $type) {
            PropertyType::create($type);
        }
    }
}
