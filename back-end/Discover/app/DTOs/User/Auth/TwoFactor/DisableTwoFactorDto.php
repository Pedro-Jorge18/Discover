<?php

namespace App\DTOs\Auth\TwoFactor;

final readonly class DisableTwoFactorDto
{
    public function __construct(
        public int $userId,
    ) {}
}