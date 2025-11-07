<?php

namespace App\Actions\Auth\TwoFactor;

use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\DTOs\User\Auth\TwoFactorl\EnableTwoFactorDto;

class EnableTwoFactorAuthAction
{
    public function __construct(
        protected Google2FA $google2fa
    ) {}

    public function execute(EnableTwoFactorDto $dto): array
    {
        $user = Auth::user();

        if (!$user) {
            throw new \RuntimeException(__('auth.user_not_authenticated'));
        }

        try {
            //create a new secret key
            $secretKey = $this->google2fa->generateSecretKey();

            //create url for qr code
            $qrCodeUrl = $this->google2fa->getQRCodeUrl(
                config('app.name'),
                $user->email,
                $secretKey
            );

            //update user with secret without activate
            $user->update([
                'two_factor_secret' => encrypt($secretKey),
                'two_factor_enabled' => false,
            ]);

            Log::info('Two-factor secret generated', ['user_id' => $user->id]);

            return [
                'qr_code_url' => $qrCodeUrl,
                'secret_key' => $secretKey,
                'message' => __('two_factor_secret_generated'),
            ];
        } catch (\Throwable $e) {
            Log::error('Failed to enable two-factor auth' . [
                'user_id' => $user->id ?? null,
                'error' => $e->getMessage(),
            ]);

            throw new \RuntimeException(__('two_factor.enable_failed'));
        }
    }
}