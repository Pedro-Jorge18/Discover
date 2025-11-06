<?php

namespace App\Http\Requests\Users\Auth;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class EnableTwoFactorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'password' => ['required', 'string', 'current_password'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.required' => 'A password is required to enable two-factor authentication.',
            'password.current_password' => 'The password entered is incorrect.',
        ];
    }
}