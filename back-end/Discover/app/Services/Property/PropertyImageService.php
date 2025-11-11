<?php

namespace App\Services\Property;

use App\Models\Property;
use App\Models\PropertyImage;
use App\DTOs\Property\PropertyImageData;
use Illuminate\Http\UploadedFile;
use App\Actions\Files\DeleteFilesAction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Jobs\PropertyImage\ProcessPropertyImage;

class PropertyImageService
{
    public function __construct(
        private DeleteFilesAction $deleteFilesAction
    ) {}
    public function uploadImages(Property $property, array $images, array $data = []): array
    {
        \Log::info('PropertyImageService: uploadImages started', [
            'property_id' => $property->id,
            'images_count' => count($images),
            'data' => $data
        ]);

        $uploadedImages = []; // array de imagens
        $uploadedFiles = [];

        DB::beginTransaction();

        try {
            $primaryIndex = $data['primary_index'] ?? 0;

            // Atualiza imagem principal,
            if (isset($data['primary_index'])) {
                $property->images()->where('is_primary', true)->update(['is_primary' => false]);
            }


            // add as imagens
            foreach ($images as $index => $image) {
                $imageData = $this->createImageData($property, $image, $index, $data, $primaryIndex);
                $uploadedImage = $this->uploadSingleImage($imageData);
                $uploadedImages[] = $uploadedImage;
                $uploadedFiles[] = $uploadedImage->image_path;
            }

            DB::commit();
            return $uploadedImages;

        } catch (\Throwable $exception) {
            DB::rollBack();

            if (!empty($uploadedFiles)) {
                $this->deleteFilesAction->rollbackPropertyImages($uploadedFiles);
            }
            Log::error('Error uploading property images: '.$exception->getMessage());
            throw $exception;
        }
    }
    private function createImageData(
        Property $property,
        UploadedFile $image,
        int $index,
        array $data,
        int $primaryIndex
    ): PropertyImageData {
        return PropertyImageData::fromUpload(
            property_id: $property->id,
            file: $image,
            order: $index,
            is_primary: $index === $primaryIndex,
            caption: $data['captions'][$index] ?? null,
            alt_text: $data['alt_texts'][$index] ?? null
        );
    }


    private function uploadSingleImage(PropertyImageData $imageData): PropertyImage
    {
        // Gera nome único e caminhos
        $imageName = $this->generateImageName($imageData->uploaded_file);
        $imagePath = "properties/{$imageData->property_id}/images/{$imageName}";
        // $thumbnailPath = "properties/{$imageData->property_id}/thumbnails/{$imageName}";

        // Salva imagem original
        Storage::disk('public')->putFileAs(
            "properties/{$imageData->property_id}/images",
            $imageData->uploaded_file,
            $imageName
        );
        // Criar thumbnail (opcional)
        // $this->createThumbnail($imageData->uploaded_file, $thumbnailPath);

        // Atualiza DTO com caminho final
        $imageData = $imageData->withImagePath($imagePath);

        // Cria registro no banco usando DTO
        $propertyImage = PropertyImage::create([
            ...$imageData->toArray(),
            'image_name' => $imageName,
        ]);
        ProcessPropertyImage::dispatch($propertyImage);
        return $propertyImage;
    }

    private function generateImageName(UploadedFile $image): string
    {
        return uniqid() . '_' . time() . '.' . $image->getClientOriginalExtension();
    }


    public function deleteImage(PropertyImage $image): bool
    {
        try {
            $this->deleteFilesAction->rollbackPropertyImages([$image->image_path]);

            // Se era primária, definir outra como primária
            if ($image->is_primary) {
                $newPrimary = $image->property->images()
                    ->where('id', '!=', $image->id)
                    ->first();

                if ($newPrimary) {
                    $newPrimary->update(['is_primary' => true]);
                }
            }

            return $image->delete();
        } catch (\Throwable $exception) {
            Log::error('Error deleting property image: '.$exception->getMessage());
            throw $exception;
        }
    }

    public function setPrimaryImage(PropertyImage $image): bool
    {
        try {
            // Remover primária atual
            $image->property->images()
                ->where('is_primary', true)
                ->update(['is_primary' => false]);

            // Definir nova primária
            return $image->update(['is_primary' => true]);

        } catch (\Throwable $exception) {
            Log::error('Error setting primary image: '.$exception->getMessage());
            throw $exception;
        }
    }

    public function reorderImages(Property $property, array $imageOrder): bool
    {
        try {
            foreach ($imageOrder as $order => $imageId) {
                PropertyImage::where('id', $imageId)
                    ->where('property_id', $property->id)
                    ->update(['order' => $order]);
            }

            return true;

        } catch (\Throwable $exception) {
            Log::error('Error reordering images: '.$exception->getMessage());
            throw $exception;
        }
    }
}
