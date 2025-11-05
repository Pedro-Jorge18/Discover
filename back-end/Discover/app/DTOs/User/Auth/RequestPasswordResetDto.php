<?php

namespace App\DTOs\User\Auth;

class RequestPasswordResetDto
{
    public function __construct(
        public readonly string $email,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'],
        );
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
        ];
    }
}