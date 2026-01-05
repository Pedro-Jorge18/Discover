<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\DTOs\User\Auth\RegisterUserDto;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use Illuminate\Support\Facades\Auth;
use App\DTOs\User\Auth\AuthenticateUserDto;
use App\Actions\Auth\LogoutUserAction;
use App\Actions\Auth\RegisterUserAction;
use App\Actions\Auth\AuthenticateUserAction;
use App\Http\Requests\Users\Auth\LoginUserRequest;
use App\Http\Requests\Users\Auth\RegisterUserRequest;
use App\Actions\Auth\GetAuthenticatedUserAction;
use App\Http\Requests\Users\Profile\ChangePasswordRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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

    $user = $result['user'];

    if ($user->two_factor_enabled) {
        $tempToken = $user->createToken('2fa-temp')->plainTextToken; // usar Laravel Sanctum
        return response()->json([
            'two_factor_required' => true,
            'temp_token' => $tempToken,
            'user' => new UserResource($user),
            'message' => '2FA required'
        ], 200);
    }

    return response()->json([
        'user' => new UserResource($user),
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

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        // The ChangePasswordRequest already validates current_password via the rule
        $user->password = Hash::make($request->validated('password'));
        $user->save();

        // Revoke existing tokens for security
        if (method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        }

        Log::info('User changed password', ['user_id' => $user->id]);

        return response()->json([
            'message' => __('passwords.changed'),
        ], 200);
    }
}