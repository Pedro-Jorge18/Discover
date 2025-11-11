<?php

namespace App\Actions;

use App\Models\Property;
use Illuminate\Support\Facades\Auth;

class authorizePropertyOwnership
{
    private function authorizePropertyOwnership(Property $property): void
    {
        if ((Auth::id() ?? 0) !== $property->host_id) {
            Log::warning('Unauthorized attempt to modify property.', [
                'user_id' => Auth::id(),
                'property_id' => $property->id,
                'expected_host_id' => $property->host_id,
            ]);
            abort(403, 'Unauthorized action.');
        }
    }
}
