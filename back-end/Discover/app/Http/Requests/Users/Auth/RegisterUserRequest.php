<?php

namespace App\Http\Requests\Users\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //permited everyone register
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {


        return [
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:users',
            'birthday' => 'required|date|before:today|after:1900-01-01',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'gender' => 'nullable|in:M,F,O',
            'language' => 'sometimes|in:pt,en,es',
            'about' => 'nullable|string|max:500',
        ];
    }

    protected function prepareForValidationRegisterUser(): void
    {
        $this->merge([
            'email' => strtolower(trim($this->email)),
            'name' => trim($this->name),
            'last_name' => trim($this->last_name),
            'phone' => preg_replace('/[^0-9]', '',$this->phone),
        ]);
    }
}
