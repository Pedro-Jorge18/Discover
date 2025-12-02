<?php

namespace App\Http\Controllers;

use App\Actions\property\AuthorizePropertyOwnership;
use App\Http\Requests\StorePropertyImageRequest;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Services\Property\PropertyImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class PropertyImageController extends Controller
{
    public function __construct(
        private PropertyImageService $service,
        private AuthorizePropertyOwnership $authorizePropertyOwnership,
    ) {}

    /**
     * @throws \Throwable
     */
    public function store(StorePropertyImageRequest $request, Property $property): JsonResponse
    {
        $this->authorizePropertyOwnership->execute($property);

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

    /**
     * @throws \Throwable
     */
    public function setPrimary(Property $property, PropertyImage $image): JsonResponse
    {
        ($this->authorizePropertyOwnership)($property);

        if ($image->property_id !== $property->id) {
            abort(404, 'Image not found for this property.');
        }
        $this->service->setPrimaryImage($image);

        return response()->json([
            'success' => true,
            'message' => 'Primary image set successfully'
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function reorder(Request $request, Property $property): JsonResponse
    {
        $this->authorizePropertyOwnership->execute($property);

        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:property_images,id'
        ]);

        //Check if all IDs belong to the property.
        $validImageIds = $property->images()->pluck('id')->toArray();
        foreach ($request->input('order', []) as $imageId) {
            if (!in_array($imageId, $validImageIds)) {
                abort(422, 'Invalid image ID in order array');
            }
        }
        $orderData = $request->input('order', []);
        $this->service->reorderImages($property, $orderData);

        return response()->json([
            'success' => true,
            'message' => 'Images reordered successfully'
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function destroy(Property $property, PropertyImage $image): JsonResponse
    {
        $this->authorizePropertyOwnership->execute($property);

        if ($image->property_id !== $property->id) {
            abort(404, 'Image not found for this property.');
        }

        $this->service->deleteImage($image);

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully'
        ]);
    }
}
