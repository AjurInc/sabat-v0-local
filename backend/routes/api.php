<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is healthy',
        'status_code' => 200,
        'timestamp' => now()->toIso8601String()
    ]);
});

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        // Public auth routes
        Route::post('/signup', [AuthController::class, 'signup']);
        Route::post('/signin', [AuthController::class, 'signin']);
        Route::post('/verify-code', [AuthController::class, 'verifyCode']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
        
        // Protected auth routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/refresh', [AuthController::class, 'refresh']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('user')->group(function () {
            Route::get('/profile', function (Request $request) {
                return response()->json([
                    'success' => true,
                    'data' => $request->user()
                ]);
            });
            
            Route::put('/profile', function (Request $request) {
                $request->user()->update($request->validate([
                    'name' => 'required|string|max:255',
                ]));
                
                return response()->json([
                    'success' => true,
                    'message' => 'Profile updated',
                    'data' => $request->user()
                ]);
            });
        });
    });
});
