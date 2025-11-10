<?php

namespace App\Http\Controllers\Webhook;

use Stripe\Webhook;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Actions\Payment\FailPaymentAction;
use App\Actions\Payment\ConfirmPaymentAction;
use Illuminate\Http\JsonResponse;

class StripeWebHookController extends Controller
{
    public function __construct(
        private ConfirmPaymentAction $confirmPayment,
        private FailPaymentAction $failPayment,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Exception $e) {
            Log::warning('Stripe webhook inválido', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $type = $event->type;
        $data = $event->data['object'];

        Log::info('Stripe webhook received', ['type' => $type]);

        if ($type === 'checkout.session.completed') {
            $paymentIntentId = $data['payment_intent'] ?? null;
            $reservationId = isset($data['metadata']) && is_array($data['metadata']) ? ($data['metadata']['reservation_id'] ?? null) : null;

            if ($paymentIntentId && $reservationId) {
                $payment = Payment::where('gateway_intent_id', $paymentIntentId)->first();

                if ($payment) {
                    $this->confirmPayment->execute($payment);
                } else {
                    Log::warning('Pagamento não encontrado no webhook', [
                        'intent' => $paymentIntentId,
                        'reservation' => $reservationId,
                    ]);
                }
            }
        }

        //when payment failed
        if ($type === 'payment_intent.payment_failed') {
            $intentId = $data['id'] ?? null;
            if ($intentId) {
                $payment = Payment::where('gateway_intent_id', $intentId)->first();
                if ($payment) {
                    $this->failPayment->execute(
                        $payment,
                        isset($data['last_payment_error']['message'])
                            ? $data['last_payment_error']['message']
                            : 'Payment failed'
                    );
                }
            }
        }

        return response()->json(['status' => 'success'], 200);
    }
}