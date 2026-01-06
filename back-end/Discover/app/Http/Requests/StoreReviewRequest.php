<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Reservation;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Verifica se o usuário tem uma reserva válida para poder avaliar
        $reservation = Reservation::find($this->reservation_id);
        
        if (!$reservation) {
            return false;
        }

        // Verifica se é o usuário da reserva
        return $reservation->user_id === auth()->id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reservation_id' => 'required|exists:reservations,id',
            'property_id' => 'required|exists:properties,id',
            'rating_cleanliness' => 'required|integer|min:1|max:5',
            'rating_communication' => 'required|integer|min:1|max:5',
            'rating_checkin' => 'required|integer|min:1|max:5',
            'rating_accuracy' => 'required|integer|min:1|max:5',
            'rating_location' => 'required|integer|min:1|max:5',
            'rating_value' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:1000',
            'recommend' => 'boolean',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'reservation_id.required' => 'ID da reserva é obrigatório',
            'reservation_id.exists' => 'Reserva não encontrada',
            'property_id.required' => 'ID da propriedade é obrigatório',
            'property_id.exists' => 'Propriedade não encontrada',
            'rating_cleanliness.required' => 'Avaliação de limpeza é obrigatória',
            'rating_cleanliness.min' => 'Avaliação deve ser no mínimo 1',
            'rating_cleanliness.max' => 'Avaliação deve ser no máximo 5',
            'comment.required' => 'Comentário é obrigatório',
            'comment.min' => 'Comentário deve ter no mínimo 10 caracteres',
            'comment.max' => 'Comentário deve ter no máximo 1000 caracteres',
        ];
    }
}
