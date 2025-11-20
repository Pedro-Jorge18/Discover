<?php

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyImageController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Webhook\StripeWebHookController;

Route::apiResource('properties', PropertyController::class)->only('index', 'show');


//auth
Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    // Rotas protegidas de properties
    Route::apiResource('properties', PropertyController::class)->only(['store', 'update', 'destroy']);

    // Rotas de imagens
    Route::prefix('properties/{property}')->group(function () {
        Route::post('/images', [PropertyImageController::class, 'store']);
        Route::delete('/images/{image}', [PropertyImageController::class, 'destroy']);
        Route::patch('/images/{image}/primary', [PropertyImageController::class, 'setPrimary']);
        Route::patch('/images/reorder', [PropertyImageController::class, 'reorder']);
    });
});



//payment
Route::prefix('payments')->middleware(['auth:sanctum'])->group(function () {
    //create checkout
    Route::post('/', [PaymentController::class, 'store'])->name('payments.store');

    //see payment details
    Route::get('/{payment}', [PaymentController::class, 'show'])->name('payments.show');

    //refund
    Route::post('/{payment}/refund', [PaymentController::class, 'refund'])->name('payments.refund');

    //list authenticated user payments
    Route::get('/', [PaymentController::class, 'index'])->name('payments.index');
});

//webhook

Route::withoutMiddleware(['auth:sanctum'])->post('/webhook/stripe', [StripeWebHookController::class, 'handle'])->name('webhook.stripe');
