<?php

namespace App\Actions\Auth\TwoFactor;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\DTOs\User\Auth\TwoFactor\VerifyTwoFactorDto;
use App\Services\TwoFactor\TwoFactorAuthService;
use Illuminate\Auth\Access\AuthorizationException;

class VerifyTwoFactorCodeAction
{
    public function __construct(
        protected TwoFactorAuthService $twoFactorAuthService
    ) {}

    public function execute(VerifyTwoFactorDto $dto): bool
    {
        try {
            $user = $dto->userId ? User::find($dto->userId) : Auth::user();

            if (!$user) {
                throw new AuthorizationException(__('auth.unauthenticated'));
            }

            $isValid = $this->twoFactorAuthService->verify($user, $dto->code);

            if (!$isValid) {
                throw ValidationException::withMessages([
                    'code' => [__('auth.2fa.invalid_code')],
                ]);
            }

            return true;
        } catch (\Throwable $e) {
            Log::error('Erro ao verificar código 2FA', [
                'user_id' => $user->id ?? null,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
