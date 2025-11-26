<?php

namespace App\Actions\Reservation;

use App\Models\Reservation;
use App\Models\ReservationStatus;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreateReservationAction
{
    public function __construct(
        private CheckAvailabilityAction $checkAvailability,
        private CalculatePricingAction $calculatePricing
    ) {}

    /**
     * Cria uma nova reserva
     */
    public function execute(array $reservationData): Reservation
    {
        return DB::transaction(function () use ($reservationData) {

            // 1. CONVERTE DATAS
            $checkIn = Carbon::parse($reservationData['check_in']);
            $checkOut = Carbon::parse($reservationData['check_out']);

            // 2. VERIFICA DISPONIBILIDADE
            $availability = $this->checkAvailability->execute(
                $reservationData['property_id'],
                $checkIn,
                $checkOut,
                $reservationData['adults'],
                $reservationData['children'] ?? 0,
                $reservationData['infants'] ?? 0
            );

            if (!$availability['available']) {
                throw new \Exception($availability['message']);
            }

            // 3. BUSCA PROPRIEDADE
            $property = Property::find($reservationData['property_id']);

            // 4. CALCULA PREÇOS (usando a Action dedicada)
            $pricing = $this->calculatePricing->execute($property, $checkIn, $checkOut);

            // 5. PREPARA DADOS DA RESERVA
            $reservationData = $this->prepareReservationData(
                $reservationData,
                $pricing,
                $checkIn,
                $checkOut
            );

            // 6. CRIA RESERVA
            $reservation = Reservation::create($reservationData);

            return $reservation->load(['property', 'user', 'status']);
        });
    }

    /**
     * Prepara os dados finais para criar a reserva
     */
    private function prepareReservationData(
        array $data,
        array $pricing,
        Carbon $checkIn,
        Carbon $checkOut
    ): array {

        $pendingStatus = ReservationStatus::where('name', 'Pendente')->first();

        if (!$pendingStatus) {
            // Criar status se não existir
            $pendingStatus = ReservationStatus::create([
                'name' => 'Pendente',
                'description' => 'Reserva pendente de confirmação',
                'color' => 'yellow',
                'order' => 1,
                'active' => true
            ]);
            }

        return [
            'property_id' => $data['property_id'],
            'user_id' => $data['user_id'],
            'status_id' => $pendingStatus->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'nights' => $pricing['nights'],
            'adults' => $data['adults'],
            'children' => $data['children'] ?? 0,
            'infants' => $data['infants'] ?? 0,
            'special_requests' => $data['special_requests'] ?? null,

            // Dados de preço (calculados)
            'price_per_night' => $pricing['price_per_night'],
            'cleaning_fee' => $pricing['cleaning_fee'],
            'service_fee' => $pricing['service_fee'],
            'security_deposit' => $pricing['security_deposit'],
            'subtotal' => $pricing['subtotal'],
            'total_amount' => $pricing['total_amount'],

            // Status inicial
            'payment_status' => 'pending',
            'reservation_code' => Reservation::generateReservationCode(),

            // Pagamento (se fornecido)
            'amount_paid' => $data['amount_paid'] ?? 0,
            'payment_method' => $data['payment_method'] ?? null,
        ];
    }

    /**
     * Cria reserva com pagamento completo
     */
    public function executeWithFullPayment(array $data, string $paymentMethod): Reservation
    {
        $reservation = $this->execute($data);

        // Atualiza para pago
        $reservation->update([
            'payment_status' => 'paid',
            'payment_method' => $paymentMethod,
            'amount_paid' => $reservation->total_amount,
            'payment_date' => now(),
            'confirmed_at' => now()
        ]);

        return $reservation->fresh();
    }
}
