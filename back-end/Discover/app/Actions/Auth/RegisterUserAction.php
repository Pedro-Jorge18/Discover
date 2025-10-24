<?php

namespace App\Actions\Users\Auth;

use App\DTOs\Auth\RegisterUserData;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class RegisterUserAction
{
    public function executeRegisterUserAction(RegistereUserData $data): User {
        return DB::transaction(function () use ($data) {
            //create user
            $user = User::create([
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

            return $user->fresh();
        });
    }

    protected function handleImageUpload(User $user, UploadedFile $image): void
    {
        $path = $image->store('users/' . $user->id, 'public');

        $user->update([
            'image' => $path
        ]);
    }
}