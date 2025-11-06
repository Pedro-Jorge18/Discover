<?php

namespace App\Http\Controllers\Api;

use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Actions\Auth\ResetPasswordAction;
use App\DTOs\User\Auth\RequestPasswordResetDto;
use App\Actions\Auth\RequestPasswordResetAction;
use App\DTOs\User\Auth\ResetPasswordDto;
use App\Http\Requests\Users\Auth\ForgotPasswordRequest;
use App\Http\Requests\Users\Auth\ResetPasswordRequest;

class PasswordResetController extends Controller
{
    public function __construct(
        protected RequestPasswordResetAction $requestPasswordResetAction,
        protected ResetPasswordAction $resetPasswordAction,
    ) {}

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $dto = new RequestPasswordResetDto(
                email: $request->validated('email'),
            );

            $this->requestPasswordResetAction->execute($dto->email);

            return response()->json([
                'message' => __('passwords.sent'),
            ], 200);
        } catch (Throwable $e) {
            Log::error('Erro ao solicitar redefinição de senha', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => __('auth.password_reset_failed'),
            ], 500);
        }
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $dto = new ResetPasswordDto(
                email: $request->validated('email'),
                token: $request->validated('token'),
                password: $request->validated('password'),
                password_confirmation: $request->validated('password_confirmation'),
            );

            $result = $this->resetPasswordAction->execute($dto);

            return response()->json([
                'message' => $result['message'],
            ], 200);
        } catch (Throwable $e) {
            Log::error('Erro ao redefinir senha', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return response()->json([
            'message' => __('auth.password_reset_failed'),
        ], 500);
    }
}
