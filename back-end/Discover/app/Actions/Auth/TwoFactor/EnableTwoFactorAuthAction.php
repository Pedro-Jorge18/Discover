<?php

namespace App\Actions\Auth\TwoFactor;


use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\TwoFactor\TwoFactorAuthService;
use Illuminate\Auth\Access\AuthorizationException;
use App\DTOs\User\Auth\TwoFactor\EnableTwoFactorDto;

class EnableTwoFactorAuthAction
{
    public function __construct(
        protected TwoFactorAuthService $twoFactorAuthService
    ) {}

    public function execute(EnableTwoFactorDto $dto): array
    {

        try {
            $user = $dto->userId ?? Auth::user();

            if (!$user) {
                throw new AuthorizationException(__('auth.unauthenticated'));
            }

            //create and generate the 2FA service
            $data = $this->twoFactorAuthService->enable($user);

            return [
                'message' => __('auth.2fa.enabled.success'),
                'secret' => $data['secret'],
                'qr_code' => $data['qr_code'],
            ];
        } catch (\Throwable $e) {
            Log::error('Erro ao habilitar 2FA' . [
                'user_id' => $user->id ?? null,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}