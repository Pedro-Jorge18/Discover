<?php

namespace App\Services\Reservation;

use App\Actions\Reservation\CheckAvailabilityAction;
use App\Actions\Reservation\CalculatePricingAction;
use App\Actions\Reservation\CreateReservationAction;
use App\Actions\Reservation\ValidateReservationAction;
use App\DTOs\Reservation\ReservationData;
use App\Http\Resources\Reservation\ReservationResource;
use App\Models\Reservation;
use App\Models\ReservationStatus;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservationService
{
    public function __construct(
        private CheckAvailabilityAction $checkAvailability,
        private CalculatePricingAction $calculatePricing,
        private CreateReservationAction $createReservation,
        private ValidateReservationAction $validateReservation
    ) {}

    /**
     * Verifica disponibilidade de uma propriedade
     */
    public function checkPropertyAvailability(int $propertyId, string $checkIn, string $checkOut, int $adults = 1, int $children = 0, int $infants = 0): array
    {
        try {
            $result = $this->checkAvailability->execute(
                $propertyId,
                Carbon::parse($checkIn),
                Carbon::parse($checkOut),
                $adults,
                $children,
                $infants
            );

            // Se disponível, calcula preços também
            if ($result['available']) {
                $property = Property::find($propertyId);
                $pricing = $this->calculatePricing->execute(
                    $property,
                    Carbon::parse($checkIn),
                    Carbon::parse($checkOut)
                );

                $result['pricing'] = $pricing;
                $result['dates'] = [
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'nights' => $pricing['nights']
                ];
            }

            return $result;

        } catch (\Exception $e) {
            Log::error('Availability check failed', [
                'property_id' => $propertyId,
                'error' => $e->getMessage()
            ]);

            return [
                'available' => false,
                'message' => 'Error checking availability'
            ];
        }
    }

    /**
     * Cria uma nova reserva
     */
    public function createReservation(array $data, int $userId): Reservation
    {
        try {
            // Prepara dados com user_id
            $data['user_id'] = $userId;

            // Converte para DTO
            $reservationData = $this->prepareReservationData($data);
            $this->validateReservation->execute(ReservationData::fromArray($reservationData));
            $reservation = $this->createReservation->execute($reservationData);

            Log::info('Reservation created successfully', [
                'reservation_code' => $reservation->reservation_code,
                'user_id' => $userId
            ]);

            return $reservation;

        } catch (\Exception $e) {
            Log::error('Reservation creation failed', [
                'user_id' => $userId,
                'property_id' => $data['property_id'] ?? 'unknown',
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Cria reserva com pagamento instantâneo
     */
    public function createReservationWithPayment(array $data, int $userId, ?string $paymentMethod = null): Reservation
    {
        try {
            return DB::transaction(function () use ($data, $userId) {
                
                $totalAmount = floatval($data['total_amount'] ?? 0);
                $nights = intval($data['nights'] ?? 1);
                
                // Criar reserva SIMPLES
                $reservation = Reservation::create([
                    'property_id' => intval($data['property_id']),
                    'user_id' => $userId,
                    'check_in' => $data['check_in'],
                    'check_out' => $data['check_out'],
                    'adults' => intval($data['adults'] ?? 1),
                    'children' => intval($data['children'] ?? 0),
                    'infants' => intval($data['infants'] ?? 0),
                    'nights' => $nights,
                    'price_per_night' => $totalAmount / max($nights, 1),
                    'subtotal' => $totalAmount,
                    'total_amount' => $totalAmount,
                    'reservation_code' => 'RES-' . strtoupper(bin2hex(random_bytes(4))),
                    // deixar Pendente; o host confirmará manualmente
                    'status_id' => 1,
                ]);

                // Criar pagamento
                if ($reservation->id) {
                    // Save payment and include any safe metadata (payer info)
                    DB::table('payments')->insert([
                        'reservation_id' => $reservation->id,
                        'user_id' => $userId,
                        'amount' => $totalAmount,
                        'payment_gateway' => 'manual',
                        'status' => 'completed',
                        'metadata' => isset($data['payment_metadata']) ? json_encode($data['payment_metadata']) : null,
                        'processed_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                Log::info('Reservation created with payment', [
                    'reservation_id' => $reservation->id,
                    'user_id' => $userId,
                    'amount' => $totalAmount,
                    'code' => $reservation->reservation_code
                ]);

                return $reservation;
            });
        } catch (\Exception $e) {
            Log::error('Failed to create reservation with payment', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    /**
     * Busca reservas de um usuário
     */
    public function getUserReservations(int $userId, array $filters = []): Collection
    {
        $query = Reservation::with(['property', 'status', 'successfulPayment'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc');

        // Filtros
        $this->applyStatusFilter($query, $filters['status'] ?? null);

        if (isset($filters['upcoming']) && $filters['upcoming']) {
            $query->where('check_in', '>=', now());
        }

        if (isset($filters['past']) && $filters['past']) {
            $query->where('check_out', '<', now());
        }

        if (isset($filters['current']) && $filters['current']) {
            $query->where('check_in', '<=', now())
                ->where('check_out', '>=', now());
        }

        return $query->get();
    }

    /**
     * Busca reservas de propriedades de um host
     */
    public function getHostReservations(int $hostId, array $filters = []): Collection
    {
        $query = Reservation::with(['property', 'status', 'user'])
            ->whereHas('property', function ($q) use ($hostId) {
                $q->where('host_id', $hostId);
            })
            ->orderBy('created_at', 'desc');

        $this->applyStatusFilter($query, $filters['status'] ?? null);

        return $query->get();
    }

    /**
     * Busca reservas de uma propriedade
     */
    public function getPropertyReservations(int $propertyId, array $filters = []): Collection
    {
        $query = Reservation::with(['user', 'status'])
            ->where('property_id', $propertyId)
            ->orderBy('check_in', 'asc');

        if (isset($filters['status'])) {
            $query->whereHas('status', function ($q) use ($filters) {
                $q->where('name', $filters['status']);
            });
        }

        if (isset($filters['from_date'])) {
            $query->where('check_in', '>=', Carbon::parse($filters['from_date']));
        }

        if (isset($filters['to_date'])) {
            $query->where('check_out', '<=', Carbon::parse($filters['to_date']));
        }

        return $query->get();
    }

    /**
     * Encontra reserva específica do usuário
     */
    public function findUserReservation(int $reservationId, int $userId): ?Reservation
    {
        return Reservation::where('id', $reservationId)
            ->where('user_id', $userId)
            ->with(['property', 'status', 'user'])
            ->first();
    }

    /**
     * Cancela uma reserva
     */
    public function cancelReservation(int $reservationId, int $userId, ?string $reason = null): Reservation
    {
        $reservation = Reservation::with('property')->find($reservationId);

        if (!$reservation) {
            throw new \Exception('Reservation not found');
        }

        $isGuest = $reservation->user_id === $userId;
        $isHost = $reservation->property && $reservation->property->host_id === $userId;

        if (!$isGuest && !$isHost) {
            throw new \Exception('You are not allowed to cancel this reservation');
        }

        // Guests: respect cancellable rules. Hosts: allow override to reject/recusar.
        if (!$isHost && !$reservation->isCancellable()) {
            throw new \Exception('This reservation cannot be cancelled');
        }

        $reservation->cancel($reason);

        Log::info('Reservation cancelled', [
            'reservation_id' => $reservationId,
            'user_id' => $userId,
            'as_host' => $isHost,
            'reason' => $reason
        ]);

        return $reservation->fresh();
    }

    /**
     * Confirma uma reserva (para hosts)
     */
    public function confirmReservation(int $reservationId): Reservation
    {
        $reservation = Reservation::findOrFail($reservationId);

        // Try Portuguese then English status names
        $confirmedStatus = ReservationStatus::whereIn('name', ['Confirmada', 'Confirmed'])->first();

        if (!$confirmedStatus) {
            throw new \Exception('Confirmed status not found');
        }

        $reservation->update([
            'status_id' => $confirmedStatus->id,
            'confirmed_at' => now()
        ]);

        Log::info('Reservation confirmed', [
            'reservation_id' => $reservationId,
            'user_id' => $reservation->user_id,
            'property_id' => $reservation->property_id,
            'confirmed_at' => $reservation->confirmed_at,
        ]);

        return $reservation->fresh();
    }

    /**
     * Estatísticas de reservas
     */
    public function getReservationStats(?int $userId = null): array
    {
        $query = Reservation::query();

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $total = $query->count();
        $confirmed = $query->clone()->whereHas('status', fn($q) => $q->whereIn('name', ['Confirmada', 'Confirmed']))->count();
        $pending = $query->clone()->whereHas('status', fn($q) => $q->whereIn('name', ['Pendente', 'Pending']))->count();
        $cancelled = $query->clone()->whereHas('status', fn($q) => $q->whereIn('name', ['Cancelada', 'Cancelled']))->count();

        return [
            'total' => $total,
            'confirmed' => $confirmed,
            'pending' => $pending,
            'cancelled' => $cancelled,
            'completion_rate' => $total > 0 ? round(($confirmed / $total) * 100, 2) : 0,
        ];
    }

    /**
     * Verifica disponibilidade em lote para múltiplas propriedades
     */
    public function checkMultiplePropertiesAvailability(array $propertyIds, string $checkIn, string $checkOut, int $adults = 1): array
    {
        $results = [];

        foreach ($propertyIds as $propertyId) {
            $results[$propertyId] = $this->checkPropertyAvailability(
                $propertyId,
                $checkIn,
                $checkOut,
                $adults
            );
        }

        return $results;
    }
    private function prepareReservationData(array $data): array
    {
        return [
            'property_id' => $data['property_id'],
            'user_id' => $data['user_id'],
            'check_in' => Carbon::parse($data['check_in']),
            'check_out' => Carbon::parse($data['check_out']),
            'adults' => $data['adults'] ?? 1,
            'children' => $data['children'] ?? 0,
            'infants' => $data['infants'] ?? 0,
            'special_requests' => $data['special_requests'] ?? null,


        ];
    }

    /**
     * Aplica filtro de status aceitando PT/EN e case-insensitive
     */
    private function applyStatusFilter($query, $status = null): void
    {
        if (!$status) {
            return;
        }

        $normalized = strtolower(trim($status));
        $map = [
            'pending' => ['Pendente', 'Pending'],
            'pendente' => ['Pendente', 'Pending'],
            'confirmed' => ['Confirmada', 'Confirmed'],
            'confirmada' => ['Confirmada', 'Confirmed'],
            'cancelled' => ['Cancelada', 'Cancelled'],
            'cancelada' => ['Cancelada', 'Cancelled'],
        ];

        $names = $map[$normalized] ?? [ucfirst($normalized)];

        $query->whereHas('status', function ($q) use ($names) {
            $q->whereIn('name', $names);
        });
    }
}
