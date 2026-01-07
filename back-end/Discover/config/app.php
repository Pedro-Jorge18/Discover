<?php


return [

    'name' => env('APP_NAME', 'Laravel'),

    'env' => env('APP_ENV', 'production'),

    'debug' => (bool) env('APP_DEBUG', false),

    'url' => env('APP_URL', 'http://localhost:8000'),

    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),

    'asset_url' => env('ASSET_URL'),

    'timezone' => 'UTC',

    'locale' => env('APP_LOCALE', 'pt'),

    'fallback_locale' => 'en',

    'faker_locale' => 'pt_PT',

    'key' => env('APP_KEY'),

    'cipher' => 'AES-256-CBC',

    'maintenance' => [
        'driver' => 'file',
        // 'store' => 'redis',
    ],
];