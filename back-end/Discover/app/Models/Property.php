<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'host_id',
        'property_type_id',
        'listing_type_id',
        'city_id',
        'address',
        'neighborhood',
        'postal_code',
        'latitude',
        'longitude',
        'title',
        'description',
        'summary',
        'price_per_night',
        'cleaning_fee',
        'service_fee',
        'security_deposit',
        'max_guests',
        'bedrooms',
        'beds',
        'bathrooms',
        'area',
        'floor',
        'check_in_time',
        'check_out_time',
        'min_nights',
        'max_nights',
        'published',
        'active',
        'instant_book',
        'views',
        'rating',
        'reviews_count',
        'published_at',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'cleaning_fee' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'published' => 'boolean',
        'active' => 'boolean',
        'instant_book' => 'boolean',
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
        'published_at' => 'datetime',
        'rating' => 'decimal:2',
    ];

    // RELACIONAMENTOS
    public function host(): BelongsTo
    {
        return $this->BelongsTo(User::class, 'host_id');
    }

    public function propertyType():  BelongsTo
    {
        return $this->BelongsTo(PropertyType::class);
    }

    public function listingType(): BelongsTo
    {
        return $this->BelongsTo(ListingType::class);
    }

    public function city(): BelongsTo
    {
        return $this->BelongsTo(City::class);
    }

   /*
    *  public function state(): HasOneThrough
    {
        return $this->hasOneThrough(
            State::class,
            City::class,
            'id',
            'id',
            'city_id',
            'state_id'
        );
    }
    public function country(): hasOneThrough
    {
        return $this->hasOneThrough(
            Country::class,
            State::class,
            'id',
            'country_id',
            'state_id',
            'country_id'
        );
    }*/

    public function categories(): BelongsToMany
    {
        return $this->BelongsToMany(PropertyCategory::class, 'property_category_pivot');
    }
    public function amenities():  BelongsToMany
    {
        return $this->BelongsToMany(Amenity::class, 'property_amenities')
            ->withPivot(['value_boolean', 'value_numeric', 'value_text'])
            ->withTimestamps();
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class, 'property_id');
    }
    public function favoritedByUsers(): BelongsToMany
    {
        return $this->BelongsToMany(User::class, 'favorites', 'property_id', 'user_id');
    }

    // SCOPES
    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeByHost($query, $hostId)
    {
        return $query->where('host_id', $hostId);
    }

    public function scopeByCity($query, $cityId)
    {
        return $query->where('city_id', $cityId);
    }

    public function scopeByType($query, $typeId)
    {
        return $query->where('property_type_id', $typeId);
    }

    public function scopeByListingType($query, $listingTypeId)
    {
        return $query->where('listing_type_id', $listingTypeId);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('title', 'LIKE', "%{$search}%")
            ->orWhere('description', 'LIKE', "%{$search}%")
            ->orWhere('address', 'LIKE', "%{$search}%");
    }

    public function scopePriceRange($query, $minPrice, $maxPrice)
    {
        return $query->whereBetween('price_per_night', [$minPrice, $maxPrice]);
    }

    public function scopeWithGuests($query, $guests)
    {
        return $query->where('max_guests', '>=', $guests);
    }

    // MÉTODOS DE PREÇO
    public function getTotalPrice(int $nights): float
    {
        return ($this->price_per_night * $nights) + $this->cleaning_fee + $this->service_fee;
    }

    public function getPriceWithoutFees(int $nights): float
    {
        return $this->price_per_night * $nights;
    }

    // MÉTODOS DE AVALIAÇÃO
    public function updateRating(): void
    {
        $this->update([
            'rating' => $this->reviews()->avg('rating') ?? 0,
            'reviews_count' => $this->reviews()->count(),
        ]);
    }

    // MÉTODOS DE LOCALIZAÇÃO
    public function getFullAddress(): string
    {
        $parts = [
            $this->address,
            $this->neighborhood,                  //bairro
            $this->city->name ?? '',
            $this->city->state->name ?? '',
            $this->city->state->country->name ?? '',
        ];

        return implode(', ', array_filter($parts));
    }

    // MÉTODOS DE STATUS
    public function publish(): void
    {
        $this->update([
            'published' => true,
            'published_at' => now(),
        ]);
    }

    public function unpublish(): void
    {
        $this->update([
            'published' => false,
            'published_at' => null,
        ]);
    }

    public function isAvailableForDates(string $checkIn,string $checkOut): bool
    {
        // Lógica para verificar disponibilidade (será implementada depois)
        return true;
    }

    // MÉTRICAS
    public function incrementViews(): void
    {
        $this->increment('views');
    }

    public function getDailyRevenue(): float
    {
        return $this->price_per_night;
    }
}
