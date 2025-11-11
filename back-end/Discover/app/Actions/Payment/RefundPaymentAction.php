<?php


namespace App\Actions\Payment;

use Throwable;
use Carbon\Carbon;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use App\Services\Payment\PaymentServiceInterface;

class RefundPaymentAction
{
    public function __construct(protected PaymentServiceInterface $paymentService) {}

    public function execute(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            try {
                $this->paymentService->refund($payment->gateway_payment_id);

                $payment->update([
                    'status' => 'refunded',
                    'refunded_at' => Carbon::now(),
                ]);
            } catch (Throwable $e) {
                report($e);
                throw new \RuntimeException('Fail to refund payment: ' . $e->getMessage());
            }
        });
    }
}