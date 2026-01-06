<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Verifica se é o dono da review ou o host da propriedade (para reply)
        $review = $this->route('review');
        
        return $review->user_id === auth()->id() || 
               $review->property->user_id === auth()->id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rating_cleanliness' => 'sometimes|integer|min:1|max:5',
            'rating_communication' => 'sometimes|integer|min:1|max:5',
            'rating_checkin' => 'sometimes|integer|min:1|max:5',
            'rating_accuracy' => 'sometimes|integer|min:1|max:5',
            'rating_location' => 'sometimes|integer|min:1|max:5',
            'rating_value' => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string|min:10|max:1000',
            'recommend' => 'sometimes|boolean',
            'host_reply' => 'sometimes|string|max:500',
            'published' => 'sometimes|boolean',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'comment.min' => 'Comentário deve ter no mínimo 10 caracteres',
            'comment.max' => 'Comentário deve ter no máximo 1000 caracteres',
            'host_reply.max' => 'Resposta do host deve ter no máximo 500 caracteres',
        ];
    }
}
