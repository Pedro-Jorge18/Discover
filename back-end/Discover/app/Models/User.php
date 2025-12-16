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

    //Identificao de Usuario anfittiao, cliente ou admin
    public function isClient()
    {
        return $this->roles()->where('name', 'client')->exists();
    }

    public function isHost()
    {
        return $this->roles()->where('name', 'host')->exists();
    }

    public function isAdmin()
    {
        return $this->roles()->where('name', 'admin')->exists();
    }

    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function hasAnyRole(array $roleNames)
    {
        return $this->roles()->whereIn('name', $roleNames)->exists();
    }


    public function assignRole($roleName)
    {
        $role = UserRole::where('name', $roleName)->first();

        if ($role && !$this->hasRole($roleName)) {
            $this->roles()->attach($role);
        }
    }


    public function removeRole($roleName)
    {
        $role = UserRole::where('name', $roleName)->first();

        if ($role) {
            $this->roles()->detach($role);
        }
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
