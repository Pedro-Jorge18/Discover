<?php

namespace App\DTOs\User\Auth\TwoFactor;

final readonly class VerifyTwoFactorDto
{
    public function __construct(
        public int $userId,
        public string $code,
    ) {}
}