<?php

namespace App\Actions\Files;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DeleteFilesAction
{
    public function execute(array $files, string $disk = 'public'): void
    {
        $deletedCount = 0;

        foreach ($files as $filePath) {
            try {
                if (Storage::disk($disk)->exists($filePath)) {
                    Storage::disk($disk)->delete($filePath);
                    $deletedCount++;
                    Log::debug('File deleted successfully', ['file_path' => $filePath]);
                }
            } catch (\Throwable $exception) {
                Log::error('Failed to delete file: '.$exception->getMessage(), [
                    'file_path' => $filePath,
                    'disk' => $disk
                ]);
            }
        }

        Log::info('Files deletion completed', [
            'total_files' => count($files),
            'deleted_count' => $deletedCount,
            'disk' => $disk
        ]);
    }

    /**
     * Specialized for property image rollback
     *
     */
    public function rollbackPropertyImages(array $imagePaths): void
    {
        $allFiles = [];

        foreach ($imagePaths as $imagePath) {
            // Add original image
            $allFiles[] = $imagePath;

            // Add corresponding thumbnail
            $thumbnailPath = str_replace('/images/', '/thumbnails/', $imagePath);
            $allFiles[] = $thumbnailPath;
        }

        $this->execute($allFiles);
    }
}
