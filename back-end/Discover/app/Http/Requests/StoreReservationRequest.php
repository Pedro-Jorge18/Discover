<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }
    public function rules(): array
{
    return [
        'property_id' => 'required|integer',
        'check_in'    => 'required|date',
        'check_out'   => 'required|date|after:check_in',
        'adults'      => 'required|integer|min:1',
        'children'    => 'nullable|integer|min:0',
        'infants'     => 'nullable|integer|min:0',
        'total_amount' => 'required|numeric',
        'nights'      => 'nullable|integer|min:1'
    ];
}

    public function messages(): array
    {
        return [
            // Propriedade
            'property_id.required' => 'Property ID is required.',
            'property_id.exists' => 'Selected property does not exist.',

            // Datas
            'check_in.required' => 'Check-in date is required.',
            'check_in.after_or_equal' => 'Check-in date cannot be in the past.',
            'check_in.before' => 'Reservations cannot be made more than 1 year in advance.',
            'check_out.required' => 'Check-out date is required.',
            'check_out.after' => 'Check-out date must be after check-in date.',

            // Hóspedes
            'adults.required' => 'Number of adults is required.',
            'adults.min' => 'At least 1 adult is required.',
            'adults.max' => 'Maximum 10 adults allowed.',
            'children.required' => 'Number of children is required.',
            'children.min' => 'Number of children cannot be negative.',
            'children.max' => 'Maximum 8 children allowed.',
            'infants.required' => 'Number of infants is required.',
            'infants.min' => 'Number of infants cannot be negative.',
            'infants.max' => 'Maximum 4 infants allowed.',

            // Especiais
            'special_requests.max' => 'Special requests cannot exceed 1000 characters.',

            // Pagamento
            'payment_method.in' => 'Invalid payment method.',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'children' => $this->children ?? 0,
            'infants' => $this->infants ?? 0,
            'special_requests' => $this->special_requests ? trim($this->special_requests) : null,
        ]);
    }
}
