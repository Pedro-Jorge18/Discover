<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Actions\Users\Auth\RegisterUserAction;
use App\Actions\Users\Auth\AuthenticateUserAction;
use App\Actions\Users\Auth\LogoutUserAction;
use App\Actions\Users\Auth\GetAuthenticatedUserAction;
use App\DTOs\Auth\RegisterUserDto;
use App\DTOs\Auth\AuthenticateUserDto;
use App\Http\Requests\Users\Auth\RegisterUserRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected RegisterUserAction $registerUserAction,
        protected AuthenticateUserAction $authenticateUserAction,
        protected LogoutUserAction $logoutUserAction,
        protected GetAuthenticatedUserAction $getAuthenticatedUserAction,
    ) {}

    //register new user
    public function register(RegisterUserRequest $request): JsonResponse
    {
        $dto = RegisterUserDto::fromArray($request->validated());

        $user = $this->registerUserAction->execute($dto);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    //login and return token
    public function login(LoginRequest $request): JsonResponse
    {
        $dto = AuthenticateUserDto::fromArray($request->validated());

        $result = $this->authenticateUserAction->execute($dto);

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
            'token_type' => $result['token_type'],
        ], 200);
    }

    //logout auth user
    public function logout(Request $request): JsonResponse
    {
        $user = Auth::user();

        $success = $this->logoutUserAction->execute($user);

        return response()->json([
            'success' => $success,
            'message' => $success
                ? __('auth.logout.success')
                : __('auth.logout.failed'),
        ], $success ? 200 : 400);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUserAction->execute($request->user());

        return response()->json([
            'user' => new UserResource($user),
        ], 200);
    }

}
