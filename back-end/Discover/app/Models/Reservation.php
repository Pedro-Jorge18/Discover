<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'user_id',
        'status_id',
        'check_in',
        'check_out',
        'nights',
        'adults',
        'children',
        'infants',
        'special_requests',
        'price_per_night',
        'cleaning_fee',
        'service_fee',
        'security_deposit',
        'subtotal',
        'total_amount',
        'amount_paid',
        'payment_method',
        'transaction_id',
        'payment_date',
        'payment_status',
        'reservation_code',
        'cancellation_reason',
        'cancelled_at',
        'confirmed_at',
        'host_notes',
        'internal_notes',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'price_per_night' => 'decimal:2',
        'cleaning_fee' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'payment_date' => 'datetime',
        'cancelled_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    //  RELACIONAMENTOS


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ReservationStatus::class, 'status_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function successfulPayment(): HasOne
    {
        return $this->hasOne(Payment::class)->where('status', 'completed');
    }

    public function conversations(): Builder

    {
        return Conversation::query()
            ->where('property_id',$this->property_id)
            ->where('user_id', $this->user_id);
    }

    // sCOPES
    public function scopePending($query)
    {
        return $query->whereHas('status', function($q) {
            $q->where('name', 'Pendente');
        });
    }

    public function scopeConfirmed($query)
    {
        return $query->whereHas('status', function($q) {
            $q->where('name', 'Confirmada');
        });
    }

    public function scopeCancelled($query)
    {
        return $query->whereHas('status', function($q) {
            $q->where('name', 'Cancelada');
        });
    }

    public function scopeActive($query)
    {
        return $query->whereHas('status', function($q) {
            $q->whereIn('name', ['Pendente', 'Confirmada']);
        });
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByProperty($query, $propertyId)
    {
        return $query->where('property_id', $propertyId);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('check_in', '>=', now());
    }

    public function scopeCurrent($query)
    {
        return $query->where('check_in', '<=', now())
            ->where('check_out', '>=', now());
    }

    public function scopePast($query)
    {
        return $query->where('check_out', '<', now());
    }

    //  MÉTODOS DE PREÇO
    public function calculateTotal(): void
    {
        $subtotal = $this->price_per_night * $this->nights;
        $total = $subtotal + $this->cleaning_fee + $this->service_fee;

        $this->update([
            'subtotal' => $subtotal,
            'total_amount' => $total,
        ]);
    }

    public function getRemainingBalance(): float
    {
        return $this->total_amount - $this->amount_paid;
    }

    //  MÉTODOS DE DATA
    public function isUpcoming(): bool
    {
        return $this->check_in > now();
    }

    public function isCurrent(): bool
    {
        return $this->check_in <= now() && $this->check_out >= now();
    }

    public function isPast(): bool
    {
        return $this->check_out < now();
    }

    public function isCancellable(): bool
    {

        return $this->check_in > now()->addDays(1) &&
            ($this->status->name ?? '') !== 'Cancelada';
    }

    // MÉTODOS DE STATUS
    public function confirm(): void
    {
        $this->update([
            'status_id' => ReservationStatus::where('name', 'Confirmada')->first()->id,
            'confirmed_at' => now(),
        ]);
    }

    public function cancel($reason = null): void
    {
        $this->update([
            'status_id' => ReservationStatus::where('name', 'Cancelada')->first()->id,
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);
    }

    public function markAsPaid(): void
    {
        $this->update([
            'payment_status' => 'paid',
            'amount_paid' => $this->total_amount,
            'payment_date' => now(),
        ]);
    }

    // MÉTODOS ÚTEIS
    public static function generateReservationCode(): string
    {
        do {
            $code = 'RSV' . strtoupper(Str::random(8));
        } while (self::where('reservation_code', $code)->exists());

        return $code;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->reservation_code)) {
                $model->reservation_code = self::generateReservationCode();
            }

            // Calcular número de noites
            if ($model->check_in && $model->check_out) {
                $model->nights = $model->check_in->diffInDays($model->check_out);
            }
        });

        static::updating(function ($model) {
            // Recalcular noites se datas mudarem
            if ($model->isDirty(['check_in', 'check_out'])) {
                $model->nights = $model->check_in->diffInDays($model->check_out);
            }
        });
    }
}
