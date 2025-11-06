<?php

namespace App\Actions\Payment;

use Carbon\Carbon;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;


class FailPaymentAction
{
    public function execute(Payment $payment, ?string $reason = null): void
    {
        DB::transaction(function () use ($payment, $reason) {
            $payment->update([
                'status' => 'failed',
                'failure_reason' => $reason ?? 'Unknown failure.',
                'failed_at' => Carbon::now(),
            ]);
        });
    }
}
