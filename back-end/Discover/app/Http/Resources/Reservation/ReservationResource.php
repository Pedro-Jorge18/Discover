<?php

namespace App\Http\Resources\Reservation;

use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'reservation_code' => $this->reservation_code,
            'property_id' => $this->property_id,  // Necessário para verificar se propriedade foi deletada

            // DATAS E PERÍODO
            'check_in' => $this->check_in->format('Y-m-d'),
            'check_out' => $this->check_out->format('Y-m-d'),
            'nights' => $this->nights,

            // HÓSPED - Incluir user_id para notificações
            'user_id' => $this->user_id,
            'guests' => [
                'adults' => $this->adults,
                'children' => $this->children,
                'infants' => $this->infants,
                'total' => $this->adults + $this->children,
            ],

            // FINANCEIRO
            'pricing' => [
                'price_per_night' => (float) $this->price_per_night,
                'cleaning_fee' => (float) $this->cleaning_fee,
                'service_fee' => (float) $this->service_fee,
                'security_deposit' => (float) $this->security_deposit,
                'subtotal' => (float) $this->subtotal,
                'total_amount' => (float) $this->total_amount,
                'amount_paid' => (float) $this->amount_paid,
                'remaining_balance' => (float) $this->getRemainingBalance(),
            ],

            // PAGAMENTO
            'payment' => [
                'status' => $this->payment_status,
                'method' => $this->payment_method,
                'transaction_id' => $this->transaction_id,
                'payment_date' => $this->payment_date?->format('Y-m-d H:i:s'),
            ],
            // raw payment metadata from successful payment (if loaded)
            'payment_metadata' => $this->whenLoaded('successfulPayment', function () {
                return $this->successfulPayment?->metadata;
            }),

            // DETALHES
            'special_requests' => $this->special_requests,
            'status' => $this->status->name,
            'status_name' => $this->status->name,  // Alias para compatibilidade
            'confirmed_at' => $this->confirmed_at?->format('Y-m-d H:i:s'),
            'cancelled_at' => $this->cancelled_at?->format('Y-m-d H:i:s'),
            'cancellation_reason' => $this->cancellation_reason,
            'total_amount' => (float) $this->total_amount,  // Também no nível principal para fácil acesso

            // RELACIONAMENTOS
            'property' => $this->whenLoaded('property', function () {
                return [
                    'id' => $this->property->id,
                    'title' => $this->property->title,
                    'slug' => $this->property->slug,
                    'main_image' => $this->property->main_image_url,
                ];
            }),

            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),

            // METADADOS
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),

            // STATUS LÓGICO
            'is_upcoming' => $this->isUpcoming(),
            'is_current' => $this->isCurrent(),
            'is_past' => $this->isPast(),
            'is_cancellable' => $this->isCancellable(),
            'is_paid' => $this->payment_status === 'paid',
        ];
    }
}
