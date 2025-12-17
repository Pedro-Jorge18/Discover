<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        if (!$this->resource) {
            return [];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,


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

            'two_factor' => [
                'enabled' => $this->two_factor_enabled,
            ],

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