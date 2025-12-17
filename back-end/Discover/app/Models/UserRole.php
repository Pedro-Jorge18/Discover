<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UserRole extends Model
{
    use HasFactory;

    public const ADMIN = 'admin';
    public const HOST = 'host';
    public const GUEST = 'user';

    protected $fillable = [
        'name',
        'description',
        'level',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $table = 'roles';


    public function users(): BelongsToMany
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

    // helpers
    public function isAdmin(): bool
    {
        return $this->name === self::ADMIN;
    }

    public function isHost(): bool
    {
        return $this->name === self::HOST;
    }

    public function isGuest(): bool
    {
        return $this->name === self::GUEST;
    }
}