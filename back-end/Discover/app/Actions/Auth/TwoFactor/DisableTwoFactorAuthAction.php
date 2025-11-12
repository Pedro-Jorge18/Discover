<?php

namespace App\Actions\Auth\TwoFactor;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\DTOs\User\Auth\TwoFactor\DisableTwoFactorDto;
use App\Services\TwoFactor\TwoFactorAuthService;

class DisableTwoFactorAuthAction
{
    public function __construct(
        protected TwoFactorAuthService $twoFactorAuthService,
    ) {}

    public function execute(DisableTwoFactorDto $dto): bool
    {
        try {

            $user = User::findOrFail($dto->userId);

            if (!$user->two_factor_enabled) {
                Log::info('Tentativa de desativar 2FA, mas já estava desativado', [
                    'user_id' => $user->id,
                ]);

                return false;
            }

            $this->twoFactorAuthService->disable($user);

            return true;
        } catch (\Throwable $e) {
            Log::error('Erro ao desativar autenticação de dois fatores', [
                'user_id' => $dto->userId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
