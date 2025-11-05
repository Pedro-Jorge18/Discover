<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Webhook\StripeWebHookController;

//authentication
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

//reset password
Route::prefix('auth')->group(function () {
    Route::post('/forget-password', [PasswordResetController::class, 'forgetPassword']);
    Route::post('/reset-password', [PasswordResetController::class], 'resetPassword');
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
ROute::post('/webhook/stripe', [StripeWebHookController::class, 'handle'])->name('webhook.stripe');