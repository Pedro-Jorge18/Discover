<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserRepository
{
    //find user by email
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    //create new user
    public function create(array $data): User
    {
        return User::create($data);
    }

    //update data of exists user
    public function update(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        $user->update($data);

        return $user;
    }
}