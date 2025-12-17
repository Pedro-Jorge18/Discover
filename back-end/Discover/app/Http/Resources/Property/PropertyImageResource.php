<?php

namespace App\Http\Resources\Property;

use Illuminate\Http\Resources\Json\JsonResource;

class PropertyImageResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'image_url' => $this->image_url,
            'thumbnail_url' => $this->thumbnail_url,
            'image_name' => $this->image_name,
            'order' => $this->order,
            'is_primary' => $this->is_primary,
            'caption' => $this->caption,
            'alt_text' => $this->alt_text,
            'file_size' => $this->file_size,
            'file_type' => $this->file_type,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
