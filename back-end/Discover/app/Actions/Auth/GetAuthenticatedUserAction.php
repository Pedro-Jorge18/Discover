<?php

namespace App\Actions\Auth;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class GetAuthenticatedUserAction
{
    public function __construct(
        protected UserRepository $userRepository,
    ) {}

    public function execute(User $user, array $relations = []): array
    {

        if (!$user) {
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
            'profile',
            'roles',
            'permissions',
            'posts',
            'comments',
            'settings',
            'notifications',
        ];

        $validRelations = $relations
            ? array_intersect($relations, $allowedRelations)
            : ['profile', 'roles', 'permissions']; //basic pattern

        return $user->load($validRelations);
    }

    protected function getUserStatistics(User $user): array
    {
        return Cache::remember("user:{$user->id}:stats", 300, function () use ($user) {
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
        return Cache::remember("user_perms_{$user->id}", 600, function () use ($user) {
            return [
                'roles' => $user->roles->pluck('name')->toArray(),
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ];
        });
    }

    protected function calculateLoginStreak(User $user): int
    {
        // If the user has never logged in, streak is 0
        if (!$user->last_login_date) {
            return 0;
        }

        $lastLogin = $user->last_login_date->startOfDay();
        $today = now()->startOfDay();

        // if user loged in ttoday
        if ($lastLogin->equalTo($today)) {
            // Keeps current streak (or initializes if none exists)
            return $user->login_streak ?? 1;
        }

        // if the last login was yesterday -> add streak
        if ($lastLogin->equalTo($today->copy()->subDay())) {
            return ($user->login_streak ?? 0) + 1;
        }

        // if pass more one day without login
        return 0;
    }
}
