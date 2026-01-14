<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;
use App\Models\PropertyType;
use App\Models\ListingType;
use App\Models\City;
use App\Models\PropertyImage;

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
        $cabinType = PropertyType::where('name', 'Cabana')->first();
        $hotelType = PropertyType::where('name', 'Quarto de Hotel')->first();

        if (!$houseType || !$apartmentType || !$cabinType || !$hotelType) {
            $this->command->error('Tipos de propriedade não encontrados!');
            return;
        }

        $entirePlace = ListingType::where('slug', 'entire-place')->first();
        $privateRoom = ListingType::where('slug', 'private-room')->first();
        $sharedRoom = ListingType::where('slug', 'shared-room')->first();

        if (!$entirePlace || !$privateRoom || !$sharedRoom) {
            $this->command->error('Tipos de listagem não encontrados!');
            return;
        }

        $recife = City::where('name', 'Recife')->first();
        $porto = City::where('name', 'Porto')->first();

        if (!$recife || !$porto) {
            $this->command->error('Cidades não encontradas!');
            return;
        }

        // CLEAN ONLY IF EMPTY (to avoid duplicates)
        $existingCount = Property::count();
        if ($existingCount > 0) {
            $this->command->info("⚠️  Já existem {$existingCount} propriedades. Pulando criação...");
            return;
        }

        // PROPRIEDADES FIXAS (2 primeiras)
        $fixedProperties = [
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
                'security_deposit' => 300.00,
                'max_guests' => 4,
                'bedrooms' => 2,
                'beds' => 2,
                'bathrooms' => 1,
                'area' => 80,
                'check_in_time' => '15:00',
                'check_out_time' => '11:00',
                'min_nights' => 2,
                'max_nights' => 30,
                'published' => true,
                'active' => true,
                'instant_book' => true,
                'rating' => 4.8,
                'reviews_count' => 24,
                'views' => 1560,
                'published_at' => now()->subMonths(3),
            ],
            [
                'host_id' => $host->id,
                'property_type_id' => $apartmentType->id,
                'listing_type_id' => $entirePlace->id,
                'city_id' => $porto->id,
                'address' => 'Rua de Santa Catarina, 456',
                'neighborhood' => 'Centro',
                'postal_code' => '40000-000',
                'latitude' => 41.1478,
                'longitude' => -8.6072,
                'title' => 'Apartamento com Vista para o Douro',
                'description' => 'Apartamento moderno com vista espetacular para o rio Douro, no coração do Porto.',
                'summary' => 'Apt com vista para o rio no Porto',
                'price_per_night' => 120.00,
                'cleaning_fee' => 40.00,
                'service_fee' => 20.00,
                'security_deposit' => 200.00,
                'max_guests' => 3,
                'bedrooms' => 1,
                'beds' => 2,
                'bathrooms' => 1,
                'area' => 65,
                'floor' => 5,
                'check_in_time' => '14:00',
                'check_out_time' => '10:00',
                'min_nights' => 3,
                'max_nights' => 60,
                'published' => true,
                'active' => true,
                'instant_book' => false,
                'rating' => 4.5,
                'reviews_count' => 18,
                'views' => 2030,
                'published_at' => now()->subMonths(5),
            ],
        ];

        // CRIAR AS 2 PROPRIEDADES FIXAS
        foreach ($fixedProperties as $propertyData) {
            $property = Property::create($propertyData);
            $this->addImagesToProperty($property, 'casa');
            $this->command->info("✅ Propriedade fixa: {$property->title}");
        }

        // CREATE 10 RANDOM PROPERTIES
        $this->createRandomProperties($host, [
            'property_types' => [$houseType, $apartmentType, $cabinType, $hotelType],
            'listing_types' => [$entirePlace, $privateRoom, $sharedRoom],
            'cities' => [$recife, $porto]
        ]);

        $this->command->info('🎉 Total: 12 propriedades criadas!');
    }

    private function createRandomProperties($host, $types): void
    {
        $this->command->info('🎲 Criando 10 propriedades aleatórias...');

        $titles = [
            'Espaço Aconchegante para sua Estadia',
            'Apartamento Moderno no Centro',
            'Casa Ampliada com Jardim',
            'Cabana Romântica na Natureza',
            'Studio Perfeito para Casais',
            'Loft com Design Contemporâneo',
            'Cobertura com Vista Panorâmica',
            'Chalé Familiar nas Montanhas',
            'Flat Executivo Próximo ao Negócios',
            'Vila Privativa para Grupos',
            'Bangalô à Beira-Mar',
            'Sobrado Histórico Restaurado',
            'Quarto Confortável com Varanda',
            'Espaço Minimalista e Funcional',
            'Refúgio Tranquilo no Campo'
        ];

        $descriptions = [
            'Local perfeito para relaxar e aproveitar momentos especiais.',
            'Com todas as comodidades necessárias para uma estadia confortável.',
            'Próximo aos principais pontos turísticos e restaurantes da região.',
            'Ambiente iluminado e arejado, perfeito para descansar após um dia de passeios.',
            'Conta com Wi-Fi rápido e todos os eletrodomésticos necessários.',
            'Ideal para quem busca conforto e praticidade em uma localização privilegiada.',
            'Decoração cuidadosamente pensada para oferecer o máximo de conforto.',
            'Espaço versátil que atende tanto a viagens a trabalho quanto a turismo.',
            'Com área externa para aproveitar os dias ensolarados.',
            'Localização estratégica com fácil acesso ao transporte público.'
        ];

        $neighborhoods = ['Centro', 'Zona Sul', 'Praia', 'Histórico', 'Residencial', 'Comercial', 'Rural', 'Universitário'];

        for ($i = 1; $i <= 10; $i++) {
            $propertyType = $types['property_types'][array_rand($types['property_types'])];
            $listingType = $types['listing_types'][array_rand($types['listing_types'])];
            $city = $types['cities'][array_rand($types['cities'])];

            // Determinar capacidade baseada no tipo
            if ($listingType->slug == 'private-room') {
                $maxGuests = rand(1, 2);
                $bedrooms = 1;
            } elseif ($propertyType->name == 'Cabana') {
                $maxGuests = rand(1, 4);
                $bedrooms = rand(1, 2);
            } else {
                $maxGuests = rand(2, 8);
                $bedrooms = rand(1, 4);
            }

            // Criar propriedade
            $property = Property::create([
                'host_id' => $host->id,
                'property_type_id' => $propertyType->id,
                'listing_type_id' => $listingType->id,
                'city_id' => $city->id,

                'address' => 'Rua ' . $this->generateStreetName() . ', ' . rand(1, 999),
                'neighborhood' => $neighborhoods[array_rand($neighborhoods)],
                'postal_code' => str_pad(rand(10000, 99999), 5, '0', STR_PAD_LEFT) . '-' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT),
                'latitude' => $city->name == 'Recife' ? -8.0 + (rand(-100, 100) / 1000) : 41.1 + (rand(-100, 100) / 1000),
                'longitude' => $city->name == 'Recife' ? -34.8 + (rand(-100, 100) / 1000) : -8.6 + (rand(-100, 100) / 1000),

                'title' => $titles[array_rand($titles)] . ' ' . $i,
                'description' => $descriptions[array_rand($descriptions)] . ' ' . $descriptions[array_rand($descriptions)],
                'summary' => 'Propriedade ' . $i . ' - ' . $city->name,

                'price_per_night' => rand(80, 400),
                'cleaning_fee' => rand(30, 120),
                'service_fee' => rand(15, 50),
                'security_deposit' => rand(0, 1) ? rand(200, 800) : 0,

                'max_guests' => $maxGuests,
                'bedrooms' => $bedrooms,
                'beds' => max($bedrooms, rand(1, $maxGuests)),
                'bathrooms' => rand(1, 3),

                'area' => rand(40, 200),
                'floor' => ($propertyType->name == 'Apartamento') ? rand(1, 15) : null,

                'check_in_time' => '15:00',
                'check_out_time' => '11:00',
                'min_nights' => rand(1, 4),
                'max_nights' => rand(7, 60),

                'published' => true,
                'active' => true,
                'instant_book' => rand(0, 1) == 1,

                'rating' => number_format(4.0 + (rand(0, 10) / 10), 1),
                'reviews_count' => rand(5, 50),
                'views' => rand(100, 2000),

                'published_at' => now()->subDays(rand(1, 365)),
                'created_at' => now()->subDays(rand(365, 730)),
            ]);

            // Adicionar imagens
            $this->addImagesToProperty($property, strtolower($propertyType->name));

            $this->command->info("   ✅ Propriedade {$i}: {$property->title}");
        }
    }

    private function generateStreetName(): string
    {
        $streets = [
            'das Flores', 'do Comércio', 'Principal', 'da Praia', 'dos Ipês', 'Central',
            'das Palmeiras', 'do Sol', 'da Liberdade', 'das Acácias', 'São João',
            'Boa Vista', 'Nova Esperança', 'das Rosas', 'Alto do Monte'
        ];

        return $streets[array_rand($streets)];
    }

    private function addImagesToProperty($property, $propertyType): void
    {
        $images = [
            'casa' => [
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
            ],
            'apartamento' => [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
            ],
            'cabana' => [
                'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            ],
            'quarto de hotel' => [
                'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
            ],
            'default' => [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            ]
        ];

        $typeKey = strtolower($propertyType);
        $imageList = isset($images[$typeKey]) ? $images[$typeKey] : $images['default'];

        $numImages = rand(2, 4);

        for ($i = 0; $i < $numImages; $i++) {
            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $imageList[$i % count($imageList)],
                'image_name' => 'Imagem ' . ($i + 1),
                'order' => $i,
                'is_primary' => $i === 0,
                'caption' => $this->getRandomCaption(),
                'alt_text' => $property->title,
                'file_size' => rand(1000000, 4000000),
                'file_type' => 'image/jpeg',
            ]);
        }
    }

    private function getRandomCaption(): string
    {
        $captions = [
            'Vista incrível da propriedade',
            'Espaço confortável e bem decorado',
            'Ambiente acolhedor para relaxar',
            'Localização privilegiada',
            'Cozinha totalmente equipada',
            'Quarto espaçoso e iluminado',
            'Área externa para momentos especiais',
            'Design moderno e funcional',
        ];

        return $captions[array_rand($captions)];
    }
}
