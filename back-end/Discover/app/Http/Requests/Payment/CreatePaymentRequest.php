<?php

namespace App\Http\Requests\Payment;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;


class CreatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
        //if you want, can add check if the user is owner of reservation
    }


    public function rules(): array
    {
        return [
            'reservation_id' => [
                'required',
                'integer',
                'exists:reservations,id',
                function ($attribute, $value, $fail) {
                    $reservation = \App\Models\Reservation::find($value);
                    if ($reservation && $reservation->user_id !== Auth::id()) {
                        $fail('Esta reserva não pertence a você.');
                    }
                }
            ],
            'amount' => ['required', 'numeric', 'min:1'],
            'currency' => ['nullable', 'string', 'size:3'],
            'payment_gateway' => ['nullable', 'string', 'in:stripe,paypal'],
            'payment_method_id' => ['nullable', 'integer', 'exists:payment_methods,id'],
            'description' => ['nullable', 'string', 'max:255'],
            'metadata' => ['nullable', 'array'],

        ];
    }
}