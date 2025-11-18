<?php

namespace App\Services\TwoFactor;

use App\Models\User;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Log;
use App\ValueObjects\TwoFactor\TwoFactorSecret;
use App\Repositories\Eloquent\TwoFactorRepository;

class TwoFactorAuthService
{
    public function __construct(
        protected Google2FA $google2FA,
        protected TwoFactorRepository $repository
    ) {}

    //generates and stores the secret for the user
    public function enable(User $user): TwoFactorSecret
    {
        try {
            $secret = $this->google2FA->generateSecretKey();

            $twoFactorSecret = new TwoFactorSecret($secret, $this->google2FA);

            $this->repository->storeSecret($user, $twoFactorSecret);

            return $twoFactorSecret;
        } catch (\Throwable $e) {
            Log::error('Erro ao habilitar autenticação 2FA', [
                'user_id' => $user->id ?? null,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    //check the code provided
    public function verify(User $user, string $code): bool
    {
        $secret = $this->repository->getSecret($user);

        if (!$secret) {
            return false;
        }

        return $this->google2FA->verifyKey($secret, $code);
    }

    //disable the 2FA and remove the user secret
    public function disable(User $user): void
    {
        try {
            $this->repository->clearSecret($user);
        } catch (\Throwable $e) {
            Log::error('Erro ao desativar autenticação 2FA.', [
                'user_id' => $user->id ?? null,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    //return if the user has the 2FA actived
    public function isEnabled(User $user): bool
    {
        return $this->repository->isEnabled($user);
    }
}
