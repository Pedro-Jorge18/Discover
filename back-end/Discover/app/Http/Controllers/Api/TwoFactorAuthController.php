<?php

namespace App\Http\Controllers\Api;

use Throwable;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\DTOs\User\Auth\TwoFactor\VerifyTwoFactorDto;
use App\DTOs\User\Auth\TwoFactor\DisableTwoFactorDto;
use App\DTOs\User\Auth\TwoFactor\EnableTwoFactorDto;
use App\Http\Requests\Users\Auth\EnableTwoFactorRequest;
use App\Http\Requests\Users\Auth\VerifyTwoFactorRequest;
use App\Actions\Auth\TwoFactor\EnableTwoFactorAuthAction;
use App\Actions\Auth\TwoFactor\VerifyTwoFactorCodeAction;
use App\Http\Requests\Users\Auth\DisableTwoFactorRequest;
use App\Actions\Auth\TwoFactor\DisableTwoFactorAuthAction;

class TwoFactorAuthController extends Controller
{
    public function __construct(
        protected EnableTwoFactorAuthAction $enableTwoFactorAuthAction,
        protected DisableTwoFactorAuthAction $disableTwoFactorAuthAction,
        protected VerifyTwoFactorCodeAction $verifyTwoFactorCodeAction,
    ) {}

    //enables two-factor authentication
    public function enable(EnableTwoFactorRequest $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $dto = new EnableTwoFactorDto($user->id);

            $data = $this->enableTwoFactorAuthAction->execute($dto);

            return response()->json([
                'status' => true,
                'message' => __('auth.2fa.enabled_success'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => __('auth.2fa.enable_failed'),
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    //check the 2FA code provided by the user
    public function verify(VerifyTwoFactorRequest $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $dto = new VerifyTwoFactorDto(
                $user->id,
                $request->input('code')
            );

            $verified = $this->verifyTwoFactorCodeAction->execute($dto);

            if (!$verified) {
                return response()->json([
                    'status' => false,
                    'message' => __('auth.2fa.invalid_code'),
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Gerar token JWT definitivo
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => __('auth.2fa.verified_success'),
                'token' => $token,
                'user' => $user,
            ], Response::HTTP_OK);

        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => __('auth.2fa.verify_failed'),
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    //disable two-factor authentication
    public function disable(DisableTwoFactorRequest $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $dto = new DisableTwoFactorDto($user->id, $request->input('code'));

            $disabled = $this->disableTwoFactorAuthAction->execute($dto);

            if (!$disabled) {
                return response()->json([
                    'status' => false,
                    'message' => __('auth.2fa.invalid_code'),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            return response()->json([
                'status' => true,
                'message' => __('auth.2fa.disabled_success'),
            ], Response::HTTP_OK);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => __('auth.2fa.disable_failed'),
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
