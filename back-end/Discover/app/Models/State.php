<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'name',
        'code',
        'timezone',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function cities()
    {
        return $this->hasMany(City::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeByCountry($query, $countryId)
    {
        return $query->where('country_id', $countryId);
    }
}
