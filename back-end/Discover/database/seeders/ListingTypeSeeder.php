<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ListingType;

class ListingTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Lugar inteiro',
                'description' => 'Propriedade inteira para você',
                'slug' => 'entire-place',
                'order' => 1,
                'active' => true,
            ],
            [
                'name' => 'Quarto privado',
                'description' => 'Quarto privado em propriedade compartilhada',
                'slug' => 'private-room',
                'order' => 2,
                'active' => true,
            ],
            [
                'name' => 'Quarto compartilhado',
                'description' => 'Quarto compartilhado com outras pessoas',
                'slug' => 'shared-room',
                'order' => 3,
                'active' => true,
            ],
        ];

        foreach ($types as $type) {
            ListingType::create($type);
        }


    }
}
