<?php

namespace App\Exceptions\Reservation;

use Exception;

class ReservationCapacityException extends Exception
{
    public function __construct($maxGuests, $code = 422)
    {
        $message = "This property accommodates maximum {$maxGuests} guests.";
        parent::__construct($message, $code);
    }
}
