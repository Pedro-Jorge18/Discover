<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyImageRequest;
use App\Http\Resources\Property\PropertyImageResource;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Services\Property\PropertyImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyImageController extends Controller
{
    public function __construct(
        private PropertyImageService $service
    ) {}

    public function store(StorePropertyImageRequest $request, Property $property): JsonResponse
    {
        $metadata = $request->safe()->except(['images']);
            $uploaded = $this->service->uploadImages(
                $property,
                $request->file('images'),
                $metadata
            );

        return response()->json([
            'success' => true,
            'message' => 'Images uploaded successfully',
            'images' => $uploaded
        ], 201);
    }

    public function setPrimary(Property $property, PropertyImage $image): JsonResponse
    {
        $this->service->setPrimaryImage($image);

        return response()->json([
            'success' => true,
            'message' => 'Primary image set successfully'
        ]);
    }

    public function reorder(Request $request, Property $property): JsonResponse
    {
        $orderData = $request->input('order',[]);
        $this->service->reorderImages($property, $orderData);

        return response()->json([
            'success' => true,
            'message' => 'Images reordered successfully'
        ]);
    }

    public function destroy(Property $property, PropertyImage $image): JsonResponse
    {
        $this->service->deleteImage($image);

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully'
        ]);
    }
}
