<?php

namespace App\Services\Property;

use App\Actions\Property\CreatePropertyAction;
use App\Actions\Property\DeletePropertyAction;
use App\Actions\Property\FindPropertyAction;
use App\Actions\Property\UpdatePropertyAction;
use App\Http\Resources\Property\PropertyCollection;
use App\Http\Resources\Property\PropertyResource;
use App\DTOs\Property\PropertyData;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Services\Property\PropertyImageService;
use Illuminate\Support\Facades\Auth;


class PropertyService
{

    public function __construct(
        private CreatePropertyAction $createPropertyAction,
        private FindPropertyAction $findPropertyAction,
        private UpdatePropertyAction $updatePropertyAction,
        private DeletePropertyAction $deletePropertyAction,
        private PropertyImageService $propertyImageService,
    ) {}

    public function createService(array $data): JsonResponse
    {
        $images = $data['images'] ?? [];
        unset($data['images']);
        try {
            if (!Auth::check()) {
                throw new \Exception('Authentication required to create property.');
            }
            $data['host_id'] = Auth::id();
            // DTO data
            $propertyData = PropertyData::fromArray($data);

            //Usa o Action
            $property = $this->createPropertyAction->execute($propertyData->toArray());

            if (!empty($images)){
                $this->propertyImageService->uploadImages($property, $images,$data);
            }
            // Relações
            $property->load(['host','propertyType','listingType','city','images']);

            return response()->json([
                'success' => true,
                'data' => new PropertyResource($property),
                'message' => 'Property created successfully',
            ],201);

        } catch (\Throwable $exception){
            Log::error('Error creating property: '.$exception->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Creation failed:' .$exception->getTraceAsString(),
            ],500);

        }
    }
    public function findService(int $id): JsonResponse
    {
        try {
            $property = $this->findPropertyAction->execute($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'error' => 'Property not found'
                ], 404);
            }

            $property->load(['host','propertyType','listingType','city','images']);

            return response()->json([
                'success' => true,
                'data' => new PropertyResource($property),
            ]);

        } catch (\Throwable $exception){
            Log::error('Error finding property: '.$exception->getMessage());
            return response()->json([
                'data'=>$id,
                'exception'=>$exception->getTraceAsString(),
            ],500);

        }
    }

    // Listagem de paginação
    public function listService(): JsonResponse
    {
        try {
            $property = $this->findPropertyAction->executePaginated(15);

            return response()->json([
                'success' => true,
                'data' => new PropertyCollection($property),
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error listing properties: '.$exception->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Error listing properties: '
            ],500);

        }
    }

    public function updateService(int $id, array $data): JsonResponse
    {
        try {

            // The price cannot be less than 1.
            if (isset($data['price_per_night']) && $data['price_per_night'] <  1 ){
                throw new \Exception('Price per night must be greater than 1');
            }

            $updated = $this->updatePropertyAction->execute($id, $data);

            if (!$updated) {
                return response()->json([
                    'success' => false,
                    'error' => 'Property not found'
                ], 404);
            }

            // validation of guest quantity
            if (isset($data['max_guests']) && $data['max_guests'] <  1 ){
                throw new \Exception('Maximum number of guests must be greater than 1');
            }

            // Bed count validation
            if (isset($data['beds']) && $data['beds'] <  1 ){
                throw new \Exception('Beds must be greater than 1');
            }

            $property = $this->findPropertyAction->execute($id);
            $property->load(['host', 'propertyType', 'listingType', 'city', 'images']);

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
