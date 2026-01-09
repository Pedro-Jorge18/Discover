<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Actions\Profile\DeleteUserAction;
use App\Actions\Profile\UpdateUserAction;
use App\DTOs\User\Profile\UpdateUserDto;
use App\Http\Resources\User\UserResource;
use App\Http\Requests\Users\Profile\UpdateProfileRequest;

class ProfileController extends Controller
{
    public function __construct(
        protected UpdateUserAction $updateUserAction,
        protected DeleteUserAction $deleteUserAction,
    ) {}

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = Auth::user();
        $dto = UpdateUserDto::fromRequest($request);

        $updatedUser = $this->updateUserAction->execute($user, $dto);

        return response()->json([
            'user' => new UserResource($updatedUser),
            'message' => 'user.update.success'
        ])->header('Access-Control-Allow-Origin', 'http://localhost:5173')
          ->header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
          ->header('Access-Control-Allow-Credentials', 'true');
    }

    public function destroy(): JsonResponse
    {
        $user = Auth::user();

        $this->deleteUserAction->execute($user);

        return response()->json([
            'message' => 'user.delete.success'
        ]);
    }
}