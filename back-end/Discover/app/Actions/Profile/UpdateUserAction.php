<?php

namespace App\Actions\Profile;

use App\Models\User;
use App\DTOs\User\Profile\UpdateUserDto;

class UpdateUserAction
{
    public function execute(User $user, UpdateUserDto $dto): User
    {
        $user->update($dto->toArray());

        return $user->refresh();
    }
}
