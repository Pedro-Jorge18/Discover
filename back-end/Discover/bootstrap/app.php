<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
<<<<<<< HEAD
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
=======
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
>>>>>>> d9f48908a5dc12b5997c564275660a9fd0e337c1
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Add locale middleware globally
        $middleware->append(\App\Http\Middleware\SetLocale::class);

        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        $middleware->alias([
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
        ]);

        // Configurar CORS
        $middleware->validateCsrfTokens(except: [
            'webhook/stripe',
            'api/webhook/stripe',
        ]);


        // // Adicionar middleware para SPA stateful (cookies + CSRF) — opcional
        // $middleware->prependToGroup('api', [
        //     EnsureFrontendRequestsAreStateful::class,
        // ]);

        // // Add alias for authentication middleware (route middleware)
        // $middleware->alias([
        //     'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
        // ]);

        // // Se quiseres agrupar middleware para o grupo “api”:
        // $middleware->appendToGroup('api', [
        //     'auth.sanctum',
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();