<?php
// check_mysql.php
require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';

try {
    echo "=== CONFIGURAÇÃO MYSQL ===\n";
    echo "Driver: " . config('database.default') . "\n";

    $config = config('database.connections.mysql');
    echo "Database: " . ($config['database'] ?? 'N/A') . "\n";
    echo "Host: " . ($config['host'] ?? 'N/A') . "\n";
    echo "Username: " . ($config['username'] ?? 'N/A') . "\n";

    echo "\n=== TABELAS NO MYSQL ===\n";
    $tables = DB::select('SHOW TABLES');

    echo "Total: " . count($tables) . " tabelas\n";
    foreach ($tables as $table) {
        $tableName = $table->{'Tables_in_' . $config['database']};
        echo "- " . $tableName . "\n";
    }
} catch (Exception $e) {
    echo "Erro: " . $e->getMessage() . "\n";
}
