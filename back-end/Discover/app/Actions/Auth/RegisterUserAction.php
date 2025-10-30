<?php

namespace App\Actions\Auth;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\Facades\Hash;
use App\Services\Mail\UserMailService;
use App\DTOs\User\Auth\RegisterUserDto;
use Illuminate\Support\Facades\Storage;


class RegisterUserAction
{

    public function __construct(
        protected UserRepository $userRepository,
        protected UserMailService $userMailService,
    ) {}

    public function execute(RegisterUserDto $dto): User
    {

        return DB::transaction(function () use ($dto) {
            //create user
            $user = $this->userRepository->create([
                'name' => $dto->name,
                'last_name' => $dto->last_name,
                'phone' => $dto->phone,
                'birthday' => $dto->birthday,
                'email' => $dto->email,
                'password' => Hash::make($dto->password),
                'gender' => $dto->gender,
                'language' => $dto->language,
                'about' => $dto->about,
                'verified' => false,
                'active' => true,
            ]);

            //upload image (if exists)
            if ($dto->hasImage()) {
                $this->handleImageUpload($user, $dto->image);
            }

            //add role
            $this->assignDefaultRole($user);

            //register log
            Log::info('New user registered', [
                'user_id' => $user->id,
                'email' => $user->email,
                'has_image' => $dto->hasImage(),
            ]);

            return $user->load('roles');
        });
    }

    protected function handleImageUpload(User $user, ?UploadedFile $image): void
    {
        if (!$image) {
            return;
        }

        try {
            $path = Storage::disk('public')->putFile("users/{$user->id}", $image);

            $this->userRepository->update($user->id, [
                'image' => $path,
            ]);

            Log::info('User image uploaded', [
                'user_id' => $user->id,
                'path' => $path,
                'file_size' => $image->getSize(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to upload user image', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    protected function assignDefaultRole(User $user): void
    {
        DB::beginTransaction();

        try {
            $role = UserRole::where('name', UserRole::GUEST)->first();

            if (! $role) {
                throw new \RuntimeException("Default role 'user' not found. Run RoleSeeder first.");
            }

            if (! $user->roles()->where('role_id', $role->id)->exists()) {
                $user->roles()->attach($role->id);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            Log::warning('Failed to assign default role', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
