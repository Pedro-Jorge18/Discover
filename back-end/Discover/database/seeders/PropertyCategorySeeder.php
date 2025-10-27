<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PropertyCategory;

class PropertyCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Praia',
                'description' => 'próximas ao mar',
                'icon' => 'beach_access',
                'order' => 1,
                'active' => true,
            ],
            [
                'name' => 'Montanha',
                'description' => 'regiões montanhosas',
                'icon' => 'landscape',
                'order' => 2,
                'active' => true,
            ],
            [
                'name' => 'Urbano',
                'description' => 'áreas urbanas',
                'icon' => 'location_city',
                'order' => 3,
                'active' => true,
            ],
            [
                'name' => 'Rural',
                'description' => ' áreas rurais',
                'icon' => 'agriculture',
                'order' => 4,
                'active' => true,
            ],
            [
                'name' => 'Luxo',
                'description' => 'Peopiedade de luxo',
                'icon' => 'diamond',
                'order' => 5,
                'active' => true,
            ],
        ];

        foreach ($categories as $category) {
            PropertyCategory::create($category);
        }


    }
}
