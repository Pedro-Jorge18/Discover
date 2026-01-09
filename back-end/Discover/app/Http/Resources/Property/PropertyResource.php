<?php

namespace App\Http\Resources\Property;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Ensure location relations are loaded for clients that need country/city on edit forms
        $this->resource->loadMissing(['city.state.country']);
        $city = $this->city;
        $state = $city?->state;
        $country = $state?->country;
        $isAuthenticated = (bool) $request->user();
        return [

            'id' => $this->id,

            'title' => $this->title,
            'description' => $this->description,
            'summary' => $isAuthenticated ? $this->summary : null,

            'check_in_time' => $this->check_in_time ? $this->check_in_time->format('H:i') : null,
            'check_out_time' => $this->check_out_time ? $this->check_out_time->format('H:i') : null,

            // definição dos preços
            'price' => [
                'per_night' => (float)$this->price_per_night,
                'cleaning_fee' => (float)$this->cleaning_fee,
                'service_fee' => (float)$this->service_fee,
                'currency' => 'EUR',
                'formatted' => [
                    'per_night' => number_format($this->price_per_night, 2, ',', ''),
                    'cleaning_fee' => number_format($this->cleaning_fee, 2, ',', ''),
                    'service_fee' => number_format($this->service_fee, 2, ',', ''),
                ],
                'calculations' => [
                    'nightly_total' => (float)$this->price_per_night,
                    'first_night_total' => (float)$this->price_per_night + $this->cleaning_fee + $this->service_fee, // ✅ Primeira noite com taxas
                ]
            ],
            // definir o endereço
            'location' => [
                'address' => $this->address,
                'neighborhood' => $this->neighborhood,
                'postal_code' => $this->postal_code,
                'coordinates' => $isAuthenticated ? [
                    'latitude' => (float) $this->latitude,
                    'longitude' => (float) $this->longitude,
                ] : [
                    'latitude' => null,
                    'longitude' => null,
                ],
                'city' => $city ? [
                    'id' => $city->id,
                    'name' => $city->name,
                    'postal_code' => $city->postal_code,
                ] : null,
                'state' => $state ? [
                    'id' => $state->id,
                    'name' => $state->name,
                    'code' => $state->code,
                    'timezone' => $state->timezone,
                ] : null,
                'country' => $country ? [
                    'id' => $country->id,
                    'name' => $country->name,
                    'code' => $country->code,
                    'currency' => $country->currency,
                    'currency_symbol' => $country->currency_symbol,
                    'phone_code' => $country->phone_code,
                ] : null,
                // FULL FORMATTED ADDRESS
                'full_address' => $this->getFullAddress(),

            ],
            // definir o que pode e o que tem no imovel
            'capacity' => [
                'max_guests' => $this->max_guests,
                'bedrooms' => $this->bedrooms,
                'beds' => $this->beds,
                'bathrooms' => $this->bathrooms,
                'area' => $this->area ? $this->area . ' m²' : null,
            ],
            // Tipos e categorias
            'types' => [
                'property_type' => $this->whenLoaded('propertyType', function() {
                    return $this->propertyType ? [
                        'id' => $this->propertyType->id,
                        'name' => $this->propertyType->name,
                        'icon' => $this->propertyType->icon,
                    ] : null;
                }),
                'listing_type' => $this->whenLoaded('listingType', function() {
                    return $this->listingType ? [
                        'id' => $this->listingType->id,
                        'name' => $this->listingType->name,
                        'slug' => $this->listingType->slug,
                    ] : null;
                }),
            ],

            // Amenities
            'amenities' => $this->whenLoaded('amenities', function() {
                return $this->amenities->map(function($amenity) {
                    return [
                        'id' => $amenity->id,
                        'name' => $amenity->name,
                        'icon' => $amenity->icon,
                        'category' => $amenity->category ? [
                            'id' => $amenity->category->id,
                            'name' => $amenity->category->name,
                        ] : null,
                        'value' => $amenity->pivot ? [
                            'boolean' => $amenity->pivot->value_boolean,
                            'numeric' => $amenity->pivot->value_numeric,
                            'text' => $amenity->pivot->value_text,
                            'formatted' => $amenity->pivot->formatted_value,
                        ] : null,
                    ];
                });
            }),

            // configurações
            'settings' => [
                'instant_book' => (bool) $this->instant_book,
                'published' => (bool) $this->published,
            ],

            'host' => $this->whenLoaded('host', function() {
                return $this->host ? [
                    'id' => $this->host->id,
                    'name' => $this->host->name,
                    'email' => $this->host->email
                ] : null;
            }),
            'images' => PropertyImageResource::collection($this->whenLoaded('images')),
            
            // metricas
            'metrics' => [
                'rating' => (float) $this->rating,
                'reviews_count' => $this->reviews_count,
                'views' => $this->views,
            ],
            
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
