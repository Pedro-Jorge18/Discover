<?php

namespace App\Services;

use App\Actions\Reservation\CheckAvailabilityAction;
use App\Actions\Reservation\CreateReservationAction;
use App\DTOs\Reservation\ReservationData;
use App\DTOs\Reservation\AvailabilityResult;
use App\Models\Reservation;
use App\Models\ReservationStatus;
use App\Models\Property;
use App\Models\User;
use App\Services\Payment\PaymentServiceInterface;
use App\Exceptions\Reservation\ReservationConflictException;
use App\Exceptions\Reservation\ReservationCreationException;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservationService
{
    public function __construct(
        private CheckAvailabilityAction $checkAvailabilityAction,
        private CreateReservationAction $createReservationAction,
        private ?PaymentServiceInterface $paymentService = null
    ) {}

    /**
     * Cria uma nova reserva - MÉTODO PRINCIPAL
     *
     * @param array $data Dados da reserva
     * @param int $userId ID do usuário
     * @return Reservation
     * @throws ReservationCreationException
     */
    public function createReservation(array $data, int $userId): Reservation
    {
        Log::info('Starting reservation creation', ['user_id' => $userId, 'property_id' => $data['property_id']]);

        try {
            // VALIDAR E PREPARAR DADOS
            $reservationData = $this->prepareReservationData($data, $userId);

            // CRIAR RESERVA (já inclui validação de disponibilidade)
            $reservation = $this->createReservationAction->execute($reservationData);

            // REGISTRAR LOG DE SUCESSO
            Log::info('Reservation created successfully', [
                'reservation_code' => $reservation->reservation_code,
                'user_id' => $userId,
                'total_amount' => $reservation->total_amount
            ]);

            return $reservation;

        } catch (ReservationConflictException $e) {
            Log::warning('Reservation conflict', [
                'user_id' => $userId,
                'property_id' => $data['property_id'],
                'error' => $e->getMessage()
            ]);
            throw $e;

        } catch (\Exception $e) {
            Log::error('Unexpected error creating reservation', [
                'user_id' => $userId,
                'property_id' => $data['property_id'],
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new ReservationCreationException(
                'Internal error creating reservation: ' . $e->getMessage()
            );
        }
    }

    //Verifica disponibilidade de propriedade
    public function checkAvailability(
        int $propertyId,
        Carbon $checkIn,
        Carbon $checkOut,
        int $adults = 1,
        int $children = 0,
        int $infants = 0
    ): AvailabilityResult {
        return $this->checkAvailabilityAction->execute(
            propertyId: $propertyId,
            checkIn: $checkIn,
            checkOut: $checkOut,
            adults: $adults,
            children: $children,
            infants: $infants
        );
    }

    // Cria reserva com pagamento integrado
    public function createReservationWithPayment(array $data, int $userId, array $paymentData = []): array
    {
        return DB::transaction(function () use ($data, $userId, $paymentData) {
            // CRIAR RESERVA
            $reservation = $this->createReservation($data, $userId);

            // PROCESSAR PAGAMENTO SE NECESSÁRIO
            $paymentResult = null;
            $remainingBalance = $reservation->getRemainingBalance();

            if ($remainingBalance > 0 && $this->paymentService) {
                $paymentResult = $this->processReservationPayment($reservation->id, $paymentData);
            }

            return [
                'reservation' => $reservation,
                'payment' => $paymentResult,
                'remaining_balance' => $remainingBalance
            ];
        });
    }

    //Processa pagamento para uma reserva
    public function processReservationPayment(int $reservationId, array $paymentData): array
    {
        $reservation = Reservation::findOrFail($reservationId);

        if (!$this->paymentService) {
            throw new \RuntimeException('Payment service not available');
        }

        // VALIDAR SE AINDA HÁ SALDO PENDENTE
        if ($reservation->getRemainingBalance() <= 0) {
            throw new \InvalidArgumentException('Reservation already paid');
        }

        // PROCESSAR PAGAMENTO (integração futura)
        // $paymentResult = $this->paymentService->createPaymentIntent([
        //     'amount' => $reservation->getRemainingBalance(),
        //     'currency' => 'BRL',
        //     'metadata' => [
        //         'reservation_id' => $reservation->id,
        //         'reservation_code' => $reservation->reservation_code
        //     ]
        // ]);

        return [
            'reservation_id' => $reservation->id,
            'amount_due' => $reservation->getRemainingBalance(),
            'payment_processed' => false, // Temporariamente false
            'message' => 'Payment processing would be implemented here'
        ];
    }

    //Confirma uma reserva
    public function confirmReservation(int $reservationId): Reservation
    {
        $reservation = Reservation::with(['property', 'user', 'status'])->findOrFail($reservationId);

        $confirmedStatus = ReservationStatus::where('name', 'Confirmed')->first();

        if (!$confirmedStatus) {
            throw new \RuntimeException('Confirmed status not found');
        }

        $reservation->update([
            'status_id' => $confirmedStatus->id,
            'confirmed_at' => now()
        ]);

        Log::info('Reserved confirmed', ['reservation_id' => $reservationId]);

        return $reservation->fresh();
    }

    // Cancela uma reserva
    public function cancelReservation(int $reservationId, string $reason = null): Reservation
    {
        $reservation = Reservation::with(['property', 'user', 'status'])->findOrFail($reservationId);

        $cancelledStatus = ReservationStatus::where('name', 'Cancelled')->first();

        if (!$cancelledStatus) {
            throw new \RuntimeException('Cancelled status not found');
        }

        $reservation->update([
            'status_id' => $cancelledStatus->id,
            'cancellation_reason' => $reason,
            'cancelled_at' => now()
        ]);

        Log::info('Reserved Cancelled', [
            'reservation_id' => $reservationId,
            'reason' => $reason
        ]);

        return $reservation->fresh();
    }

    // Obtém reservas de um usuário
    public function getUserReservations(int $userId, array $filters = []): Collection
    {
        $query = Reservation::with(['property', 'status'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc');

        // FILTROS
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

        return $query->get();
    }

    // Obtém reservas de uma propriedade
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
    private function generateReservationCode(): string
    {
        return 'RES' . strtoupper(uniqid()) . now()->format('His');
    }

    // Prepara dados para criação da reserva
    private function prepareReservationData(array $data, int $userId): ReservationData
    {
        // SEGURANÇA: Garante que user_id vem do usuário autenticado
        $data['user_id'] = $userId;

        // BUSCA PREÇOS DA PROPRIEDADE (se não foram fornecidos)
        if (!isset($data['price_per_night']) && isset($data['property_id'])) {
            $property = Property::find($data['property_id']);

            if (!$property) {
                throw new \InvalidArgumentException('Property not found');
            }

            // Apenas define preços, NÃO calcula totais
            $data['price_per_night'] = $property->price_per_night;
            $data['cleaning_fee'] = $data['cleaning_fee'] ?? $property->cleaning_fee;
            $data['service_fee'] = $data['service_fee'] ?? $property->service_fee;

            // O DTO vai calcular subtotal e total_amount automaticamente!
        }

        // STATUS PADRÃO
        if (!isset($data['status_id'])) {
            $pendingStatus = ReservationStatus::where('name', 'Pending')->first();
            if ($pendingStatus) {
                $data['status_id'] = $pendingStatus->id;
            }
        }

        // CÓDIGO DA RESERVA
        if (!isset($data['reservation_code'])) {
            $data['reservation_code'] = $this->generateReservationCode();
        }

       return ReservationData::fromArray($data);
    }

    // Verifica disponibilidade em lote para múltiplas propriedades
    public function checkMultiplePropertiesAvailability(
        array $propertyIds,
        Carbon $checkIn,
        Carbon $checkOut,
        int $adults = 1,
        int $children = 0,
        int $infants = 0
    ): array {
        $results = [];

        foreach ($propertyIds as $propertyId) {
            $result = $this->checkAvailability(
                $propertyId,
                $checkIn,
                $checkOut,
                $adults,
                $children,
                $infants
            );

            $results[$propertyId] = $result;
        }

        return $results;
    }

    // Obtém estatísticas de reservas
    public function getReservationStats(int $userId = null): array
    {
        $query = Reservation::query();

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $total = $query->count();
        $confirmed = $query->clone()->whereHas('status', fn($q) => $q->where('name', 'Confirmada'))->count();
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
}
