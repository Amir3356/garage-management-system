<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/forgot-username', [AuthController::class, 'forgotUsername']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/mechanics', [UserController::class, 'mechanics']);
    Route::get('/users/clients', [UserController::class, 'clients']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);

    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);

    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/stats', [BookingController::class, 'stats']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
    Route::post('/bookings/{booking}/assign', [BookingController::class, 'assignMechanic']);
});
