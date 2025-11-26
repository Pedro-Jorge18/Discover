<?php

namespace App\DTOs\User\Auth\TwoFactor;


final readonly class EnableTwoFactorDto
{
    public function __construct(
        public int $userId,
    ) {}
}
