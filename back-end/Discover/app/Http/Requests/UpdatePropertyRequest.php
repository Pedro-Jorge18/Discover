<?php

namespace App\Http\Requests;

use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Só donos da propiedade podem atualizar
       // $property = Property::find($this->route('property'));
       // return $property && $property->host_id === auth()->id();
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // INFORMAÇÕES BÁSICAS
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:10000',
            'summary' => 'sometimes|nullable|string|max:500',
            'price_per_night' => 'sometimes|numeric|min:1',

            // HOST E HORÁRIOS
            'host_id' => 'sometimes|integer|exists:users,id',
            'check_in_time' => 'sometimes|date_format:H:i',
            'check_out_time' => 'sometimes|date_format:H:i',

            // LOCALIZAÇÃO
            'address' => 'sometimes|string|max:255',
            'neighborhood' => 'sometimes|string|max:255',
            'postal_code' => 'sometimes|string|max:20',
            'city_id' => 'sometimes|integer|exists:cities,id',
            'latitude' => 'sometimes|nullable|numeric|min:-90|max:90',
            'longitude' => 'sometimes|nullable|numeric|min:-180|max:180',

            // CARACTERÍSTICAS DA PROPRIEDADE
            'property_type_id' => 'sometimes|integer|exists:property_types,id',
            'listing_type_id' => 'sometimes|integer|exists:listing_types,id',
            'max_guests' => 'sometimes|integer|min:1',
            'bedrooms' => 'sometimes|integer|min:0',
            'beds' => 'sometimes|integer|min:1',
            'bathrooms' => 'sometimes|integer|min:0',

            // TAXAS E CONFIGURAÇÕES
            'cleaning_fee' => 'sometimes|nullable|numeric|min:0',
            'service_fee' => 'sometimes|nullable|numeric|min:0',
            'security_deposit' => 'sometimes|nullable|numeric|min:0',
            'area' => 'sometimes|nullable|integer|min:0',
            'floor' => 'sometimes|nullable|integer|min:0',
            'min_nights' => 'sometimes|nullable|integer|min:1',
            'max_nights' => 'sometimes|nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'price_per_night.numeric' => 'The price per night must be greater than 0.',
            'max_guests.min' => 'The property must accommodate at least 1 guest.',
            'city_id.exists' => 'The selected city does not exist.',
            'property_type_id.exists' => 'The selected property type does not exist.',
            'listing_type_id.exists' => 'The selected listing type does not exist.',
            'host_id.exists' => 'The selected host does not exist.',
        ];
    }
}
