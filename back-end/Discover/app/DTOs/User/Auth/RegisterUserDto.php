<?php

namespace App\DTOs\Auth;

use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use App\Http\Requests\Users\Auth\RegisterUserRequest;

class RegisterUserDto
{
    public function __construct(
        public string $name,
        public string $last_name,
        public string $phone,
        public Carbon $birthday,
        public string $email,
        public string $password,
        public ?string $gender = null,
        public string $language = 'en',
        public ?string $about = null,
        public ?UploadedFile $image = null
    ) {}

    public static function fromRequest(RegisterUserRequest $request): self
    {
        return new self(
            name: $request['name'],
            last_name: $request['last_name'],
            phone: $request['phone'],
            birthday: Carbon::parse($request->validated('birthday')),
            email: $request['email'],
            password: $request['password'],
            gender: $request['gender'] ?? null,
            language: $request['language'] ?? 'en',
            about: $request['about'] ?? null,
            image: $request->file('image')
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

}
