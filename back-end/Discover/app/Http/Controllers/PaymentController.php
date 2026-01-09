<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\Payment;
use App\DTOs\Payment\PaymentDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Actions\Payment\CreatePaymentAction;
use App\Actions\Payment\RefundPaymentAction;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Requests\Payment\CreatePaymentRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PaymentController extends Controller
{

    public function __construct(
        private CreatePaymentAction $createPaymentAction,
        private RefundPaymentAction $refundPaymentAction,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $payments = Payment::where('user_id', Auth::id())
            ->with(['reservation:id,property_id,status,start_date,end_date'])
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Pagamentos encontrados com sucesso.',
            'data' => $payments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePaymentRequest $request): JsonResponse
    {
        try {
            $dto = PaymentDTO::fromRequest($request);

            $result = $this->createPaymentAction->execute($dto);

            return response()->json([
                'message' => 'Payment session created!',
                'checkout_url' => $result['checkout_url'] ?? null,
                'payment' => $result['payment'] ?? null,
            ], 201);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'error' => 'Erro ao criar sessão de pagamento.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $payment = Payment::where('user_id', Auth::id())->with(['reservation'])->findOrFail($id);

            return response()->json([
                'message' => 'Payment found.',
                'data' => $payment,
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'error' => 'Payment not found'
            ], 404);
        }
    }

    public function refund(int $id): JsonResponse
    {
        try {
            $payment = Payment::findOrFail($id);

            if (Auth::user()->cannot('refund', $payment)) {
                throw new AuthorizationException();
            }

            $this->refundPaymentAction->execute($payment);

            return response()->json([
                'message' => 'Refund processed successfully.',
                'data' => $payment->fresh(),
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'error' => 'Payment not found.',
            ], 404);
        } catch (AuthorizationException) {
            return response()->json([
                'error' => 'You are not permitted to refund this payment.',
            ], 403);
        } catch (Throwable $e) {
            report($e);
            return response()->json([
                'error' => 'Error processing refund.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
