<?php

namespace App\DTOs\User\Auth;

use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use App\Http\Requests\Users\Auth\RegisterUserRequest;

class RegisterUserDto
{
    public function __construct(
        public readonly string $name,
        public readonly string $last_name,
        public readonly string $phone,
        public readonly Carbon $birthday,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $gender = null,
        public readonly string $language = 'en',
        public readonly ?string $about = null,
        public readonly ?UploadedFile $image = null
    ) {}

    public static function fromRequest(RegisterUserRequest $request): self
    {
        $data = $request->validated();

        return new self(
            name: $data['name'],
            last_name: $data['last_name'],
            phone: $data['phone'],
            birthday: Carbon::parse($data->validated('birthday')),
            email: $data['email'],
            password: $data['password'],
            gender: $data['gender'] ?? null,
            language: $data['language'] ?? 'en',
            about: $data['about'] ?? null,
            image: $data->file('image')
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            last_name: $data['last_name'],
            phone: $data['phone'],
            birthday: $data['birthday'] instanceof Carbon
                ? $data['birthday']
                : Carbon::parse($data['birthday']),
            email: $data['email'],
            password: $data['password'],
            gender: $data['gender'] ?? null,
            language: $data['language'] ?? 'en',
            about: $data['about'] ?? null,
            image: $data['image'] instanceof UploadedFile ? $data['image'] : null
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'birthday' => $this->birthday->format('Y-m-d'),
            'email' => $this->email,
            'password' => $this->password,
            'gender' => $this->gender,
            'language' => $this->language,
            'about' => $this->about,
            'image' => $this->image,
        ];
    }

    public function hasImage(): bool
    {
        return $this->image instanceof UploadedFile;
    }

}
