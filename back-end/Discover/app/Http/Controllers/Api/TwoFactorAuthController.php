<?php

namespace App\Http\Controllers\Api;

use Throwable;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\DTOs\Auth\TwoFactor\VerifyTwoFactorDto;
use App\DTOs\Auth\TwoFactor\DisableTwoFactorDto;
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
            $dto = new EnableTwoFactorDto($user);

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
                $user,
                $request->input('code')
            );

            $verified = $this->verifyTwoFactorCodeAction->execute($dto);

            return response()->json([
                'status' => $verified,
                'message' => $verified
                    ? __('auth.2fa.verified_success')
                    : __('auth.2fa.invalid_code'),
            ], $verified ? Response::HTTP_OK : Response::HTTP_UNAUTHORIZED);
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
            $dto = new DisableTwoFactorDto($user);

            $disabled = $this->disableTwoFactorAuthAction->execute($dto);

            return response()->json([
                'status' => $disabled,
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