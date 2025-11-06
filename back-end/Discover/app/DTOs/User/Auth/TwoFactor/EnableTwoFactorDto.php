<?php

namespace App\DTOs\User\Auth\TwoFactorl;


final readonly class EnableTwoFactorDto
{
    public function __construct(
        public int $userId;
    ){}
}