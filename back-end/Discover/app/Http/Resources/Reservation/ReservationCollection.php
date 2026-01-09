<?php

namespace App\Http\Resources\Reservation;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ReservationCollection extends ResourceCollection
{
    /**
     * Each item in the collection should be transformed by ReservationResource.
     */
    public $collects = ReservationResource::class;

    public function toArray($request)
    {

        if (method_exists($this->resource, 'total')) {

            return [
                'data' => $this->collection,
                'meta' => [
                    'total' => $this->total(),
                    'per_page' => $this->perPage(),
                    'current_page' => $this->currentPage(),
                    'last_page' => $this->lastPage(),
                    'from' => $this->firstItem(),
                    'to' => $this->lastItem(),
                ],
                'links' => [
                    'first' => $this->url(1),
                    'last' => $this->url($this->lastPage()),
                    'prev' => $this->previousPageUrl(),
                    'next' => $this->nextPageUrl(),
                ],
            ];
        } else {

            return [
                'data' => $this->collection,
                'meta' => [
                    'total' => $this->collection->count(),
                    'count' => $this->collection->count(),
                ]
            ];
        }
    }
}
