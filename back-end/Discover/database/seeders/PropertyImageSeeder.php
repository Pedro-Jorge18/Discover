<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropertyImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = Property::all();

        $sampleImages = [
            [
                'image_path' => 'properties/sample/living-room.jpg',
                'image_name' => 'Sala de Estar',
                'caption' => 'Confortável sala de estar',
                'alt_text' => 'Sala de estar da propriedade',
            ],
            [
                'image_path' => 'properties/sample/bedroom.jpg',
                'image_name' => 'Quarto Principal',
                'caption' => 'Quarto espaçoso com cama queen',
                'alt_text' => 'Quarto principal da propriedade',
            ],
            [
                'image_path' => 'properties/sample/kitchen.jpg',
                'image_name' => 'Cozinha',
                'caption' => 'Cozinha totalmente equipada',
                'alt_text' => 'Cozinha da propriedade',
            ],
        ];

        foreach ($properties as $property) {
            foreach ($sampleImages as $index => $image) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $image['image_path'],
                    'image_name' => $image['image_name'],
                    'order' => $index,
                    'is_primary' => $index === 0, // Primeira imagem é principal
                    'caption' => $image['caption'],
                    'alt_text' => $image['alt_text'],
                    'file_size' => 2048000, // 2MB
                    'file_type' => 'image/jpeg',
                ]);
            }
        }
    }
}
