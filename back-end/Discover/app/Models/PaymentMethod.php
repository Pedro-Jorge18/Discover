<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'provider',
        'last_four',
        'brand',
        'is_default',
        'active',
        'metadata',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'active' => 'boolean',
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
