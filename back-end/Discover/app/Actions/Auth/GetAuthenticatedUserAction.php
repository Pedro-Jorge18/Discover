<?php

namespace App\Actions\Users\Auth;

use App\Models\User;
use App\Services\AuthService;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Cache;
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
            'statistics' => $this->getUserStatistics($user),
            'permissions' => $this->getUserPermissions($user),
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
         return Cache::remember("user_stats_{$user->id}", 300, function() use ($user) {
            return [
                'posts_count' => $user->posts()->count(),
                'comments_count' => $user->comments()->count(),
                'login_streak' => $this->calculateLoginStreak($user),
                'account_age_days' => $user->created_at->diffInDays(now()),
                'properties_count' => $user->properties()->count(),
                'bookings_count' => $user->bookings()->count(),
                'reviews_count' => $user->reviews()->count(),
            ];
        });
    }

    //permissions and roles user
    protected function getUserPermissions(User $user): array
    {
        return Cache::remember("user_perms_{$user->id}", 600, function() use ($user) {
            return [
                'roles' => $user->roles->pluck('name')->toArray(),
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ];
        });
    }

    protected function calculateLoginStreak(User $user): int
    {
        if (!$user->last_login_date) {
            return 0;
        }

        $lastLogin = $user->last_login_date;
        $today = now()->startOfDay();

        // If you logged in today, check if it is a consecutive streak
        if ($lastLogin->isToday()) {
            // if have a streak in DB, use
            if (isset($user->login_streak)) {
                return $user->login_streak;
            }

            // if you logged in yesterday too
            if ($user->previous_login_date && $user->previous_login_date->isYesterday()) {
                return 2;
            }

            return 1;
        }

        // If the last time you logged in was yesterday, but not today
        if ($lastLogin->isYesterday()) {
            return 0; // not log in today
        }

        return 0; // not logged in recently
    }
}