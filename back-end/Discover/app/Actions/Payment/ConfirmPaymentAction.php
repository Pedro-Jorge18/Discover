<?php

namespace App\Actions\Payment;

use Throwable;
use Carbon\Carbon;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class ConfirmPaymentAction
{
    public function execute(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'completed',
                'processed_at' => Carbon::now(),
            ]);

            //update reservation
            $reservation = $payment->reservation ?? null;
            if ($reservation && $reservation->status !== 'confirmed') {
                $reservation->update(['status' => 'confirmed']);
            }
        });
    }
}