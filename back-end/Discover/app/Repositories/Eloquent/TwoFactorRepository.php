<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\ValueObjects\TwoFactor\TwoFactorSecret;

class TwoFactorRepository
{

    //store the 2FA secret for the user
    public function storeSecret(User $user, TwoFactorSecret $secret): void
    {
        $user->forceFill([
            'two_factor_secret' => encrypt($secret->value()),
            'two_factor_enabled' => true,
        ])->save();
    }

    //recovery the user secret
    public function getSecret(User $user): ?string
    {
        if (!$user->two_factor_secret) {
            return null;
        }

        return decrypt($user->two_factor_secret);
    }

    //remove the secret, disable the 2FA
    public function clearSecret(User $user): void
    {
        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_enabled' => false,
        ])->save();
    }

    //check if the 2FA is actived
    public function isEnabled(User $user): bool
    {
        return (bool) $user->two_factor_enabled;
    }
}
