<?php

namespace App\Actions\Auth;

use Throwable;
use App\Models\User;
use App\Services\User\AuthService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LogoutUserAction
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function execute(?User $user = null): bool
    {
        $targetUser = null;

        try {
            $targetUser = $user ?? Auth::user();

            if (!$targetUser) {
                Log::warning('LogoutUserAction: No authenticated user found');
                return false;
            }

            if (!$this->validateUserOwnerShip($targetUser)) {
                Log::warning('LogoutUserAction: Attempt to revoke another user token', [
                    'requested_user_id' => $targetUser->id,
                    'authenticated_user_id' => Auth::id(),
                ]);
                return false;
            }

            // use the authService for revoke the actual token
            return $this->authService->revokeCurrentToken($targetUser);
        } catch (Throwable $e) {
            Log::error('LogoutUserAction: failed to revoke token', [
                'user_id' => $targetUser->id ?? null,
                'exception' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function validateUserOwnerShip(User $requestedUser): bool
    {
        $authenticatedUser = Auth::user();

        //permitted if the same user or admin
        return $authenticatedUser && ($requestedUser->id === $authenticatedUser->id || $authenticatedUser->hasRole('admin'));
    }
}
