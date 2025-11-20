<?php

namespace App\Actions\Reservation;

use App\DTOs\Reservation\ReservationData;
use App\Models\Reservation;
use App\Services\Payment\PaymentServiceInterface;
use App\Exceptions\Reservation\ReservationCreationException;
use Illuminate\Support\Facades\DB;

class CreateReservationAction
{
    public function __construct(
        private CheckAvailabilityAction $checkAvailabilityAction,
        private ?PaymentServiceInterface $paymentService = null,
    ) {}

    public function execute(ReservationData $reservationData): Reservation
    {
        return DB::transaction(function () use ($reservationData) {
            try {
                // VERIFICAR DISPONIBILIDADE
                $this->checkAvailabilityBeforeCreation($reservationData);

                // PREPARAR DADOS PARA CRIAÇÃO
                $reservationArray = $this->prepareReservationData($reservationData);

                // CRIAR A RESERVA
                $reservation = $this->createReservationRecord($reservationArray);

                // PROCESSAR PAGAMENTO SE NECESSÁRIO
                $this->handlePaymentIfNeeded($reservation, $reservationData);

                // RETORNAR RESERVA COM RELACIONAMENTOS
                return $this->loadReservationWithRelations($reservation);

            } catch (\Exception $e) {
                throw new ReservationCreationException(
                    "Failed to create reservation: " . $e->getMessage(),
                    $e->getCode() ?: 422
                );
            }
        });
    }

    public function checkAvailabilityBeforeCreation(ReservationData $data): void
    {
        $availabilityResult = $this->checkAvailabilityAction->execute(
            propertyId: $data->property_id,
            checkIn: $data->check_in,
            checkOut: $data->check_out,
            adults: $data->adults,
            children: $data->children,
            infants: $data->infants,
        );
        if (!$availabilityResult->available) {
            $message = $availabilityResult->message;

            if (!empty($availabilityResult->validationErrors)) {
                $message .= " " . implode(' ', array_values($availabilityResult->validationErrors));
            }

            throw new ReservationCreationException($message, 422);
        }

    }
    private function prepareReservationData(ReservationData $data): array
    {
        $reservationArray = $data->toArray();

        //  Garantir que reservation_code seja gerado se não fornecido
        if (empty($reservationArray['reservation_code'])) {
            $reservationArray['reservation_code'] = Reservation::generateReservationCode();
        }

        //  Definir confirmed_at se status for confirmado e não estiver definido
        if ($this->shouldAutoConfirm($data) && empty($reservationArray['confirmed_at'])) {
            $reservationArray['confirmed_at'] = now();
        }

        //  Sincronizar payment_status com amount_paid
        $reservationArray = $this->syncPaymentStatus($reservationArray);

        return $reservationArray;
    }

    private function shouldAutoConfirm(ReservationData $data): bool
    {
        return $data->isPaid() || $data->isConfirmed();
    }

    //Sincroniza status de pagamento com valor pago
    private function syncPaymentStatus(array $data): array
    {
        // Se está totalmente pago, marca como paid
        if ($data['amount_paid'] >= $data['total_amount']) {
            $data['payment_status'] = 'paid';
            if (empty($data['payment_date'])) {
                $data['payment_date'] = now();
            }
        }

        // Se payment_status é paid mas amount_paid é zero, ajusta
        if ($data['payment_status'] === 'paid' && $data['amount_paid'] === 0.0) {
            $data['amount_paid'] = $data['total_amount'];
        }

        return $data;
    }

    // Cria o registro da reserva no banco
    private function createReservationRecord(array $data): Reservation
    {
        $reservation = Reservation::create($data);

        if (!$reservation) {
            throw new ReservationCreationException('Failed to save reservation to database');
        }

        return $reservation;
    }

    //Processa pagamento se necessário
    private function handlePaymentIfNeeded(Reservation $reservation, ReservationData $data): void
    {
        // Se já está paga, não precisa processar pagamento
        if ($data->isPaid()) {
            return;
        }

        $remainingBalance = $reservation->getRemainingBalance();

        if ($remainingBalance > 0 && !empty($data->payment_method)&& $this->paymentService) {

            echo " PaymentService disposable\n";
        } elseif ($remainingBalance > 0) {
            echo "️ Payment no guard: € {$remainingBalance} (PaymentService no configuration)\n";
        }
    }

    private function loadReservationWithRelations(Reservation $reservation): Reservation
    {
        return $reservation->load([
            'property' => function ($query) {
                $query->select('id', 'title', 'host_id', 'price_per_night');
            },
            'property.host' => function ($query) {
                $query->select('id', 'name', 'email');
            },
            'user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone');
            },
            'status' => function ($query) {
                $query->select('id', 'name', 'color');
            }
        ]);
    }

    public function createSimpleReservation(array $data): Reservation
    {
        $reservationData = ReservationData::fromArray($data);
        return $this->execute($reservationData);
    }

}
