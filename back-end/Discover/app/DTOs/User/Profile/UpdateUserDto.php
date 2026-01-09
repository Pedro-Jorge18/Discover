<?php

namespace App\DTOs\User\Profile;

use Illuminate\Http\Request;

class UpdateUserDto
{
    public function __construct(
        public ?string $name,
        public ?string $last_name,
        public ?string $phone,
        public ?string $email,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->input('name'),
            $request->input('lastname'),
            $request->input('contact'),
            $request->input('email'),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'email' => $this->email,
        ]);
    }
}
