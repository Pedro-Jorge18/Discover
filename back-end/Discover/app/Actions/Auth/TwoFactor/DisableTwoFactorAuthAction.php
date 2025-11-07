<?php

namespace App\Actions\Auth\TwoFactor;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\DTOs\Auth\TwoFactor\DisableTwoFactorDto;

class DisableTwoFactorAuthAction
{
    public function execute(User $user, DisableTwoFactorDto $dto): bool
    {
        try {
            if (!$user->two_factor_enabled) {
                Log::info('Tentativa de desativar 2FA, mas já estava desativado', [
                    'user_id' => $user->id,
                ]);

                return false;
            }

            $user->update([
                'two_factor_secret' => null,
                'two_factor_enabled' => false,
                'two_factor_confirmed' => false,
                'two_factor_recovery_codes' => null,
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Erro ao desativar autenticação de dois fatores', [
                'user_id' => $user->id ?? null,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}