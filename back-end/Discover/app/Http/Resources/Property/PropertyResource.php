<?php

namespace App\Http\Resources\Property;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{

    /*  6ª etapa -> Resources - o que vai parecer para o usuário

        7º etapa -> serviceProvider
     *
     * */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'title' => $this->title,
            'description' => $this->description,
            'summary' => $this->summary,

            // definição dos preços
            'price' => [
                'per_night' => number_format($this->price_per_night,2,'.',''),
                'cleaning_fee' => number_format($this->cleaning_fee,2,'.',''),
                'service_fee' => number_format($this->service_fee,2,'.',''),
                'total_per_night' =>(float)$this->price_per_night + $this->cleaning_fee + $this->service_fee,
                'currency' => 'EUR',
            ],
            // definir o endereço
            'location' => [
                'address' => $this->address,
                'neighborhood' => $this->neighborhood,
                'postal_code' => $this->postal_code,
                'coordinates' => [
                    'latitude' => (float) $this->latitude,
                    'longitude' => (float) $this->longitude,
                ]
            ],
            // definir o que pode e o que tem no imovel
            'capacity' => [
                'max_guests' => $this->max_guests,
                'bedrooms' => $this->bedrooms,
                'beds' => $this->beds,
                'bathrooms' => $this->bathrooms,
                'area' => $this->area ? $this->area . ' m²' : null,
            ],
            // configurações
            'settings' => [
                'instant_book' => (bool) $this->instant_book,
                'published' => (bool) $this->published,
            ],

            /*
            'host' => new UserResource($this->whenLoaded('host')),
            'property_type' => new PropertyTypeResource($this->whenLoaded('propertyType')),
            'listing_type' => new ListingTypeResource($this->whenLoaded('listingType')),
            'city' => new CityResource($this->whenLoaded('city')),
            'images' => PropertyImageResource::collection($this->whenLoaded('images')),

            // metricas para futuras rotas
            'metrics' => [
                'rating' => (float) $this->rating,
                'reviews_count' => $this->reviews_count,
                'views' => $this->views,
            ],
            */
            'dates' => [
                'created_at' => $this->created_at?->toISOString(),
                'published_at' => $this->published_at?->toISOString(),
            ],
            /*
            '_links' => [
                'self' => route('api.properties.show', $this->id),
                'host' => $this->host_id ? route('api.users.show', $this->host_id) : null,
                'bookings' => route('api.properties.bookings.index', $this->id),
            ]
            */
        ];
    }
}
