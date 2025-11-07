<?php


namespace App\DTOs\Property;
use InvalidArgumentException;

class PropertyData
{
    /*
     4º etapa -> Dados a serem validados para ser tranfeirodas entre camadas

    5º etapa -> service

     * */
    public function __construct(
        public string $title,
        public string $description,
        public float $price_per_night,
        public string $address,
        public string $neighborhood,
        public string $postal_code,
        public int $city_id,
        public int $host_id,
        public int $property_type_id,
        public int $listing_type_id,
        public int $max_guests = 1,
        public int $bedrooms = 1,
        public int $beds = 1,
        public int $bathrooms = 1,

        public ?string $summary = null,
        public ?float  $latitude  = null,
        public ?float  $longitude = null,
        public ?float $cleaning_fee = 0,
        public ?float $service_fee = 0,
        public ?float $security_deposit = 0,
        public ?int $area = null,
        public ?int $floor = null,
        public string $check_in_time = '15:00',
        public string $check_out_time = '11:00',
        public ?int $min_nights = 1,
        public ?int $max_nights = 30

    )
    {
        if($this->price_per_night < 1){
            throw new InvalidArgumentException('price per night must be greater than 0');
        }
    }
    //recebe os dados da API
    public static function fromArray(array $data): self
    {
        return new self(
            title: $data['title'],
            description: $data['description'],
            price_per_night: $data['price_per_night'],
            address: $data['address'],
            neighborhood: $data['neighborhood'],
            postal_code: $data['postal_code'],
            city_id: $data['city_id'],
            host_id: $data['host_id'],
            property_type_id: $data['property_type_id'],
            listing_type_id: $data['listing_type_id'],
            max_guests: $data['max_guests'],
            bedrooms: $data['bedrooms'],
            beds: $data['beds'],
            bathrooms: $data['bathrooms'],

            summary: $data['summary'] ?? null,
            latitude: $data['latitude'] ?? null,
            longitude: $data['longitude'] ?? null,
            cleaning_fee: $data['cleaning_fee'] ?? 0.0,
            service_fee: $data['service_fee'] ?? 0.0,
            security_deposit: $data['security_deposit'] ?? 0.0,
            area: $data['area'] ?? null,
            floor: $data['floor'] ?? null,
            check_in_time: $data['check_in_time'] ?? '15:00',
            check_out_time: $data['check_out_time'] ?? '11:00',
            min_nights: $data['min_nights'] ?? 1,
            max_nights: $data['max_nights'] ?? 30

        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'summary' => $this->summary,
            'price_per_night' => $this->price_per_night,
            'address' => $this->address,
            'neighborhood' => $this->neighborhood,
            'postal_code' => $this->postal_code,
            'city_id' => $this->city_id,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'host_id' => $this->host_id,
            'property_type_id' => $this->property_type_id,
            'listing_type_id' => $this->listing_type_id,
            'max_guests' => $this->max_guests,
            'bedrooms' => $this->bedrooms,
            'beds' => $this->beds,
            'bathrooms' => $this->bathrooms,
            'cleaning_fee' => $this->cleaning_fee,
            'service_fee' => $this->service_fee,
            'security_deposit' => $this->security_deposit,
            'area' => $this->area,
            'floor' => $this->floor,
            'check_in_time' => $this->check_in_time,
            'check_out_time' => $this->check_out_time,
            'min_nights' => $this->min_nights,
            'max_nights' => $this->max_nights,

        ];
    }

}
