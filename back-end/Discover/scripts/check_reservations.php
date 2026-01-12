<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== ALL RESERVATIONS ===\n\n";

$reservations = DB::table('reservations')
    ->join('statuses', 'reservations.status_id', '=', 'statuses.id')
    ->select('reservations.*', 'statuses.name as status_name')
    ->get();

if ($reservations->isEmpty()) {
    echo "No reservations found.\n";
} else {
    foreach ($reservations as $r) {
        echo sprintf(
            "ID: %d | Property: %d | Check-in: %s | Check-out: %s | Status: %s\n",
            $r->id,
            $r->property_id,
            $r->check_in,
            $r->check_out,
            $r->status_name
        );
    }
}

echo "\n=== ACTIVE RESERVATIONS (Not Cancelled/Completed) ===\n\n";

$active = DB::table('reservations')
    ->join('statuses', 'reservations.status_id', '=', 'statuses.id')
    ->select('reservations.*', 'statuses.name as status_name')
    ->whereIn('statuses.name', ['Pendente', 'Confirmada', 'Confirmed', 'Em Andamento', 'Pending'])
    ->get();

if ($active->isEmpty()) {
    echo "No active reservations found.\n";
} else {
    foreach ($active as $r) {
        echo sprintf(
            "ID: %d | Property: %d | Check-in: %s | Check-out: %s | Status: %s\n",
            $r->id,
            $r->property_id,
            $r->check_in,
            $r->check_out,
            $r->status_name
        );
    }
}
