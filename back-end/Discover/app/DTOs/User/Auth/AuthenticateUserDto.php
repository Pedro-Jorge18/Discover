<?php

namespace App\DTOs\User\Auth;

use App\Http\Requests\Users\Auth\LoginUserRequest;

class AuthenticateUserDto
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly bool $remember_me = false,
    ) {}

    public static function fromRequest(LoginUserRequest $request):self
    {
        return new self(
            email:$request['email'],
            password: $request['password'],
            remember_me:(bool) ($request['remember_me'] ?? false)
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'],
            password: $data['password'],
            remember_me: $data['remember_me'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'password' => $this->password,
            'remember_me' => $this->remember_me,
        ];
    }

    //get credentials for authentication
    public function toCredentials(): array
    {
        return [
            'email' => $this->email,
            'password' => $this->password,
        ];
    }
}
