<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'sender_id',
        'receiver_id',
        'message',
        'is_read',
        'read_at',
        'type',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeBetweenUsers($query, $user1, $user2)
    {
        return $query->where(function($q) use ($user1, $user2) {
            $q->where('sender_id', $user1)->where('receiver_id', $user2);
        })->orWhere(function($q) use ($user1, $user2) {
            $q->where('sender_id', $user2)->where('receiver_id', $user1);
        });
    }
}
