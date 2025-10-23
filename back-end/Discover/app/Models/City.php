<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'state_id',
        'name',
        'postal_code',
        'latitude',
        'longitude',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    //public function country()
    //{
     //   return $this->belongsTo(Country::class, 'state_id');
    //}

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeByState($query, $stateId)
    {
        return $query->where('state_id', $stateId);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'LIKE', "%{$search}%");
    }
}
