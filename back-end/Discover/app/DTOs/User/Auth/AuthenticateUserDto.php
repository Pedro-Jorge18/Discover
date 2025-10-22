<?php

namespace App\DTOs\Auth;

class AuthenticateUserDto
{
    public function __construct(
        public string $email,
        public string $password,
        public bool $remember_me,
    ) {}

    public static function fromRequest(array $data):self
    {
        return new self(
            email:$data['email'],
            password: $data['password'],
            remember_me:(bool) ($data['remember_me'] ?? false)
        );
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