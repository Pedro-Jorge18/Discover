<?php

namespace App\DTOs\User\Auth\TwoFactor;

final readonly class ConfirmTwoFactorDto
{
    public function __construct(
        public int $userId,
        public string $code,
    ) {}
}