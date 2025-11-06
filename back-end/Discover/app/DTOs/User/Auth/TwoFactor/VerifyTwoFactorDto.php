<?php

namespace App\DTOs\Auth\TwoFactor;

final readonly class VerifyTwoFactorDto
{
    public function __construct(
        public int $userId,
        public string $code,
    ) {}
}