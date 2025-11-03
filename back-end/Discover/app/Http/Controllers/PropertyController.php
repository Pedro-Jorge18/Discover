<?php

namespace App\Http\Controllers;

use App\Http\Property\Resources\PropertyResource;
use App\Models\Property;
use App\Http\Requests\StorePropertyRequest;
use App\Services\Property\PropertyService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\UpdatePropertyRequest;
use App\Repositories\Contracts\PropertyRepositoryInterface;

class PropertyController extends Controller
{
    private PropertyService $propertyService;

    public function __construct(
        private PropertyRepositoryInterface $propertyRepository,
    ){}

    public function index()
    {
       // $properties = $this->propertyService->listAll();

        $properties = Property::all();
        return PropertyResource::collection($properties);
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
    public function store(StorePropertyRequest $request):jsonResponse
    {
        $property = $this->propertyService->create($request->validated());

        return response()->json($property, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        /*
         * apos as atualizacoes essa que vai valer.
         *
        $property = $this->propertyService->find($id)->load([
            'host',
            'propertyType',
            'listingType',
            'city',
            'images'
        ]);

        */
        $property = $this->propertyRepository->findById($id);
        if (!$property) {
            return response()->json(['error' => 'Property not found'], 404);
        }
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
