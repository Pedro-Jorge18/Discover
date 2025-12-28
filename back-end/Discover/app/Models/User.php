<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'last_name',
        'phone',
        'birthday',
        'email',
        'password',
        'image',
        'gender',
        'about',
        'verified',
        'active',
        'last_login_date',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'birthday' => 'date',
        'language' => 'string',
        'email_verified_at' => 'datetime',
        'last_login_date' => 'datetime',
        'verified' => 'boolean',
        'active' => 'boolean',
        'two_factor_enabled' => 'boolean',
    ];


    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            UserRole::class,
            'user_roles',
            'user_id',
            'role_id',
            'id',
            'id'
        );
    }



    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function hasRole(string $role): bool
    {
        return $this->roles()->where('name', $role)->exists();
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }

    public function assignRole(string $roleName): void
    {
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $this->roles()->syncWithoutDetaching($role);
        }
    }

    public function favoriteProperties(): BelongsToMany
    {
        return $this->belongsToMany(Property::class, 'favorites');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }


    public function isClient(): bool
    {
        return $this->hasRole(Role::CLIENT);
    }

    public function isHost(): bool
    {
        return $this->hasRole(Role::HOST);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(Role::ADMIN);
    }

    public function getFullNameAttribute()
    {
        return "{$this->name} {$this->last_name}";
    }

    public function getInitialsAttribute()
    {
        return strtoupper(substr($this->name, 0, 1) . substr($this->last_name, 0, 1));
    }

    public function hasTwoFactorEnabled(): bool
    {
        return $this->two_factor_enabled === true;
    }
}
