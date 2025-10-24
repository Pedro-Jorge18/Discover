<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use App\DTOs\User\Auth\RegisterUserDto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\UserRepository;
use App\Services\Mail\UserMailService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;


class RegisterUserAction
{

    public function __construct(
        protected UserRepository $userRepository,
        protected UserMailService $userMailService,
    ) {}

    public function execute(RegisterUserDto $dto): array
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

            $user = $user->load('roles');

            
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
        try {
            $user->assignRole('user'); // ou 'guest' para seu Airbnb clone
        } catch (\Exception $e) {
            Log::warning('Failed to assign default role', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}