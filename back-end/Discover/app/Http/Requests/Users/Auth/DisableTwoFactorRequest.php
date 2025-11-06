<?php

namespace App\Http\Requests\Users\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class DisableTwoFactorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'digits:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'The verification code is required to disable two-factor authentication.',
            'code.digits' => 'The code must contain exactly 6 digits.',
        ];
    }
}