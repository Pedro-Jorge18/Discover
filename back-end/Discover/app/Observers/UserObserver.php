<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Services\Mail\UserMailService;

class UserObserver
{

    public function __construct(
        protected UserMailService $userMailService,
    ) {}

    //Event triggered after user creation
    public function created(User $user): void
    {

        //send welcome email
        try {
            $this->userMailService->sendWelcome($user);

            Log::info('UserObserver: welcome email sent.', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send welcome email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    //event triggered after user update
    public function update(User $user): void
    {
        Log::info('User updated', [
            'user_id' => $user->id,
            'changes' => $user->getChanges(),
        ]);
    }

    //event triggerd before delete user
    public function deleting(User $user): void
    {
        $user->profile()->delete();
    }
}