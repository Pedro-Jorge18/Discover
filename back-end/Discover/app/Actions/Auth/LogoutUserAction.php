<?php

namespace App\Actions\Users\Auth;

use Throwable;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LogoutUserAction
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function execute(?User $user = null): bool
    {
        try {
            $targetUser = $user ?? Auth::user();

            if(!$targetUser){
                Log::warning('LogoutUserAction: No authenticated users found');
                return false;
            }

            if($user && !$this->validateUserOwnerShip($user)){
                Log::warning('LogoutUserAction: Attempt to revoke another users token', [
                    'requested_user_id' => $user->id,
                    'authenticated_user_id' => Auth::id(),
                ]);
                return false;
            }

            // use the authService for revoke the actual token
            return $this->authService->revokeCurrentToken($user);
        } catch (Throwable $e) {
            Log::error('LogoutUserAction: failed to revoke token', [
                'user_id' => $user->id ?? null,
                'exception' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function validateUserOwnership(User $requestedUser): bool{
        $authenticatedUser = Auth::user();

        //permited if the same user or admin
        return $authenticatedUser && ($requestedUser->id === $authenticatedUser->id || $authenticatedUser->is_admin);
    }
}
