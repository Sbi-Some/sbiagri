<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CultureController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\StockItemController;
use App\Http\Controllers\Api\DashboardController;

// Routes publiques (non authentifiées)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées (authentifiées via Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    // CRUD
    Route::apiResource('cultures', CultureController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('stocks', StockItemController::class);
});