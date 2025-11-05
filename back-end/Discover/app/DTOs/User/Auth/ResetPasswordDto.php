<?php

namespace App\DTOs\User\Auth;

class ResetPasswordDto
{
    public function __construct(
        public string $email,
        public string $token,
        public string $password,
        public string $password_confirmation,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'],
            token: $data['token'],
            password: $data['password'],
            password_confirmation: $data['password_confirmation'],
        );
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'token' => $this->token,
            'password' => $this->password,
            'pasword_confirmation' => $this->password_confirmation,
        ];
    }
}