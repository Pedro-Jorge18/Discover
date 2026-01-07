<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * Display a listing of active cities.
     */
    public function index(Request $request): JsonResponse
    {
        $query = City::where('active', true);

        // Filtrar por país se fornecido
        if ($request->has('country_id')) {
            $query->whereHas('state', function ($q) use ($request) {
                $q->where('country_id', $request->country_id);
            });
        }

        // Filtrar por estado se fornecido
        if ($request->has('state_id')) {
            $query->where('state_id', $request->state_id);
        }

        // Pesquisa por nome
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $cities = $query->orderBy('name')
            ->get(['id', 'name', 'state_id', 'latitude', 'longitude']);

        return response()->json([
            'data' => $cities,
            'total' => $cities->count()
        ]);
    }

    /**
     * Display the specified city.
     */
    public function show(City $city): JsonResponse
    {
        return response()->json([
            'data' => $city->load('state.country')
        ]);
    }
}
