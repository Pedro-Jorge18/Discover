<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'level',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];


    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles');
    }

    // SCOPES
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    public function scopeByName($query, $name)
    {
        return $query->where('name', $name);
    }
}
