<?php

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyImageController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\TwoFactorAuthController;
use App\Http\Controllers\Webhook\StripeWebHookController;
use App\Http\Controllers\Auth\GoogleAuthController;

// Rotas públicas ----------------------------------------------------------
Route::apiResource('properties', PropertyController::class)->only('index', 'show');

// Rotas públicas de reviews (listar reviews de propriedades)
Route::get('properties/{property}/reviews', [ReviewController::class, 'propertyReviews']);
Route::get('reviews', [ReviewController::class, 'index']);
Route::get('reviews/{review}', [ReviewController::class, 'show']);

// Autenticação
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});


Route::middleware('auth:sanctum')->group(function () {

    // Rotas de Usuário
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
            Route::post('change-password', [AuthController::class, 'changePassword']);
        Route::post('set-password', [AuthController::class, 'setPassword']);
        Route::get('me', [AuthController::class, 'me']);

        // 2FA
        Route::prefix('2fa')->group(function () {
            Route::post('/enable', [TwoFactorAuthController::class, 'enable']);
            Route::post('/verify', [TwoFactorAuthController::class, 'verify']);
            Route::post('/disable', [TwoFactorAuthController::class, 'disable']);
        });
    });

    // Rotas protegidas de properties
    Route::apiResource('properties', PropertyController::class)->only(['store', 'update', 'destroy']);

    // Routes de imagens
    Route::prefix('properties/{property}')->group(function () {
        Route::post('/images', [PropertyImageController::class, 'store']);
        Route::delete('/images/{image}', [PropertyImageController::class, 'destroy']);
        Route::patch('/images/{image}/primary', [PropertyImageController::class, 'setPrimary']);
        Route::patch('/images/reorder', [PropertyImageController::class, 'reorder']);
    });

    // Rotas de RESERVAS
    Route::prefix('reservations')->group(function () {
        // Reservas do usuário
        Route::get('/', [ReservationController::class, 'index']);
        Route::post('/', [ReservationController::class, 'store']);
        Route::post('/with-payment', [ReservationController::class, 'storeWithPayment']);
        Route::get('/stats', [ReservationController::class, 'stats']);
        Route::get('/{id}', [ReservationController::class, 'show']);
        Route::delete('/{id}', [ReservationController::class, 'destroy']);
        Route::post('/{id}/confirm', [ReservationController::class, 'confirm']);
    });

    // Rotas de disponibilidade
    Route::get('/properties/{id}/availability', [ReservationController::class, 'checkAvailability']);
    Route::post('/properties/availability/batch', [ReservationController::class, 'checkMultipleAvailability']);

    // Reservas da propriedade (host)
    Route::get('/properties/{id}/reservations', [ReservationController::class, 'propertyReservations']);

    // Payments
    Route::prefix('payments')->group(function () {
        Route::post('/', [PaymentController::class, 'store'])->name('payments.store');
        Route::get('/{payment}', [PaymentController::class, 'show'])->name('payments.show');
        Route::post('/{payment}/refund', [PaymentController::class, 'refund'])->name('payments.refund');
        Route::get('/', [PaymentController::class, 'index'])->name('payments.index');
    });

    // Rotas de REVIEWS (autenticadas)
    Route::prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store']); // Criar review
        Route::get('/my-reviews', [ReviewController::class, 'userReviews']); // Reviews do usuário autenticado
        Route::get('/can-review/{reservation}', [ReviewController::class, 'canReview']); // Verificar se pode avaliar
        Route::put('/{review}', [ReviewController::class, 'update']); // Atualizar review ou adicionar resposta do host
        Route::delete('/{review}', [ReviewController::class, 'destroy']); // Deletar review
    });
});

// Webhook (sem autenticação)
Route::withoutMiddleware(['auth:sanctum'])->post('/webhook/stripe', [StripeWebHookController::class, 'handle'])->name('webhook.stripe');

// Rotas de autenticação com Google
Route::prefix('auth/google')->middleware('throttle:60,1')->group(function () {
    Route::get('/redirect', [GoogleAuthController::class, 'redirectToGoogle']);
    Route::get('/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
    Route::post('/complete-signup', [GoogleAuthController::class, 'completeGoogleSignup']);
});