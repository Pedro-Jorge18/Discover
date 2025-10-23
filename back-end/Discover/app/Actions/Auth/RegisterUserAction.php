<?php

namespace App\Actions\Users\Auth;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\UploadedFile;
use App\DTOs\Auth\RegisterUserDto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;


class RegisterUserAction
{

    public function __construct(
        protected UserRepository $userRepository,
        protected AuthService $authService
    ) {}

    public function execute(RegisterUserDto $data): array {


        try {
            return DB::transaction(function() use ($data) {
                //create user
                $user = $this->userRepository->create([
                    'name' => $data->name,
                    'last_name' => $data->last_name,
                    'phone' => $data->phone,
                    'birthday' => $data->birthday,
                    'email' => $data->email,
                    'password' => Hash::make($data->password),
                    'gender' => $data->gender,
                    'language' => $data->language,
                    'about' => $data->about,
                    'verified' => false,
                    'active' => true,
                ]);

                //upload image (if exists)
                $this->handleImageUpload($user, $data['image'] ?? null);

                //add role
                $this->assignDefaultRole($user);

                //create token
                $token = $this->authService->generateToken($user);

                //register log
                Log::info('New user registered!', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'has_image' => !is_null($data['image'] ?? null),
                ]);

                return [
                    'user' => $user->load('roles'),
                    'token' => $token,
                    'token_type' => 'Bearer',
                ];

            });

        }catch(\Exception $e) {

            Log::error('Register user failed!', [
                'email' => $data['email'] ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }



    }

    protected function handleImageUpload(User $user, ?UploadedFile $image): void
    {
        if(!$image){
            return;
        }

        try{
            //use storage facade
            $path = Storage::disk('public')->putFile("users/{$user->id}", $image);

            //user update with the path image
            $this->userRepository->update($user->id, [
                'image' => $path
            ]);

            Log::info('User image save', [
                'user_id' => $user->id,
                'image_path' => $path,
                'file_size' => $image->getSize(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed upload image', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            //not stop recording if upload fails

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
