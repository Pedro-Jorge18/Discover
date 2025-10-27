<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AmenityCategory;

class AmenityCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Essenciais',
                'description' => 'Itens essenciais para a estadia',
                'icon' => 'home',
                'order' => 1,
                'active' => true,
            ],
            [
                'name' => 'Segurança',
                'description' => 'Itens de segurança da propriedade',
                'icon' => 'security',
                'order' => 2,
                'active' => true,
            ],
            [
                'name' => 'Comodidades',
                'description' => 'Comodidades oferecidas',
                'icon' => 'spa',
                'order' => 3,
                'active' => true,
            ],
            [
                'name' => 'Cozinha',
                'description' => 'Itens disponíveis na cozinha',
                'icon' => 'kitchen',
                'order' => 4,
                'active' => true,
            ],
            [
                'name' => 'Lazer',
                'description' => 'Itens de lazer e entretenimento',
                'icon' => 'tv',
                'order' => 5,
                'active' => true,
            ],
            [
                'name' => 'Exterior',
                'description' => 'Áreas e itens externos',
                'icon' => 'yard',
                'order' => 6,
                'active' => true,
            ],
        ];

        foreach ($categories as $category) {
            AmenityCategory::create($category);
        }


    }
}
