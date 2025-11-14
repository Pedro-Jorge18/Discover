<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderPropertyImageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        return [
            'order' => 'required|array|min:1',
            'order.*' => 'integer|exists:property_images,id'
        ];
    }
}
