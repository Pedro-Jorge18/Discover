<?php

namespace App\Actions\Auth\TwoFactor;

use App\Models\User;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\AuthenticationException;
use App\DTOs\Auth\TwoFactor\VerifyTwoFactorDto;

class VerifyTwoFactorCodeAction
{
    public function __construct(
        protected Google2FA $google2FA
    ) {}

    public function execute(User $user, VerifyTwoFactorDto $dto): bool
    {
        try {
            //check if the user has the 2FA key
            if (empty($user->two_factor_secret)) {
                throw new AuthenticationException(__('two_factor.missing_secret'));
            }

            //decrypt the key
            $secret = decrypt($user->two_factor_secret);

            //validate the code send by user
            $isValid = $this->google2FA->verifyKey($secret, $dto->code);

            if (!$isValid) {
                Log::warning('Código 2FA inválido', [
                    'user_id' => $user->id,
                    'code' => $dto->code,
                ]);

                throw new AuthenticationException(__('two_factor.invalid_code'));
            }

            //check 2FA active
            $user->update([
                'two_factor_confirmed' => true,
                'two_factor_enabled' => true,
            ]);

            Log::info('Autenticação de dois fatores ativada com sucesso', [
                'user_id' => $user->id,
            ]);

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