<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CheckAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        $today = now()->format('Y-m-d');
        $oneYearFromNow = now()->addYear()->format('Y-m-d');

        return [
            'check_in' => [
                'required',
                'date',
                'date_format:Y-m-d',
                'after_or_equal:' . $today,
                'before:' . $oneYearFromNow,
            ],
            'check_out' => [
                'required',
                'date',
                'date_format:Y-m-d',
                'after:check_in',
            ],
            'adults' => [
                'required',
                'integer',
                'min:1',
                'max:10',
            ],
            'children' => [
                'integer',
                'min:0',
                'max:8',
            ],
            'infants' => [
                'integer',
                'min:0',
                'max:4',
            ],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'children' => $this->children ?? 0,
            'infants' => $this->infants ?? 0,
        ]);
    }
}
