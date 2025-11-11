<?php

namespace App\Jobs\PropertyImage; // CORRIGIDO: Deve ser 'App' maiúsculo

use App\Models\PropertyImage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProcessPropertyImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public PropertyImage $propertyImage;
    public function __construct(PropertyImage $propertyImage)
    {
        $this->propertyImage = $propertyImage;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $image = $this->propertyImage;

        try {
            // Caminho do ficheiro original
            $originalPath = Storage::disk('public')->path($image->image_path);

            // Onde a thumbnail será salva
            $thumbnailPath = str_replace('/images/', '/thumbnails/', $image->image_path);


            //1. Create an instance of the new ImageManager using the GD driver.
            $manager = new ImageManager(new Driver());

            // 2. Read the image
            $thumbnail = $manager->read($originalPath)
                // 3. Resize (scale is excellent for maintaining aspect ratio)
                ->scale(width: 300, height: 200)
                // 4. Encode in original format with quality 80
                ->encodeByExtension(pathinfo($originalPath, PATHINFO_EXTENSION), quality: 80);

            //  5. Save thumbnail to public storage
            Storage::disk('public')->put($thumbnailPath, (string) $thumbnail);

            Log::info("Job ProcessPropertyImage: Thumbnail created successfully for Image ID: {$image->id}");

        } catch (\Throwable $exception) {

            //If it fails, it logs and fails the job (it will be retried)
            Log::error("Job ProcessPropertyImage failed for ID {$image->id}: " . $exception->getMessage());

            // Fail the Job for retry (because of --tries=3)
            $this->fail($exception);
        }
    }
}
