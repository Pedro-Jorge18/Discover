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
    public function createReservationWithPayment(array $data, int $userId, string $paymentMethod): Reservation
    {
        return DB::transaction(function () use ($data, $userId, $paymentMethod) {
            $reservation = $this->createReservation->executeWithFullPayment($data, $paymentMethod);

            Log::info('Reservation created with payment', [
                'reservation_code' => $reservation->reservation_code,
                'payment_method' => $paymentMethod
            ]);

            return $reservation;
        });
    }

    /**
     * Busca reservas de um usuário
     */
    public function getUserReservations(int $userId, array $filters = []): Collection
    {
        $query = Reservation::with(['property', 'status'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc');

        // Filtros
        if (isset($filters['status'])) {
            $query->whereHas('status', function ($q) use ($filters) {
                $q->where('name', $filters['status']);
            });
        }

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
        $reservation = $this->findUserReservation($reservationId, $userId);

        if (!$reservation) {
            throw new \Exception('Reservation not found');
        }

        if (!$reservation->isCancellable()) {
            throw new \Exception('This reservation cannot be cancelled');
        }

        $reservation->cancel($reason);

        Log::info('Reservation cancelled', [
            'reservation_id' => $reservationId,
            'user_id' => $userId,
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

        $confirmedStatus = ReservationStatus::where('name', 'Confirmed')->first();

        if (!$confirmedStatus) {
            throw new \Exception('Confirmed status not found');
        }

        $reservation->update([
            'status_id' => $confirmedStatus->id,
            'confirmed_at' => now()
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
        $confirmed = $query->clone()->whereHas('status', fn($q) => $q->where('name', 'Confirmed'))->count();
        $pending = $query->clone()->whereHas('status', fn($q) => $q->where('name', 'Pending'))->count();
        $cancelled = $query->clone()->whereHas('status', fn($q) => $q->where('name', 'Cancelled'))->count();

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
}
