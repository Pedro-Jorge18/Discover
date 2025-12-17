<?php

namespace App\DTOs\Property;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

class PropertyImageData
{
    private const MAX_FILE_SIZE = 5120 * 1024;
    private const ALLOWED_MIME_TYPES = [ 'image/jpeg', 'image/jpg', 'image/png' ];
    public function __construct(
        public int $property_id,
        public string $image_path,
        public string $image_name,
        public int $order = 0,
        public bool $is_primary = false,
        public ?string $caption = null,
        public ?string $alt_text = null,
        public ?int $file_size = null,
        public ?string $file_type = null,

        public ?UploadedFile $uploaded_file = null,
        public ?string $temporary_path = null,
    )
    {
        $this->validate();
    }

    private function validate(): void
    {
        if ($this->property_id < 1) {
            throw new InvalidArgumentException('Property ID must be greater than 0');
        }

        if ($this->order < 0 ) {
            throw new InvalidArgumentException('Order must be a positive number');
        }

        if ($this->file_size && $this->file_size < 1)
        {
            throw new InvalidArgumentException('File size must be greater than 0');
        }

        if ($this->uploaded_file) {
            $this->validateUploadedFile();
        }

    }

    private function validateUploadedFile()
    {
        Log::info('Validando arquivo:', [
            'mime_type' => $this->uploaded_file->getMimeType(),
            'size' => $this->uploaded_file->getSize(),
            'original_name' => $this->uploaded_file->getClientOriginalName()
        ]);

        if (!in_array($this->uploaded_file->getMimeType(), self::ALLOWED_MIME_TYPES)) {
            throw new InvalidArgumentException(
                'Invalid file type. Allowed: ' . implode(', ', self::ALLOWED_MIME_TYPES)
            );
        }

        if ($this->uploaded_file->getSize() > self::MAX_FILE_SIZE) {
            throw new InvalidArgumentException(
                'File size must be less than ' . (self::MAX_FILE_SIZE / 1024 / 1024) . 'MB'
            );
        }
    }

    // Factory method to create PropertyImageData DTO from an uploaded file
    public static function fromUpload(
        int $property_id,
        UploadedFile $file,
        int $order = 0,
        bool $is_primary = false,
        ?string $caption = null,
        ?string $alt_text = null
    ): self {
        return new self(
            property_id: $property_id,
            image_path: '',
            image_name: $file->getClientOriginalName(),
            order: $order,
            is_primary: $is_primary,
            caption: $caption,
            alt_text: $alt_text,
            file_size: $file->getSize(),
            file_type: $file->getMimeType(),
            uploaded_file: $file
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            property_id: $data['property_id'],
            image_path: $data['image_path'],
            image_name: $data['image_name'],
            order: $data['order'] ?? 0,
            is_primary: $data['is_primary'] ?? false,
            caption: $data['caption'] ?? null,
            alt_text: $data['alt_text'] ?? null,
            file_size: $data['file_size'] ?? null,
            file_type: $data['file_type'] ?? null
        );
    }
    public function toArray(): array
    {
        return [
            'property_id' => $this->property_id,
            'image_path' => $this->image_path,
            'image_name' => $this->image_name,
            'order' => $this->order,
            'is_primary' => $this->is_primary,
            'caption' => $this->caption,
            'alt_text' => $this->alt_text,
            'file_size' => $this->file_size,
            'file_type' => $this->file_type,
        ];
    }

    public function withImagePath(string $imagePath): self
    {
        $this->image_path = $imagePath;
        return $this;
    }

}
