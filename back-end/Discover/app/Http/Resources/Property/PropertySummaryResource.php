<?php

namespace App\Http\Resources\Property;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertySummaryResource extends JsonResource
{

    /*
     *  6ºetapa -> recource - Resposta resumida do que vai para o cliente
     *
     *  7º etapa -> serviceProvider
     *
     * */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'summary' => $this->summary,
            'price_per_night' => (float) $this->price_per_night,
            'location' => [
                'neighborhood' => $this->neighborhood,
                'city' => $this->city->name,
            ],
            /*
            'main_image' => $this->images->first()?->url,
            'rating' => (float) $this->rating,
            'reviews_count' => $this->reviews_count,
            '_links' => [
                'self' => route('api.properties.show', $this->id)
            ]
            */
        ];
    }
}
