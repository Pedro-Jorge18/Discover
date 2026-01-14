<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Reservation;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     * Pode filtrar por property_id ou user_id
     */
    public function index(Request $request): JsonResponse
    {
        $query = Review::with(['user', 'property', 'reservation'])
            ->published();

        // Filtrar por propriedade
        if ($request->has('property_id')) {
            $query->where('property_id', $request->property_id);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Ordenar por mais recentes
        $reviews = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return response()->json($reviews);
    }

    /**
     * Store a newly created review.
     */
    public function store(StoreReviewRequest $request): JsonResponse
    {
        // Check if review already exists for this reservation (only if reservation_id is not null)
        if ($request->reservation_id) {
            $existingReview = Review::where('reservation_id', $request->reservation_id)->first();
            
            if ($existingReview) {
                return response()->json([
                    'message' => 'Já existe uma avaliação para esta reserva'
                ], 422);
            }
        }

        // Calcula a nota geral
        $overallRating = round(($request->rating_cleanliness + 
                               $request->rating_communication + 
                               $request->rating_checkin + 
                               $request->rating_accuracy + 
                               $request->rating_location + 
                               $request->rating_value) / 6);

        // Cria a review
        $review = Review::create([
            'property_id' => $request->property_id,
            'user_id' => auth()->id(),
            'reservation_id' => $request->reservation_id,
            'rating_cleanliness' => $request->rating_cleanliness,
            'rating_communication' => $request->rating_communication,
            'rating_checkin' => $request->rating_checkin,
            'rating_accuracy' => $request->rating_accuracy,
            'rating_location' => $request->rating_location,
            'rating_value' => $request->rating_value,
            'rating_overall' => $overallRating,
            'comment' => $request->comment,
            'recommend' => $request->recommend ?? true,
            'published' => true,
        ]);

        // Carrega os relacionamentos
        $review->load(['user', 'property', 'reservation']);

        return response()->json([
            'message' => 'Avaliação criada com sucesso',
            'review' => $review
        ], 201);
    }

    /**
     * Display the specified review.
     */
    public function show(Review $review): JsonResponse
    {
        $review->load(['user', 'property', 'reservation']);
        
        return response()->json($review);
    }

    /**
     * Update the specified review.
     */
    public function update(UpdateReviewRequest $request, Review $review): JsonResponse
    {
        // If it's the review owner, can update ratings and comment
        if ($review->user_id === auth()->id()) {
            $updateData = $request->only([
                'rating_cleanliness',
                'rating_communication',
                'rating_checkin',
                'rating_accuracy',
                'rating_location',
                'rating_value',
                'comment',
                'recommend',
                'published'
            ]);

            // Recalcula a nota geral se algum rating foi alterado
            if ($request->hasAny([
                'rating_cleanliness', 
                'rating_communication', 
                'rating_checkin',
                'rating_accuracy', 
                'rating_location', 
                'rating_value'
            ])) {
                $updateData['rating_overall'] = $review->calculateOverallRating();
            }

            $review->update($updateData);
        }

        // Se for o host da propriedade, pode adicionar resposta
        if ($review->property->user_id === auth()->id() && $request->has('host_reply')) {
            $review->reply($request->host_reply);
        }

        $review->load(['user', 'property', 'reservation']);

        return response()->json([
            'message' => 'Avaliação atualizada com sucesso',
            'review' => $review
        ]);
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review): JsonResponse
    {
        $user = auth()->user();
        
        // Permite apagar se for:
        // 1. O dono da review
        // 2. Admin
        // 3. Host da propriedade
        if ($review->user_id !== $user->id && 
            $user->role !== 'admin' && 
            $review->property->host_id !== $user->id) {
            return response()->json([
                'message' => 'Você não tem permissão para deletar esta avaliação'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Avaliação deletada com sucesso'
        ]);
    }

    /**
     * Get reviews for a specific property
     */
    public function propertyReviews(Request $request, $propertyId): JsonResponse
    {
        $reviews = Review::with(['user', 'reservation'])
            ->where('property_id', $propertyId)
            ->published()
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        // Calculate statistics
        $stats = Review::where('property_id', $propertyId)
            ->published()
            ->selectRaw('
                AVG(rating_overall) as average_rating,
                AVG(rating_cleanliness) as avg_cleanliness,
                AVG(rating_communication) as avg_communication,
                AVG(rating_checkin) as avg_checkin,
                AVG(rating_accuracy) as avg_accuracy,
                AVG(rating_location) as avg_location,
                AVG(rating_value) as avg_value,
                COUNT(*) as total_reviews,
                ROUND(SUM(CASE WHEN recommend = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100) as recommend_percentage
            ')
            ->first();

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats
        ]);
    }

    /**
     * Get reviews by user (reviews que o usuário fez)
     */
    public function userReviews(Request $request): JsonResponse
    {
        $reviews = Review::with(['property', 'reservation'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return response()->json($reviews);
    }

    /**
     * Check if user can review a reservation
     */
    public function canReview($reservationId): JsonResponse
    {
        $reservation = Reservation::find($reservationId);

        if (!$reservation) {
            return response()->json([
                'can_review' => false,
                'message' => 'Reserva não encontrada'
            ], 404);
        }

        // Check if it's the reservation user
        if ($reservation->user_id !== auth()->id()) {
            return response()->json([
                'can_review' => false,
                'message' => 'Você não tem permissão para avaliar esta reserva'
            ], 403);
        }

        // Check if review already exists
        $existingReview = Review::where('reservation_id', $reservationId)->first();
        
        if ($existingReview) {
            return response()->json([
                'can_review' => false,
                'message' => 'Já existe uma avaliação para esta reserva',
                'review' => $existingReview
            ]);
        }

        // Here you can add more validations, like checking if reservation is already completed
        // Por exemplo: $reservation->status === 'completed' && $reservation->checkout_date < now()

        return response()->json([
            'can_review' => true,
            'message' => 'Você pode avaliar esta reserva',
            'reservation' => $reservation
        ]);
    }
}
