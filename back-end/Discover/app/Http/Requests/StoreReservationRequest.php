<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use TijsVerkoyen\CssToInlineStyles\Css\Rule\Rule;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'property_id' => 'required|integer|exists:properties,id',
            'status_id' => 'required|integer|exists:reservation_statuses,id',
            'check_in' => 'required|date_format: Y-m-d H:i :s','after_or_equal:Y-m-d H:i :s', 'before_or_equal:Y-m-d H:i :s',
            'check_out' => 'required|date_format: Y-m-d H:i :s',
            'adults' => 'required|integer|min:1|max:10',
            'children' => 'required|integer|min:1|max:10',
            'infants' => 'required|integer|min:1|max:4',
            'price_per_night' => 'required|numeric|min:1|max:10',
            'cleaning_time' => 'nullable|numeric|min:0',
            'service_fee' => 'nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|max:50',Rule::in(['credit_card', 'debit_card', 'pix', 'bank_transfer']),
            'transaction_id' => 'nullable|string|max:100',
            'payment_status' => 'nullable|string|max:50',Rule::in(['pending', 'paid', 'failed', 'refunded']),
            'special_request' => 'nullable|string|max:50',

        ];
    }
    public function messages(): array
    {
        return [
            // DADOS BÁSICOS
            'property_id.required' => 'Property is required.',
            'property_id.exists' => 'The selected property is invalid.',
            'status_id.required' => 'Reservation status is required.',
            'status_id.exists' => 'The selected reservation status is invalid.',

            //  DATAS TEMPORAIS
            'check_in.required' => 'Check-in date is required.',
            'check_in.date' => 'Check-in must be a valid date.',
            'check_in.date_format' => 'Check-in must be in YYYY-MM-DD format.',
            'check_in.after_or_equal' => 'Check-in date cannot be in the past.',
            'check_in.before' => 'Reservations cannot be made more than 1 year in advance.',

            'check_out.required' => 'Check-out date is required.',
            'check_out.date' => 'Check-out must be a valid date.',
            'check_out.date_format' => 'Check-out must be in YYYY-MM-DD format.',
            'check_out.after' => 'Check-out date must be after check-in date.',

            // 👨‍👩‍👧‍ HÓSPEDES
            'adults.required' => 'Number of adults is required.',
            'adults.min' => 'At least one adult is required.',
            'adults.max' => 'Maximum 10 adults allowed.',

            'children.required' => 'Number of children is required.',
            'children.min' => 'Number of children cannot be negative.',
            'children.max' => 'Maximum 8 children allowed.',

            'infants.required' => 'Number of infants is required.',
            'infants.min' => 'Number of infants cannot be negative.',
            'infants.max' => 'Maximum 4 infants allowed.',

            //  FINANCEIRO
            'price_per_night.required' => 'Price per night is required.',
            'price_per_night.min' => 'Price per night must be at least 0.01.',

            'cleaning_fee.numeric' => 'Cleaning fee must be a number.',
            'cleaning_fee.min' => 'Cleaning fee cannot be negative.',

            'service_fee.numeric' => 'Service fee must be a number.',
            'service_fee.min' => 'Service fee cannot be negative.',

            'security_deposit.numeric' => 'Security deposit must be a number.',
            'security_deposit.min' => 'Security deposit cannot be negative.',

            //  PAGAMENTO
            'payment_method.in' => 'Invalid payment method.',
            'payment_status.in' => 'Invalid payment status.',

            //  ADICIONAIS
            'special_requests.max' => 'Special requests cannot exceed 1000 characters.',
        ];
    }
    protected function prepareForValidation()
    {
        //  Garantir que user_id vem do usuário autenticado (SEGURANÇA)
        //  NUNCA permitir que o cliente envie user_id

        //  Limpar dados de texto
        if ($this->has('special_requests')) {
            $this->merge(['special_requests' => trim($this->special_requests)]);
        }

        if ($this->has('transaction_id')) {
            $this->merge(['transaction_id' => trim($this->transaction_id)]);
        }

        //  Garantir valores padrão para campos opcionais
        $this->merge([
            'cleaning_fee' => $this->cleaning_fee ?? 0,
            'service_fee' => $this->service_fee ?? 0,
            'security_deposit' => $this->security_deposit ?? 0,
            'children' => $this->children ?? 0,
            'infants' => $this->infants ?? 0,
        ]);
    }

    /**
     * Dados validados com valores padrão
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        //  ADICIONAR campos calculados/com padrão
        return array_merge([
            'user_id' => Auth::id(), //  SEGURO: Sempre do usuário autenticado
            'nights' => 0, //  Será calculado no DTO
            'subtotal' => 0, //  Será calculado no DTO
            'total_amount' => 0, //  Será calculado no DTO
            'amount_paid' => 0, //  Padrão: nada pago inicialmente
            'reservation_code' => null, //  Será gerado no Service
            'confirmed_at' => null, //  Só se status for confirmado
            'payment_date' => null, //  Só se pagamento for realizado
        ], $validated);
    }
}
