<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesAmenities;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Auth;

class StorePropertyRequest extends FormRequest
{
    use ValidatesAmenities;
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
        return array_merge(
            [
                //informações iniciais ( OBRIGATORIAS )

                'title' =>  'required|string|max:255',
                'description' => 'required|string|max:10000',
                'summary' => 'required|string|max:255',
                'price_per_night' => 'required|numeric|min:1',

                'host_id' => 'required|integer|exists:users,id',
                'check_in_time' => 'required|date_format: Ymd H:i :s',
                'check_out_time' => 'required|date_format: Ymd H:i :s',

                // LOCALIZAÇÃO
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

            ],
                $this->amenityRyles(),
        );
    }



    public function messages(): array
    {
        return array_merge(
            [
                // mensagens de acompanhamento
                  'title.required' => 'It has to have a title.',
                  'description.required' => 'It has to have a description.',
                  'summary.required' => 'It has to have a summary.',
                  'price_per_night.required' => 'The price per night is mandatory.',
                  'host_id.required' => 'It has to have a host.',
                  'check_in_time.required' => 'It has to have a Check In Time.',
                  'check_out_time.required' => 'It has to have a Check Out Time.',
                  'address.required' => 'Address is required.',
                  'neighborhood.required' => 'Neighborhood is required.',
                  'postal_code.required' => 'Postal code is required.',
                  'city_id.required' => 'City is required.',
                  'property_type_id.required' => 'Property Type is required.',
                  'listing_type_id.required' => 'Listing Type is required.',
                  'max_guests.required' => 'Maximum number of guests is required.',
                  'bedrooms.required' => 'Number of bedrooms is required.',
                  'beds.required' => 'Number of beds is required.',
                  'bathrooms.required' => 'Number of bathrooms is required.',

            ],
            $this->amenityMessages(),
        );

    }
     protected function prepareForValidation()
     {
         $this->prepareAmenitiesForValidation();
     }

    public function withValidator($validator)
    {

        $validator->after(function ($validator) {

            $this->validateAmenityValues($validator);

        });
    }

    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        return array_merge([
            'cleaning_fee' => 0,
            'service_fee' => 0,
            'security_deposit' => 0,
            'area' => null,
            'floor' => null,
            'min_nights' => 1,
            'max_nights' => 30,
            'amenities' => [],
        ], $validated);
    }
}
