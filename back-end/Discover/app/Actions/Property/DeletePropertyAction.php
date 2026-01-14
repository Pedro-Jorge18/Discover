<?php

namespace App\Actions\Property;

use App\Repositories\Contracts\PropertyRepositoryInterface;
use App\Models\Reservation;
use App\Models\ReservationStatus;
use App\Models\Payment;
use App\Models\UserNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DeletePropertyAction
{
    public function __construct(
        private PropertyRepositoryInterface $propertyRepository
    ) {}

    public function execute(int $id): bool
    {
        try {
            DB::beginTransaction();

            Log::info('Deleting property', ['property_id' => $id]);

            // Fetch ALL reservations for this property (not just active ones)
            $allReservations = Reservation::where('property_id', $id)
                ->with(['user', 'payments', 'status', 'property'])
                ->get();

            Log::info('Found reservations for deletion', [
                'property_id' => $id,
                'total_reservations' => $allReservations->count()
            ]);

            // For each reservation, process cancellation if necessary and create notification
            foreach ($allReservations as $reservation) {
                $statusName = $reservation->status->name ?? '';
                $isActive = in_array($statusName, ['Pendente', 'Pending', 'Confirmada', 'Confirmed']);
                
                Log::info('Processing reservation', [
                    'reservation_id' => $reservation->id,
                    'status' => $statusName,
                    'is_active' => $isActive
                ]);

                // Cancelar a reserva se estiver ativa
                if ($isActive) {
                    $cancelledStatus = ReservationStatus::whereIn('name', ['Cancelada', 'Cancelled'])->first();
                    if ($cancelledStatus) {
                        $reservation->update([
                            'status_id' => $cancelledStatus->id,
                            'cancellation_reason' => 'Propriedade foi removida pelo host'
                        ]);
                    }

                    // Process payment refund
                    $payment = $reservation->payments()->where('status', 'completed')->first();
                    if ($payment) {
                        $payment->update([
                            'status' => 'refunded',
                            'refund_amount' => $payment->amount,
                            'refund_date' => now(),
                            'refund_reason' => 'Propriedade removida'
                        ]);

                        Log::info('Payment refunded due to property deletion', [
                            'property_id' => $id,
                            'reservation_id' => $reservation->id,
                            'user_id' => $reservation->user_id,
                            'refund_amount' => $payment->amount
                        ]);
                    }
                }

                // Create notification for ALL reservations (active or not)
                // If already cancelled, notification helps user understand why
                $wasConfirmed = in_array($statusName, ['Confirmada', 'Confirmed']);
                $propertyTitle = $reservation->property->title ?? 'Propriedade removida';
                
                $message = $wasConfirmed
                    ? "A propriedade \"{$propertyTitle}\" foi apagada. A sua reserva foi cancelada e o valor de €{$reservation->total_amount} foi devolvido."
                    : "A propriedade \"{$propertyTitle}\" foi apagada. A sua reserva foi cancelada.";

                try {
                    $notification = UserNotification::create([
                        'user_id' => $reservation->user_id,
                        'title' => '💰 Dinheiro Devolvido',
                        'message' => $message,
                        'type' => 'refund',
                        'reservation_id' => $reservation->id,
                        'meta' => [
                            'amount' => (float) $reservation->total_amount,
                            'propertyTitle' => $propertyTitle,
                            'propertyId' => $id,
                        ],
                        'read' => false,
                    ]);

                    Log::info('Notification created', [
                        'notification_id' => $notification->id,
                        'user_id' => $reservation->user_id,
                        'reservation_id' => $reservation->id
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to create notification', [
                        'error' => $e->getMessage(),
                        'reservation_id' => $reservation->id,
                        'user_id' => $reservation->user_id
                    ]);
                }
            }

            // Deletar a propriedade
            $deleted = $this->propertyRepository->delete($id);

            DB::commit();
            
            return $deleted;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting property and processing refunds: ' . $e->getMessage());
            throw $e;
        }
    }
}

