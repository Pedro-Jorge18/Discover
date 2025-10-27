<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Amenity extends Model
{
    use HasFactory;

    protected $fillable = [
        'amenity_category_id',
        'name',
        'description',
        'icon',
        'value_type',
        'unit',
        'order',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function category(): belongsTo
    {
        return $this->belongsTo(AmenityCategory::class, 'amenity_category_id');
    }

    public function properties():  belongsToMany
    {
        return $this->belongsToMany(Property::class, 'property_amenities')
            ->withPivot(['value_boolean', 'value_numeric', 'value_text'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('amenity_category_id', $categoryId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
