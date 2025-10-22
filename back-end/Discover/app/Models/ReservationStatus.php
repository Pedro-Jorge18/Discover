<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservationStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
        'order',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'status_id');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
