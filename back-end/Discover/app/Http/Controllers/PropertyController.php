<?php

namespace App\Http\Controllers;

use App\Http\Resources\Property\PropertyResource;
use App\Http\Resources\Property\PropertyCollection;
use App\Models\Property;
use App\Http\Requests\StorePropertyRequest;
use App\Services\Property\PropertyService;
use App\Http\Requests\UpdatePropertyRequest;

class PropertyController extends Controller
{

    public function __construct(
        private PropertyService $propertyService
    ){}

    /**
     * @throws \Throwable
     */
    public function index()
    {
        $properties = $this->propertyService->listPaginated(15);

        return new PropertyCollection($properties);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyRequest $request)
    {
        $property = $this->propertyService->create($request->validated());

        return new PropertyResource($property);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        /*
         * apos as atualizacoes essa que vai valer.
         */
        $property = $this->propertyService->find($id);
        if (!$property) {
            return response()->json(['error' => 'Property not found'], 404);
        }
        $property->load([
            'host',
            'propertyType',
            'listingType',
            'city',
            'images'
        ]);

        return new PropertyResource($property);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyRequest $request, Property $property)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        //
    }
}
