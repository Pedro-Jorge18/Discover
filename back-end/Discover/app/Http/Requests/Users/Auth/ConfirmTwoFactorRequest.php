<?php

namespace App\Http\Requests\Users\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class ConfirmTwoFactorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:6']
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'The authentication code is required.',
            'code.string' => 'The code must be a string.',
            'code.size' => 'The code must have exactly 6 digits.',
        ];
    }
}