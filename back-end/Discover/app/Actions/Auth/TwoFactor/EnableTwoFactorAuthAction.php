<?php

namespace App\Actions\Auth\TwoFactor;


use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
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
            $user = $dto->userId ? User::find($dto->userId) : Auth::user();

            if (!$user) {
                throw new AuthorizationException(__('auth.unauthenticated'));
            }

            //create and generate the 2FA service
            $twoFactorSecret = $this->twoFactorAuthService->enable($user);

            return [
                'message' => __('auth.2fa.enabled_success'),
                'secret' => $twoFactorSecret->value(),
                'qr_code' => $twoFactorSecret->getQrCodeUrl($user->email),
            ];
        } catch (\Throwable $e) {
            Log::error('Erro ao habilitar 2FA', [
                'user_id' => $dto->userId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
