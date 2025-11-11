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

            // 1. Cria instância do novo ImageManager com o driver GD
            $manager = new ImageManager(new Driver());

            // 2. Lê a imagem
            $thumbnail = $manager->read($originalPath)
                // 3. Redimensiona (scale é excelente por manter proporção)
                ->scale(width: 300, height: 200)
                // 4. Codifica no formato original com qualidade 80
                ->encodeByExtension(pathinfo($originalPath, PATHINFO_EXTENSION), quality: 80);

            // 5. Salva o thumbnail no storage público
            Storage::disk('public')->put($thumbnailPath, (string) $thumbnail);

            Log::info("Job ProcessPropertyImage: Thumbnail criado com sucesso para Imagem ID: {$image->id}");

        } catch (\Throwable $exception) {
            // Se falhar, registra e falha o Job (será re-tentado)
            Log::error("Job ProcessPropertyImage falhou para ID {$image->id}: " . $exception->getMessage());

            // Falha o Job para re-tentativa (por causa do --tries=3)
            $this->fail($exception);
        }
    }
}
