<?php

use App\Models\User;
use Illuminate\Support\Facades\Log;

class LogoutUserAction
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function execute(User $user): bool
    {
        try {
            // use the authService for revoke the actual token
            return $this->authService->revokeCurrentToken($user);
        } catch (Throwable $e) {
            Log::error('LogoutUserAction: falha ao revogar token', [
                'user_id' => $user->id ?? null,
                'exception' => $e->getMessage(),
            ]);

            return false;
        }
    }
}