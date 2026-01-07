<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Http\Requests\StorePropertyRequest;
use App\Services\Property\PropertyService;
use App\Http\Requests\UpdatePropertyRequest;
use Illuminate\Http\JsonResponse;

class PropertyController extends Controller
{

    public function __construct(
        private PropertyService $propertyService
    ){}

    /**
     * @throws \Throwable
     *
     * GET /api/properties
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
     * POST /api/properties
     */
    public function store(StorePropertyRequest $request)
    {
        return $this->propertyService->createService($request->validated());
    }


    /**
     * GET /api/properties/{id}
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
