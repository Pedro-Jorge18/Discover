<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'user_id',
        'reservation_id',
        'rating_cleanliness',
        'rating_communication',
        'rating_checkin',
        'rating_accuracy',
        'rating_location',
        'rating_value',
        'rating_overall',
        'comment',
        'host_reply',
        'published',
        'recommend',
        'host_replied_at',
    ];

    protected $casts = [
        'published' => 'boolean',
        'recommend' => 'boolean',
        'host_replied_at' => 'datetime',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function calculateOverallRating()
    {
        $ratings = [
            $this->rating_cleanliness,
            $this->rating_communication,
            $this->rating_checkin,
            $this->rating_accuracy,
            $this->rating_location,
            $this->rating_value,
        ];

        return round(array_sum($ratings) / count($ratings));
    }

    public function reply($message)
    {
        $this->update([
            'host_reply' => $message,
            'host_replied_at' => now(),
        ]);
    }
}
