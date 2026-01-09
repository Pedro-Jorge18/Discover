<?php

namespace App\Actions\Profile;

use App\Models\User;

class DeleteUserAction
{
    public function execute(User $user): bool
    {
        // remove tokens antes
        $user->tokens()->delete();

        return (bool) $user->delete();
    }
}
