<?php

namespace App\Actions\User;

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
