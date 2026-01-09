<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\CheckAvailabilityRequest;
use App\Http\Resources\Reservation\ReservationResource;
use App\Http\Resources\Reservation\ReservationCollection;
use App\Http\Resources\Reservation\AvailabilityResource;
use App\Models\Property;
use App\Models\Reservation;
use App\Services\Reservation\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    public function __construct(
        private ReservationService $reservationService
    ) {}

    /**
     * Lista todas as reservas do usuário
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'upcoming', 'past', 'current']);
            $reservations = $this->reservationService->getUserReservations(auth()->id(), $filters);

            return response()->json([
                'success' => true,
                'data' => new ReservationCollection($reservations)
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching user reservations', [
                'user_id' => auth()->id(),
                'filters' => $filters,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching reservations'
            ], 500);
        }
    }

    /**
     * Lista reservas das propriedades do host autenticado
     */
    public function hostReservations(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status']);
            $reservations = $this->reservationService->getHostReservations(auth()->id(), $filters);

            return response()->json([
                'success' => true,
                'data' => new ReservationCollection($reservations)
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching host reservations', [
                'user_id' => auth()->id(),
                'filters' => $filters ?? [],
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching reservations'
            ], 500);
        }
    }

    /**
     * Cria uma nova reserva
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        try {
            $reservation = $this->reservationService->createReservation(
                $request->validated(),
                auth()->id()
            );

            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully',
                'data' => new ReservationResource($reservation)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Cria reserva com pagamento instantâneo
     */
    public function storeWithPayment(StoreReservationRequest $request): JsonResponse
    {
        try {
            Log::info('StoreWithPayment called', [
                'user_id' => auth()->id(),
                'is_authenticated' => auth()->check(),
                'request_data' => $request->all()
            ]);

            $reservation = $this->reservationService->createReservationWithPayment(
                $request->validated(),
                auth()->id(),
                $request->input('payment_method')
            );

            return response()->json([
                'success' => true,
                'message' => 'Reservation created and paid successfully',
                'data' => new ReservationResource($reservation)
            ], 201);

        } catch (\Exception $e) {
            Log::error('Reservation creation with payment failed', [
                'user_id' => auth()->id(),
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Mostra uma reserva específica
     */
    public function show(int $id): JsonResponse
    {
        try {
            $reservation = $this->reservationService->findUserReservation($id, auth()->id());

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservation not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new ReservationResource($reservation)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching reservation'
            ], 500);
        }
    }

    /**
     * Cancela uma reserva
     */
    public function destroy(int $id, Request $request): JsonResponse
    {
        try {
            $reservation = $this->reservationService->cancelReservation(
                $id,
                auth()->id(),
                $request->input('cancellation_reason')
            );

            return response()->json([
                'success' => true,
                'message' => 'Reservation cancelled successfully',
                'data' => new ReservationResource($reservation)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Verifica disponibilidade de uma propriedade
     */
    public function checkAvailability(CheckAvailabilityRequest $request, int $propertyId): JsonResponse
    {
        try {
            $result = $this->reservationService->checkPropertyAvailability(
                $propertyId,
                $request->check_in,
                $request->check_out,
                $request->adults,
                $request->children,
                $request->infants
            );

            return response()->json([
                'success' => true,
                'available' => $result['available'],
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error checking availability'
            ], 500);
        }
    }

    /**
     * Lista reservas de uma propriedade (para hosts)
     */
    public function propertyReservations(Request $request, int $propertyId): JsonResponse
    {
        try {
            $property = Property::findOrFail($propertyId);

            if (auth()->id() !== $property->host_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. You are not the host of this property.'
                ], 403);
            }

            $filters = $request->only(['status', 'from_date', 'to_date']);
            $reservations = $this->reservationService->getPropertyReservations($propertyId, $filters);

            return response()->json([
                'success' => true,
                'data' => new ReservationCollection($reservations)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching property reservations'
            ], 500);
        }
    }

    /**
     * Confirma uma reserva (apenas hosts)
     */
    public function confirm(int $id): JsonResponse
    {
        try {
            $reservation = Reservation::findOrFail($id);

            if (auth()->id() !== $reservation->property->host_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. You are not the host of this property.'
                ], 403);
            }
            $reservation = $this->reservationService->confirmReservation($id);

            return response()->json([
                'success' => true,
                'message' => 'Reservation confirmed successfully',
                'data' => new ReservationResource($reservation)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Estatísticas de reservas
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = $this->reservationService->getReservationStats(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching stats'
            ], 500);
        }
    }

    /**
     * Verifica disponibilidade em lote
     */
    public function checkMultipleAvailability(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'property_ids' => 'required|array',
                'property_ids.*' => 'integer|exists:properties,id',
                'check_in' => 'required|date',
                'check_out' => 'required|date|after:check_in',
                'adults' => 'required|integer|min:1'
            ]);

            $results = $this->reservationService->checkMultiplePropertiesAvailability(
                $request->property_ids,
                $request->check_in,
                $request->check_out,
                $request->adults
            );

            return response()->json([
                'success' => true,
                'data' => $results
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error checking multiple availability'
            ], 500);
        }
    }
}
