<?php

namespace App\Http\Resources\Payment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reservation_id' => $this->reservation_id,
            'user_id' => $this->user_id,


            'payment_gateway' => $this->payment_gateway,
            'gateway_payment_id' => $this->gateway_payment_id,
            'gateway_intent_id' => $this->gateway_intent_id,


            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'gateway_fee' => (float) $this->gateway_fee,


            'status' => $this->status,
            'failure_reason' => $this->failure_reason,


            'processed_at' => optional($this->processed_at)->toIso8601String(),
            'failed_at' => optional($this->failed_at)->toIso8601String(),
            'refunded_at' => optional($this->refunded_at)->toIso8601String(),
            'created_at' => optional($this->created_at)->toIso8601String(),


            'reservation' => $this->whenLoaded('reservation', function () {
                return [
                    'id' => $this->reservation->id,
                    'status' => $this->reservation->status,
                    'start_date' => $this->reservation->start_date,
                    'end_date' => $this->reservation->end_date,
                ];
            }),


            'description' => $this->description,
        ];
    }
}