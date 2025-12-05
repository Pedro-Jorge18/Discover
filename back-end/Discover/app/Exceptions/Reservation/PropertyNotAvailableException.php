<?php

namespace App\Exceptions\Reservation;

use Exception;

class PropertyNotAvailableException extends Exception
{
    public function __construct($message = 'Property is not available for reservation.', $code = 422)
    {
        parent::__construct($message, $code);
    }
}
