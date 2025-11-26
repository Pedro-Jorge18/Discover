<?php

namespace App\Exceptions\Reservation;

use Exception;

class ReservationConflictException extends Exception
{
    protected $message = 'The selected dates are not available for this property.';

    public function __construct($message = null, $code = 409)
    {
        parent::__construct($message ?? $this->message, $code);
    }
}
