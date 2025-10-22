<?php

namespace App\Actions\Users\Auth;

use App\DTOs\Auth\RegisterUserDto;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class RegisterUserAction
{

    public function __construct(
        protected UserRepository $userRepository,
        protected AuthService $authService
    ) {}

    public function execute(RegisterUserDto $data): array {

        return DB::transaction(function() use ($data) {
            //create user
            $user = $this->$userRepository->create([
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

            //handle image upload of provid
            if ($data->image){
            $this->handleImageUpload($user, $data->image);
            }

            $token = $this->authService->generateToken($user);

            return [
                'user' => $user->fresh(),
                'token' => $token,
            ];
        });
    }

    protected function handleImageUpload(User $user, UploadedFile $image): void
    {
        $path = $image->store("users/{$user->id}", 'public');
        $this->userRepository->update($user->id, ['image' => $path]);
    }
}
