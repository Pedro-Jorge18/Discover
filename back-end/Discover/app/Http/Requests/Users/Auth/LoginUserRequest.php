<?php

namespace App\Http\Requests\Users\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest
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
            'email' => 'required|email',
            'password' => 'required|string',
            'remember_me' => 'sometimes|boolean',
        ];
    }

    protected function prepareForValidationLoginUser(): void
    {
        $this->merge([
            'email' => strtolower(trim($this->email)),
            'remember_me' => $this->boolean('remember_me'),
        ]);
    }
}