<?php

namespace App\DTOs\Auth;

use Illuminate\Http\UploadedFile;

class RegisterUserData
{
    public function __construct(
        public string $name,
        public string $last_name,
        public string $phone,
        public string $birthday,
        public string $email,
        public string $password,
        public ?string $gender = null,
        public string $language = 'en',
        public ?string $about = null,
        public ?UploadedFile $image = null
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name: $data['name'],
            last_name: $data['last_name'],
            phone: $data['phone'],
            birthday: $data['birthday'],
            email: $data['email'],
            password: $data['password'],
            gender: $data['gender'] ?? null,
            language: $data['language'] ?? 'en',
            about: $data['about'] ?? null,
            image: $data['image'] ?? null
        );
    }
}