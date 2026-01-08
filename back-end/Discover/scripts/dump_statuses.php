<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$rows = \DB::table('reservation_statuses')->get();
foreach ($rows as $r) {
    echo "$r->id - $r->name\n";
}
