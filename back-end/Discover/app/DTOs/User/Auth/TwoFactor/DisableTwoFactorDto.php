<?php

namespace App\DTOs\User\Auth\TwoFactor;

final readonly class DisableTwoFactorDto
{
    public function __construct(
        public int $userId,
    ) {}
}
