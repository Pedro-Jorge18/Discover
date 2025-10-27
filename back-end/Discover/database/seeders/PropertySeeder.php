<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;
use App\Models\PropertyType;
use App\Models\ListingType;
use App\Models\City;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $host = User::where('email', 'host@example.com')->first();

        if (!$host) {
            $this->command->error('Usuário host@example.com não encontrado!');
            return;
        }

        $houseType = PropertyType::where('name', 'Casa')->first();
        $apartmentType = PropertyType::where('name', 'Apartamento')->first();

        if (!$houseType || !$apartmentType) {
            $this->command->error('Tipos de propriedade não encontrados!');
            return;
        }

        $entirePlace = ListingType::where('slug', 'entire-place')->first();
        $privateRoom = ListingType::where('slug', 'private-room')->first();

        if (!$entirePlace || !$privateRoom) {
            $this->command->error('Tipos de listagem não encontrados!');
            return;
        }

        $recife = City::where('name', 'Recife')->first();
        $porto = City::where('name', 'Porto')->first();

        if (!$recife || !$porto) {
            $this->command->error('Cidades não encontradas!');
            return;
        }

        $properties = [
            [
                'host_id' => $host->id,
                'property_type_id' => $houseType->id,
                'listing_type_id' => $entirePlace->id,
                'city_id' => $recife->id,
                'address' => 'Rua do Sol, 123',
                'neighborhood' => 'Santo Antônio',
                'postal_code' => '50010-000',
                'latitude' => -8.0630,
                'longitude' => -34.8710,
                'title' => 'Casa Charmosa no Recife Antigo',
                'description' => 'Linda casa colonial no coração do Recife Antigo, próxima a todos os pontos turísticos.',
                'summary' => 'Casa colonial no centro histórico',
                'price_per_night' => 180.00,
                'cleaning_fee' => 60.00,
                'service_fee' => 25.00,
                'max_guests' => 4,
                'bedrooms' => 2,
                'beds' => 2,
                'bathrooms' => 1,
                'area' => 80,
                'published' => true,
                'instant_book' => true,
            ],
            [
                'host_id' => $host->id,
                'property_type_id' => $apartmentType->id,
                'listing_type_id' => $entirePlace->id,
                'city_id' => $porto->id,
                'address' => 'Rua de Santa Catarina, 456',
                'neighborhood' => 'Centro',
                'postal_code' => '40010-000',
                'latitude' => 41.1478,
                'longitude' => -8.6072,
                'title' => 'Apartamento com Vista para o Douro',
                'description' => 'Apartamento moderno com vista espetacular para o rio Douro, no coração do Porto.',
                'summary' => 'Apt com vista para o rio no Porto',
                'price_per_night' => 120.00,
                'cleaning_fee' => 40.00,
                'service_fee' => 20.00,
                'max_guests' => 3,
                'bedrooms' => 1,
                'beds' => 2,
                'bathrooms' => 1,
                'area' => 65,
                'floor' => 5,
                'published' => true,
                'instant_book' => false,
            ],
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }


    }
}
