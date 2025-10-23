<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'user_id',
        'host_id',
        'subject',
        'last_message_at',
        'unread_count_user',
        'unread_count_host',
        'active',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
        'active' => 'boolean',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ConversationMessage::class);
    }

    public function lastMessage(): HasOne
    {
        return $this->hasOne(ConversationMessage::class)->latest();
    }

    public function markAsReadForUser()
    {
        $this->update(['unread_count_user' => 0]);
    }

    public function markAsReadForHost()
    {
        $this->update(['unread_count_host' => 0]);
    }

    public function incrementUnreadCount($forUser = true)
    {
        if ($forUser) {
            $this->increment('unread_count_user');
        } else {
            $this->increment('unread_count_host');
        }
    }
}
