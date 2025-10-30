<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\DTOs\User\Auth\RegisterUserDto;
use App\Http\Controllers\Controller;
<<<<<<< HEAD
use App\Http\Resources\User\UserResource;
=======
use App\Http\Resources\UserResource;
>>>>>>> 99123030711e99cc5ec61294065f35c9aa1bf95a
use Illuminate\Support\Facades\Auth;
use App\DTOs\User\Auth\AuthenticateUserDto;
use App\Actions\Auth\LogoutUserAction;
use App\Actions\Auth\RegisterUserAction;
use App\Actions\Auth\AuthenticateUserAction;
use App\Http\Requests\Users\Auth\LoginUserRequest;
use App\Http\Requests\Users\Auth\RegisterUserRequest;
use App\Actions\Auth\GetAuthenticatedUserAction;
use Illuminate\Auth\Middleware\Authenticate;

class AuthController extends Controller
{
    public function __construct(
        protected RegisterUserAction $registerUserAction,
        protected AuthenticateUserAction $authenticateUserAction,
        protected LogoutUserAction $logoutUserAction,
        protected GetAuthenticatedUserAction $getAuthenticatedUserAction,
    ) {}

    /**
     * Register a new user and return authentication token
     *
     * @param RegisterUserRequest $request
     * @return JsonResponse
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        $dto = RegisterUserDto::fromRequest($request);

        $user = $this->registerUserAction->execute($dto);

        $authDto = new AuthenticateUserDto($user->email, $request->input('password'));

        $result = $this->authenticateUserAction->execute($authDto);

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
            'token_type' => $result['token_type'],
        ]);
    }

    //login and return token
    public function login(LoginUserRequest $request): JsonResponse
    {
        $dto = AuthenticateUserDto::fromRequest($request);

        $result = $this->authenticateUserAction->execute($dto);

        if (!$result) {
            return response()->json([
                'message' => 'auth.login.invalid_credentials'
            ], 401);
        }

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
            'token_type' => $result['token_type'],
            'message' => 'auth.login.success'
        ], 200);
    }

    //logout auth user
    public function logout(): JsonResponse
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
        $result = $this->getAuthenticatedUserAction->execute($request->user());

        return response()->json([
            'user' => new UserResource($result['user']),
            'statistics' => $result['statistics'],
            'permissions' => $result['permissions'],
        ], 200);
    }
}
