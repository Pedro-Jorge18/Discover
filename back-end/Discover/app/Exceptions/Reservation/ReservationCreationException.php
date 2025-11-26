<?php

namespace App\Exceptions\Reservation;

use Exception;

class ReservationCreationException extends Exception
{
    public function __construct(string $message = 'Failed to create reservation', int $code = 422)
    {
        parent::__construct($message, $code);
    }
}
