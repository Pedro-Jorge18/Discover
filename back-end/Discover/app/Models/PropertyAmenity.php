<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyAmenity extends Model
{
    protected $table = 'property_amenities';

    protected $fillable = [
        'property_id',
        'amenity_id',
        'value_boolean',
        'value_numeric',
        'value_text',
    ];

    protected $casts = [
        'value_boolean' => 'boolean',
        'value_numeric' => 'decimal:2',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
    public function amenity(): BelongsTo
    {
        return $this->belongsTo(Amenity::class);
    }

    public function getFormattedValueAttribute(): string
    {
        return match($this->amenity->value_type)
        {
            'boolean' => $this->value_boolean ? 'yes' : 'no',
            'numeric' => $this->value_numeric .($this->amenity->unit ? ' ' . $this->amenity->unit : ''),
            'text' => $this->value_text ?? 'N/A',
            default => 'N/A',
        };
    }
    public function getRawValue()
    {
        return match ($this->amenity->value_type) {
            'boolean' => $this->value_boolean,
            'numeric' => $this->value_numeric,
            'text' => $this->value_text,
            default => null,
        };
    }


    public function scopeWhereValue($query, $value)
    {
        return $query->where(function ($q) use ($value) {
            $q->where('value_boolean', $value)
                ->orWhere('value_numeric', $value)
                ->orWhere('value_text', 'like', "%{$value}%");
        });
    }

    public function scopeWhereBooleanTrue($query)
    {
        return $query->where('value_boolean', true);
    }


    public function isActive(): bool
    {
        return match ($this->amenity->value_type) {
            'boolean' => (bool) $this->value_boolean,
            'numeric' => (bool) $this->value_numeric,
            'text' => !empty($this->value_text),
            default => false,
        };
    }
}
