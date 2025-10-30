<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
<<<<<<< HEAD

        if (!$this->resource) {
            return [];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,


            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name');
            }),

            'profile' => $this->whenLoaded('profile', function () {
                return $this->profile ? [
                    'id' => $this->profile->id,
                    'bio' => $this->profile->bio,
                    'avatar' => $this->profile->avatar,
                    'website' => $this->profile->website,
                    'location' => $this->profile->location,
                ] : null;
            }),

=======
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
>>>>>>> 99123030711e99cc5ec61294065f35c9aa1bf95a
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function with(Request $request): array
    {
        return [
            'meta' => [
                'api_version' => '1.0',
                'timestamp'   => now()->toIso8601String(),
            ],
        ];
    }
}
