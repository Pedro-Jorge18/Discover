<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            //informações iniciais ( OBRIGATORIAS )

            'title' => 'required|string|max:255',
            'description' => 'required|string|max:10000',
            'summary' => 'required|string|max:255',
            'price_per_night' => 'required|numeric|min:1',

            // lOCALIZÇÃO
            'address' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'postal_code' => 'required|string|max:25',
            'city_id' => 'required|integer|exists:cities,id',
            'latitude' => 'required|numeric|min:-90|max:90',
            'longitude' => 'required|numeric|min:-180|max:180',

            //CARACTERISTICAS
            'property_type_id' => 'required|integer|exists:property_types,id',
            'listing_type_id' => 'required|integer|exists:listing_types,id',
            'max_guests' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:0',
            'beds' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:0',

            //CONFIGURAÇÃO
            'cleaning_fee' => 'sometimes|nullable|numeric|min:0',
            'service_fee' => 'sometimes|nullable|numeric|min:0',
            'security_deposit' => 'sometimes|nullable|numeric|min:0',
            'area' => 'sometimes|nullable|numeric|min:0',
            'floor' => 'sometimes|nullable|numeric|min:0',
            'min_nights' => 'sometimes|nullable|numeric|min:1',
            'max_nights' => 'sometimes|nullable|numeric|min:1',

        ];
    }



    public function messages(): array
    {
        return [
               //messagens de obrigação
              'title.required' => 'It has to have a title.',
              'description.required' => 'It has to have a description.',
              'summary.required' => 'It has to have a summary.',
              'price_per_night.required' => 'The minimum allowed is one nigh.',
              'address.required' => 'Address is required',
              'neighborhood.required' => 'Neighborhood is required',
              'postal_code.required' => 'Postal code is required',
              'city_id.required' => 'City is required',
              'property_type_id.required' => 'Property Type is required',
              'listing_type_id.required' => 'Listing Type is required',
              'max_guests.required' => 'Maximum number of guests is required',
              'bedrooms.required' => 'Number of bedrooms is required',
              'beds.required' => 'Number of bedrooms is required',
              'bathrooms.required' => 'Number of bathrooms is required',
        ];
    }
}
