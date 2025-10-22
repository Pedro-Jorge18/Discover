<?php

namespace App\Actions\Users\Auth;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class GetAuthenticatedUserAction
{
    public function __construct(
        protected UserRepository $userRepository,
        protected AuthService $authService,
    ) {}

    public function execute(array $relations = []): array
    {
        $user = $this->authService->getAuthenticatedUser();

        if(!$user){
            throw new ModelNotFoundException(__('auth.user_not_authenticated'));
        }

        //load relations
        $user = $this->loadRelations($user, $relations);

        return [
            'user' => $user,
            'statistics' => $this->getUserStatistics($user);
            'permissions' => $this->getUserPermissions($user);
        ];
    }

    protected function loadRelations(User $user, array $relations = []): User
    {
        $allowedRelations = [
            'profile', 'roles', 'permissions', 'posts',
            'comments', 'settings', 'notifications',
        ];

        $validRelations = $relations
            ? array_intersect($relations, $allowedRelations)
            : ['profile', 'roles', 'permissions']; //basic pattern

        return $user->load($validRelations);
    }

    protected function getUserStatistics(User $user): array
    {
        return [
            'posts_count' => $user->posts()->count(),
            'comments_count' => $user->comments()->count(),
            'login_streak' => $this->calculateLoginStreak($user),
            'account_age_days' => $user->created_at->diffInDays(now()),
        ];
    }

    //permissions and roles user
    protected function getUserPermissions(User $user): array
    {
        return [
            'roles' => $user->roles->pluck('name'),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ];
    }

    protected function calculateLoginStreak(User $user): int
    {
        if (!$user->last_login_date) {
            return 0;
        }

        return $user->last_login_date->isToday() ? 1 : 0;
    }
}