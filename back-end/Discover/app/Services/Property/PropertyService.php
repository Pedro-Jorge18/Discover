<?php

namespace App\Services\Property;

use App\Actions\Amenities\CreatePropertyAmenitiesAction;
use App\Actions\Property\CreatePropertyAction;
use App\Actions\Property\DeletePropertyAction;
use App\Actions\Property\FindPropertyAction;
use App\Actions\Property\UpdatePropertyAction;
use App\Actions\Amenities\UpdatePropertyAmenitiesAction;
use App\Actions\Property\validatePropertyUpdateAction;
use App\Http\Resources\Property\PropertyCollection;
use App\Http\Resources\Property\PropertyResource;
use App\DTOs\Property\PropertyData;
use App\Models\Property;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Services\Property\PropertyImageService;
use Illuminate\Support\Facades\Auth;


class PropertyService
{

    public function __construct(
        private CreatePropertyAction          $createPropertyAction,
        private FindPropertyAction            $findPropertyAction,
        private UpdatePropertyAction          $updatePropertyAction,
        private DeletePropertyAction          $deletePropertyAction,
        private PropertyImageService          $propertyImageService,
        private CreatePropertyAmenitiesAction $createAmenitiesAction,
        private UpdatePropertyAmenitiesAction $updateAmenitiesAction,
        private ValidatePropertyUpdateAction  $validateUpdateAction,
    ) {}

    public function createService(array $data): JsonResponse
    {
        $images = $data['images'] ?? [];
        unset($data['images']);
        $primaryIndex = $data['primary_index'] ?? null;
        unset($data['primary_index']);
        try {

            $data['host_id'] = Auth::id();
            // DTO data
            $propertyData = PropertyData::fromArray($data);

            //Usa o Action
            $property = $this->createPropertyAction->execute($propertyData->toArray());

            if (count($images) > 0){
                $imageMetadata = [
                    'primary_index' => $primaryIndex,
                    'captions' => $data['captions'] ?? null,
                    'alt_texts' => $data['alt_texts'] ?? null,
                ];
                $this->propertyImageService->uploadImages($property, $images, $imageMetadata);
            }

            if (count($propertyData->amenities) > 0){
                $this->createAmenitiesAction->execute($property,$propertyData->amenities);
            }
            // Relações
            $property->load(['host','propertyType','listingType','city','images', 'amenities']);

            return response()->json([
                'success' => true,
                'data' => new PropertyResource($property),
                'message' => 'Property created successfully',
            ],201);

        } catch (\Throwable $exception){
            Log::error('Error creating property: '.$exception->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Creation failed: ' . $exception->getMessage(),
            ],500);

        }
    }
    public function findService(int $id): Property
    {
        try {
            $property = $this->findPropertyAction->execute($id);

            if (!$property) {
                // Lança exceção padrão do Eloquent para ser capturada pelo Controller (HTTP 404)
                throw new ModelNotFoundException("Property with ID {$id} not found.");
            }

            $property->load(['host','propertyType','listingType','city','images','amenities']);

            return $property;

        } catch (\Throwable $exception){
            // Se for uma ModelNotFoundException, ela é relançada acima.
            Log::error('Error finding property: '.$exception->getMessage());
            throw $exception;
        }
    }

    // Listagem de paginação
    public function listService(): JsonResponse
    {
        try {
            $property = Property::with(['propertyType', 'listingType', 'images', 'city'])
                ->where('published', true)
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => new PropertyCollection($property),
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error listing properties: '.$exception->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Error listing properties: ' .$exception->getMessage(),
            ],500);

        }
    }

    public function updateService(int $id, array $data): JsonResponse
    {
        try {

            $this->validateUpdateAction->execute($data);

            $updated = $this->updatePropertyAction->execute($id, $data);

            if (!$updated) {
                return response()->json([
                    'success' => false,
                    'error' => 'Property not found'
                ], 404);
            }


            if (isset($data['amenities'])){
                $property = Property::find($id);
                $this->updateAmenitiesAction->execute($property,$data['amenities']);
            }

            $property = $this->findPropertyAction->execute($id);
            $property->load(['host', 'propertyType', 'listingType', 'city', 'images', 'amenities']);

            return response()->json([
                'success' => true,
                'data' => new PropertyResource($property),
                'message' => 'Property updated successfully'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error updating property: '.$exception->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Update failed: ' . $exception->getMessage()
            ], 500);

        }
    }

    public function deleteService(int $id): JsonResponse
    {
        try {
            $deleted = $this->deletePropertyAction->execute($id);

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'error' => 'Property not found'
                ], 404);
            }

            return response()->json(null, 204);

        } catch (\Throwable $exception) {
            Log::error('Error deleting property: '.$exception->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Deletion failed: ' . $exception->getMessage()
            ], 500);
        }

    }

}
