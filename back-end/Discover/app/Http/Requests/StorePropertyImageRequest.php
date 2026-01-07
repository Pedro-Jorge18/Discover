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
        $imageCount = count($this->images ?? []);
        return [
            'images' => 'required|array|min:1|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'primary_index' => 'sometimes|integer|min:0|max:' . ($imageCount > 0 ? $imageCount -1 : 0),
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
            'images.*.mimes' => 'Only JPEG, PNG, JPG and WebP formats are allowed.',
            'images.*.max' => 'Each image must be smaller than 2MB. Please compress your images.',

        ];
    }
}
