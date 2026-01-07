<?php

namespace App\DTOs\User\Profile;

use Illuminate\Http\Request;

class UpdateUserDto
{
    public function __construct(
        public ?string $name,
        public ?string $lastname,
        public ?string $contact,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->input('name'),
            $request->input('lastname'),
            $request->input('contact'),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'lastname' => $this->lastname,
            'contact' => $this->contact,
        ]);
    }
}
