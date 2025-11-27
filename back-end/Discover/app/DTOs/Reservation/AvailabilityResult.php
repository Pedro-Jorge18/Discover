<?php

namespace App\DTOs\Reservation;

class AvailabilityResult
{
    public function __construct(
        public bool $available,
        public ?array $conflicts = null,
        public ?string $message = null,
        public ?array $availableDates = null,
        public ?array $validationErrors = null
    ) {}

    public static function available(): self
    {
        return new self(true, null, 'Property is available for the selected dates.');
    }

    public static function conflicted(array $conflicts, ?string $message = null): self
    {
        return new self(false, $conflicts, $message ?? 'Property is not available for the selected dates.');
    }

    public static function validationFailed(array $errors): self
    {
        return new self(false, null, 'Validation failed for availability check.', null, $errors);
    }

    public function toArray(): array
    {
        return [
            'available' => $this->available,
            'message' => $this->message,
            'conflicts' => $this->conflicts,
            'validation_errors' => $this->validationErrors,
        ];
    }
}
