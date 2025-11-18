<?php

namespace App\ValueObjects\TwoFactor;

use PragmaRX\Google2FA\Google2FA;

final readonly class TwoFactorSecret
{


    public function __construct(
        private string $secret,
        protected readonly Google2FA $google2FA,
    ) {}

    //creates a new instance with a generated secret
    public static function generate(): self
    {
        $google2FA = new Google2FA();
        $secret = $google2FA->generateSecretKey();

        return new self($secret, $google2FA);
    }

    //returns the raw value of the secret
    public function value(): string
    {
        return $this->secret;
    }

    //generates a URL compatible with apps like google authenticator
    public function getQrCodeUrl(string $userEmail, string $appName = 'Discover'): string
    {
        $google2FA = new Google2FA();

        return $google2FA->getQrCodeUrl(
            $appName,
            $userEmail,
            $this->secret
        );
    }

    //checks if a given code is valid
    public function verify(string $code): bool
    {
        $google2FA = new Google2FA();

        return $google2FA->verifyKey($this->secret, $code);
    }

    public function __toString(): string
    {
        return $this->secret;
    }
}
