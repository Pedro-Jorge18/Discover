<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'last_name',
        'phone',
        'birthday',
        'email',
        'password',
        'image',
        'gender',
        'language',
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
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'birthday' => 'date',
        'verified' => 'boolean',
        'active' => 'boolean',
        'last_login_date' => 'datetime',
    ];

    // RELAÇÕES
    public function properties()
    {
        return $this->hasMany(Property::class, 'host_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function paymentMethods()
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function conversationsAsUser()
    {
        return $this->hasMany(Conversation::class, 'user_id');
    }

    public function conversationsAsHost()
    {
        return $this->hasMany(Conversation::class, 'host_id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    // SCOPES
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }

    // MÉTODOS
    public function isHost()
    {
        return $this->properties()->exists();
    }

    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function getFullNameAttribute()
    {
        return $this->name . ' ' . $this->last_name;
    }
}
