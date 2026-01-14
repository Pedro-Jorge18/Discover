<?php
require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';

echo "=== CORRIGINDO DATABASE ===\n\n";

// 1. Verifica providers atuais
$config = require 'config/app.php';
$providers = $config['providers'] ?? [];

echo "1. PROVIDERS REGISTRADOS: " . count($providers) . "\n";

// 2. Check if DatabaseServiceProvider is registered
$dbProvider = 'Illuminate\Database\DatabaseServiceProvider';
if (in_array($dbProvider, $providers)) {
    echo "   - ✓ DatabaseServiceProvider já está registrado\n";
} else {
    echo "   - ✗ DatabaseServiceProvider NÃO está registrado\n";

    // Adiciona o provider
    array_splice($providers, 3, 0, [$dbProvider]); // Insert after first providers
    $config['providers'] = $providers;

    // Salva o arquivo
    $newContent = "<?php\n\nreturn " . var_export($config, true) . ";\n";
    file_put_contents('config/app.php', $newContent);
    echo "   - ✓ DatabaseServiceProvider adicionado ao config/app.php\n";
}

// 3. Test database after fix
echo "\n2. TESTE DO DATABASE:\n";
try {
    // Registra manualmente para teste imediato
    $dbProvider = new Illuminate\Database\DatabaseServiceProvider($app);
    $dbProvider->register();

    $db = $app->make('db');
    echo "   - ✓ Database carregado\n";

    // Verifica tabelas
    $tables = $db->select("SELECT name FROM sqlite_master WHERE type='table'");
    echo "   - ✓ " . count($tables) . " tabelas encontradas\n";

    // Testa User model
    $user = App\Models\User::first();
    if ($user) {
        echo "   - ✓ Usuário encontrado: " . $user->email . "\n";
    } else {
        echo "   - ℹ Nenhum usuário encontrado (normal se não tiver dados)\n";
    }
} catch (Exception $e) {
    echo "   - ✗ Database ainda falhou: " . $e->getMessage() . "\n";
}

echo "\n=== FIM DA CORREÇÃO ===\n";
