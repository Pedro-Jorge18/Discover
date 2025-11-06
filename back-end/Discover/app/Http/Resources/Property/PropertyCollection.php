<?php

namespace App\Http\Resources\Property;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PropertyCollection extends ResourceCollection
{
    /*
     *  6º etapa -> recources - formatacao das paginas lista delas
     *
     *  7º etapa -> serviceProvider
     * */
    public function toArray(Request $request): array
    {
        return [
            'data' => PropertyResource::collection($this->collection),
            'meta' => [
                'total' => $this->resource->total(),
                'per_page' =>  $this->resource->perPage(),
                'current_page' => $this->resource->currentPage() ,
                'last_page' => $this->resource->lastPage(),
            ],

            'links' => [
                'first' => $this->resource->url(1),
                'last' => $this->resource->url($this->lastPage()),
                'prev' => $this->resource->previousPageUrl(),
                'next' => $this->resource->nextPageUrl(),
            ],

        ];
    }
}
