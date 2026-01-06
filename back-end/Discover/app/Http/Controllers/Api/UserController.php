<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * List all users with roles 'guest' or 'host' (admin only)
     */
    public function index(Request $request)
    {
        // Only admins can list users
        if ($request->user()->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $users = User::whereIn('role', ['guest', 'host'])
            ->select('id', 'name', 'last_name', 'email', 'role', 'created_at')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $users
        ]);
    }

    /**
     * Delete a user (admin only)
     */
    public function destroy(Request $request, $id)
    {
        // Only admins can delete users
        if ($request->user()->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Utilizador não encontrado.'], 404);
        }

        // Prevent deleting admin users
        if ($user->role === 'admin') {
            return response()->json(['error' => 'Não é permitido apagar utilizadores admin.'], 403);
        }

        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'Utilizador apagado com sucesso.'
        ]);
    }
}
