<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Http\Requests\StorePropertyRequest;
use App\Services\Property\PropertyService;
use App\Http\Requests\UpdatePropertyRequest;
use Illuminate\Http\JsonResponse;

/**
 * PropertyController
 * 
 * Handles all property-related HTTP requests:
 * - Listing properties (with filters, pagination, search)
 * - Creating new properties with images and amenities
 * - Retrieving property details
 * - Updating existing properties
 * - Soft deleting properties
 * 
 * Delegates business logic to PropertyService
 */
class PropertyController extends Controller
{

    public function __construct(
        private PropertyService $propertyService
    ){}

    /**
     * List all properties with optional filters
     * 
     * Supports filtering by:
     * - Location (city, country, neighborhood)
     * - Price range
     * - Guest capacity
     * - Property type
     * - Amenities
     * 
     * @return JsonResponse List of properties with pagination
     * @throws \Throwable
     */
    public function index(): JsonResponse
    {
        return $this->propertyService->listService();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Create a new property listing
     * 
     * Handles:
     * - Property data validation
     * - Image uploads (4 required)
     * - Amenity assignment
     * - Auto-publish on creation
     * 
     * @param StorePropertyRequest $request Validated property data
     * @return JsonResponse Created property resource
     */
    public function store(StorePropertyRequest $request)
    {
        return $this->propertyService->createService($request->validated());
    }


    /**
     * Get detailed property information
     * 
     * Includes:
     * - Full property details
     * - Host information
     * - Images
     * - Amenities
     * - Reviews and ratings
     * - Availability calendar
     * 
     * @param int $id Property ID
     * @return JsonResponse Property resource
     */
    public function show(int $id)
    {
        return $this->propertyService->findService($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        //
    }

    /**
     * PUT/PATCH /api/properties/{id}
     */
    public function update(UpdatePropertyRequest $request, int $id)
    {
        return $this->propertyService->updateService($id, $request->validated());
    }

    /**
     * DELETE /api/properties/{id}
     */
    public function destroy(int $id)
    {
        return $this->propertyService->deleteService($id);
    }
}
