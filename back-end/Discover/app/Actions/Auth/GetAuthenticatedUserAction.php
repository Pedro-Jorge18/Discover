<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Auth\AuthenticationException;
use App\Repositories\Eloquent\UserRepository;


class GetAuthenticatedUserAction
{
    public function __construct(
        protected UserRepository $userRepository,
    ) {}

    public function execute(): array
    {
        try {

            $user = Auth::user();

            if (!$user) {
                throw new AuthenticationException(__('auth.auth.user_not_authenticated'));
            }

            $user = $this->loadRelations($user);

            // Obtém estatísticas e permissões
            $statistics = $this->getUserStatistics($user);
            $permissions = $this->getUserPermissions($user);

            return [
                'user' => $user,
                'statistics' => $statistics,
                'permissions' => $permissions,
            ];
        } catch (AuthenticationException $e) {
            Log::warning('User login attempt without authentication', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        } catch (\Throwable $e) {
            Log::error('Error retrieving authenticated user.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    protected function loadRelations(User $user, array $relations = []): User
    {
        $relations = ['roles']; // relações básicas

        return $user->load($relations);
    }



    protected function getUserStatistics(User $user): array
    {
        return Cache::remember("user:{$user->id}:stats", 300, function () use ($user) {
            return [
                //'posts_count' => $user->posts()->count(),
                //'comments_count' => $user->comments()->count(),
                'login_streak' => $this->calculateLoginStreak($user),
                'account_age_days' => $user->created_at->diffInDays(now()),
                //'properties_count' => $user->properties()->count(),
                //'bookings_count' => $user->bookings()->count(),
                //'reviews_count' => $user->reviews()->count(),
                'roles_count' => $user->roles()->count(),
            ];
        });
    }



    //permissions and roles user
    protected function getUserPermissions(User $user): array
    {
        return Cache::remember("user:{$user->id}:perms", 600, function () use ($user) {
            return [
                'roles' => $user->roles->pluck('name')->toArray(),
                //'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
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

        // if user logged in today
        if ($lastLogin->equalTo($today)) {
            // Keeps current streak (or initializes if none exists)
            return $user->login_streak ?? 1;
        }

        // if the last login was yesterday -> add streak
        if ($lastLogin->equalTo($today->copy()->subDay())) {
            return ($user->login_streak ?? 0) + 1;
        }

        // if more than one day has passed without login
        return 0;
    }
}
