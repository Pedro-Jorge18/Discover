<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Contracts\Validation\Validator;
trait ValidatesAmenities
{
    protected function amenityRules(): array
    {
        return [

            'amenities' => 'nullable|array',
            'amenities.*.id' => 'required|exists:amenities,id',
            'amenities.*.value_boolean' => 'nullable|boolean',
            'amenities.*.value_numeric' => 'nullable|numeric|min:0',
            'amenities.*.value_text' => 'nullable|string|max:255',
        ];
    }

    protected function amenityMessages(): array
    {
        return [

            'amenities.array' => 'Amenities must be an array.',
            'amenities.*.id.required' => 'Each amenity must have an ID.',
            'amenities.*.id.exists' => 'One or more selected amenities are invalid.',
            'amenities.*.value_boolean.boolean' => 'Boolean value must be true or false.',
            'amenities.*.value_numeric.numeric' => 'Numeric value must be a number.',
            'amenities.*.value_numeric.min' => 'Numeric value cannot be negative.',
            'amenities.*.value_text.string' => 'Text value must be a string.',
            'amenities.*.value_text.max' => 'Text value cannot exceed 255 characters.',
        ];
    }

    protected function prepareAmenitiesForValidation(): void
    {

        if ($this->has('amenities') && empty($this->amenities)) {
            $this->merge(['amenities' => null]);
        }

        // Se existem, limpa os dados
        if ($this->has('amenities') && !empty($this->amenities)) {
            $amenities = $this->amenities;

            foreach ($amenities as &$amenity) {
                if (isset($amenity['value_text'])) {
                    $amenity['value_text'] = trim($amenity['value_text']);
                }
            }

            $this->merge(['amenities' => $amenities]);
        }
    }

    protected function validateAmenityValues(Validator $validator): void
    {

        if ($this->has('amenities') && !empty($this->amenities)) {

            foreach ($this->amenities as $index => $amenity) {

                // must have at least one value
                $hasValue = isset($amenity['value_boolean']) ||
                    isset($amenity['value_numeric']) ||
                    (isset($amenity['value_text']) &&
                        trim($amenity['value_text']) !== '');


                if (!$hasValue) {
                    $validator->errors()->add(

                        "amenities.{$index}.value_boolean",

                        "At least one value field must be provided for amenity at position " . ($index + 1) . "."
                    );
                }
            }
        }
    }

}
