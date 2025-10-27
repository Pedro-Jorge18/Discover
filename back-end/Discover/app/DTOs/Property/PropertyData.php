<?php


namespace app\DTOs\Property;
use http\Exception\InvalidArgumentException;

class PropertyData
{
    public function __construct(
        public string $title,
        public string $description,
        public string $summary,
        public float $price_per_night,

        public string $address,
        public string $neighborhood,
        public string $postal_code,
        public int $city_id,
        public float  $latitude ,
        public float  $longitude,

        public int $property_type_id,
        public int $listing_type_id,
        public int $max_guests,
        public int $bedrooms,
        public int $beds,
        public int $bathrooms,

        public ?float $cleaning_fee = null,
        public ?float $service_fee = null,
        public ?float $security_deposit = null,
        public ?int $area = null,
        public ?int $floor = null,
        public ?int $min_nights = null,
        public ?int $max_nights = null
    )
    {
        if($price_per_night < 1){
            throw new InvalidArgumentException('price per night must be greater than 0');
        }
    }
    //recebe os dados da API
    public static function fromArray(array $data): self
    {
        return new self(
            title: $data['title'],
            description: $data['description'],
            summary: $data['summary'],
            price_per_night: $data['price_per_night'],
            address: $data['address'],
            neighborhood: $data['neighborhood'],
            postal_code: $data['postal_code'],
            city_id: $data['city_id'],
            latitude: $data['latitude'],
            longitude: $data['longitude'],
            property_type_id: $data['property_type_id'],
            listing_type_id: $data['listing_type_id'],
            max_guests: $data['max_guests'],
            bedrooms: $data['bedrooms'],
            beds: $data['beds'],
            bathrooms: $data['bathrooms'],
            cleaning_fee: $data['cleaning_fee'] ?? null,
            service_fee: $data['service_fee'] ?? null,
            security_deposit: $data['security_deposit'] ?? null,
            area: $data['area'] ?? null,
            floor: $data['floor'] ?? null,
            min_nights: $data['min_nights'] ?? null,
            max_nights: $data['max_nights'] ?? null

        );
    }

}
