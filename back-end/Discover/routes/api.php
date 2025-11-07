<?php

use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::apiResource('properties', PropertyController::class)->only('index', 'show');

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('properties', PropertyController::class)->only(['store', 'update', 'destroy']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});
