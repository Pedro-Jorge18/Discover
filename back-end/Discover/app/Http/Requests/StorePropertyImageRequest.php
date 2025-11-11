<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyImageRequest extends FormRequest
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
            'images' => 'required|array|min:1|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120',
            'primary_index' => 'sometimes|integer|min:0',
            'captions' => 'sometimes|array',
            'captions.*' => 'sometimes|string|max:255',
            'alt_texts' => 'sometimes|array',
            'alt_texts.*' => 'sometimes|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'images.required' => 'At least one image is required.',
            'images.*.image' => 'Each file must be a valid image.',
            'images.*.mimes' => 'Only JPEG, PNG, and JPG formats are allowed',
            'images.*.max' => 'Max file size is 5MB.',

        ];
    }
}
