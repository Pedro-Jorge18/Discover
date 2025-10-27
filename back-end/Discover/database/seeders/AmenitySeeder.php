<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Amenity;
use App\Models\AmenityCategory;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $essenciais = AmenityCategory::where('name', 'Essenciais')->first();
        $seguranca = AmenityCategory::where('name', 'Segurança')->first();
        $comodidades = AmenityCategory::where('name', 'Comodidades')->first();
        $cozinha = AmenityCategory::where('name', 'Cozinha')->first();
        $lazer = AmenityCategory::where('name', 'Lazer')->first();
        $exterior = AmenityCategory::where('name', 'Exterior')->first();

        $amenities = [
            // ESSENCIAIS
            ['amenity_category_id' => $essenciais->id, 'name' => 'Wi-Fi', 'icon' => 'wifi', 'value_type' => 'boolean', 'order' => 1],
            ['amenity_category_id' => $essenciais->id, 'name' => 'Ar-condicionado', 'icon' => 'ac_unit', 'value_type' => 'boolean', 'order' => 2],
            ['amenity_category_id' => $essenciais->id, 'name' => 'Aquecimento', 'icon' => 'thermostat', 'value_type' => 'boolean', 'order' => 3],
            ['amenity_category_id' => $essenciais->id, 'name' => 'Cozinha', 'icon' => 'kitchen', 'value_type' => 'boolean', 'order' => 4],
            ['amenity_category_id' => $essenciais->id, 'name' => 'Estacionamento gratuito', 'icon' => 'local_parking', 'value_type' => 'boolean', 'order' => 5],

            // SEGURANÇA
            ['amenity_category_id' => $seguranca->id, 'name' => 'Detector de fumaça', 'icon' => 'smoke_free', 'value_type' => 'boolean', 'order' => 1],
            ['amenity_category_id' => $seguranca->id, 'name' => 'Extintor de incêndio', 'icon' => 'fire_extinguisher', 'value_type' => 'boolean', 'order' => 2],
            ['amenity_category_id' => $seguranca->id, 'name' => 'Fechadura com senha', 'icon' => 'lock', 'value_type' => 'boolean', 'order' => 3],
            ['amenity_category_id' => $seguranca->id, 'name' => 'Kit de primeiros socorros', 'icon' => 'medical_services', 'value_type' => 'boolean', 'order' => 4],

            // COMODIDADES
            ['amenity_category_id' => $comodidades->id, 'name' => 'Piscina', 'icon' => 'pool', 'value_type' => 'boolean', 'order' => 1],
            ['amenity_category_id' => $comodidades->id, 'name' => 'Jacuzzi', 'icon' => 'hot_tub', 'value_type' => 'boolean', 'order' => 2],
            ['amenity_category_id' => $comodidades->id, 'name' => 'Sauna', 'icon' => 'sauna', 'value_type' => 'boolean', 'order' => 3],
            ['amenity_category_id' => $comodidades->id, 'name' => 'Academia', 'icon' => 'fitness_center', 'value_type' => 'boolean', 'order' => 4],
            ['amenity_category_id' => $comodidades->id, 'name' => 'Máquina de lavar', 'icon' => 'local_laundry_service', 'value_type' => 'boolean', 'order' => 5],

            // COZINHA
            ['amenity_category_id' => $cozinha->id, 'name' => 'Geladeira', 'icon' => 'kitchen', 'value_type' => 'boolean', 'order' => 1],
            ['amenity_category_id' => $cozinha->id, 'name' => 'Fogão', 'icon' => 'stove', 'value_type' => 'boolean', 'order' => 2],
            ['amenity_category_id' => $cozinha->id, 'name' => 'Micro-ondas', 'icon' => 'microwave', 'value_type' => 'boolean', 'order' => 3],
            ['amenity_category_id' => $cozinha->id, 'name' => 'Cafeteira', 'icon' => 'coffee_maker', 'value_type' => 'boolean', 'order' => 4],
            ['amenity_category_id' => $cozinha->id, 'name' => 'Utensílios de cozinha', 'icon' => 'restaurant', 'value_type' => 'boolean', 'order' => 5],

            // LAZER
            ['amenity_category_id' => $lazer->id, 'name' => 'TV', 'icon' => 'tv', 'value_type' => 'boolean', 'order' => 1],
            ['amenity_category_id' => $lazer->id, 'name' => 'Netflix', 'icon' => 'tv', 'value_type' => 'boolean', 'order' => 2],
            ['amenity_category_id' => $lazer->id, 'name' => 'Videogame', 'icon' => 'sports_esports', 'value_type' => 'boolean', 'order' => 3],
            ['amenity_category_id' => $lazer->id, 'name' => 'Área de jogos', 'icon' => 'casino', 'value_type' => 'boolean', 'order' => 4],

            // EXTERIOR
            ['amenity_category_id' => $exterior->id, 'name' => 'Varanda', 'icon' => 'balcony', 'value_type' => 'boolean', 'order' => 1],
            ['amenity_category_id' => $exterior->id, 'name' => 'Churrasqueira', 'icon' => 'outdoor_grill', 'value_type' => 'boolean', 'order' => 2],
            ['amenity_category_id' => $exterior->id, 'name' => 'Jardim', 'icon' => 'yard', 'value_type' => 'boolean', 'order' => 3],
            ['amenity_category_id' => $exterior->id, 'name' => 'Área de refeições externa', 'icon' => 'table_restaurant', 'value_type' => 'boolean', 'order' => 4],
        ];

        foreach ($amenities as $amenity) {
            Amenity::create($amenity);
        }


    }
}
