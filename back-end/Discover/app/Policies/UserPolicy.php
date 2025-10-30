<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    //Allows only admins to perform any action
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    //check if the user can view a profile
    public function view(User $user, User $target): bool
    {
        return $user->id === $target->id || $user->hasPermissionTo('view-users');
    }

    //Checks if the user can update their profile
    public function update(User $user, User $target): bool
    {
        return $user->id === $target->id || $user->hasPermissionTo('edit-users');
    }

    //check if the user can delete other user
    public function delete(User $user, User $target): bool
    {
        return $user->hasPermissionTo('delete-users');
    }

    //check if the user can list others users
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view-users');
    }

    //check if the user can create new users
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create-users');
    }
}
