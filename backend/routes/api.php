<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Buyers\BuyerController;
use App\Http\Controllers\Api\Suppliers\SupplierController;
use App\Http\Controllers\Api\Fabrics\FabricController;
use App\Http\Controllers\Api\Fabrics\FabricStockController;
use App\Http\Controllers\Api\Notes\NoteController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::middleware('throttle:auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('buyer/register', [AuthController::class, 'registerBuyer']);
    Route::post('buyer/login', [AuthController::class, 'loginBuyer']);
    Route::post('email/verification-notification', [AuthController::class, 'resendVerification']);
    Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware('signed')
        ->name('verification.verify');
});

// Protected routes
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);

    Route::get('buyers', [BuyerController::class, 'index'])
        ->middleware('permission:buyers.view');
    Route::get('buyers/{buyer}', [BuyerController::class, 'show'])
        ->middleware('permission:buyers.view');
    Route::put('buyers/{buyer}', [BuyerController::class, 'update'])
        ->middleware('permission:buyers.update');
    Route::patch('buyers/{buyer}', [BuyerController::class, 'update'])
        ->middleware('permission:buyers.update');
    Route::delete('buyers/{buyer}', [BuyerController::class, 'destroy'])
        ->middleware('permission:buyers.delete');

    Route::get('suppliers', [SupplierController::class, 'index'])
        ->middleware('permission:suppliers.view');
    Route::get('suppliers/{supplier}', [SupplierController::class, 'show'])
        ->middleware('permission:suppliers.view');
    Route::post('suppliers', [SupplierController::class, 'store'])
        ->middleware('permission:suppliers.create');
    Route::put('suppliers/{supplier}', [SupplierController::class, 'update'])
        ->middleware('permission:suppliers.update');
    Route::patch('suppliers/{supplier}', [SupplierController::class, 'update'])
        ->middleware('permission:suppliers.update');
    Route::delete('suppliers/{supplier}', [SupplierController::class, 'destroy'])
        ->middleware('permission:suppliers.delete');
    Route::get('suppliers-trash', [SupplierController::class, 'trash'])
        ->middleware('permission:suppliers.trash.view');
    Route::post('suppliers/{supplier}/restore', [SupplierController::class, 'restore'])
        ->middleware('permission:suppliers.restore');

    Route::get('fabrics', [FabricController::class, 'index'])
        ->middleware('permission:fabrics.view');
    Route::get('fabrics/{fabric}', [FabricController::class, 'show'])
        ->middleware('permission:fabrics.view');
    Route::post('fabrics', [FabricController::class, 'store'])
        ->middleware('permission:fabrics.create');
    Route::put('fabrics/{fabric}', [FabricController::class, 'update'])
        ->middleware('permission:fabrics.update');
    Route::patch('fabrics/{fabric}', [FabricController::class, 'update'])
        ->middleware('permission:fabrics.update');
    Route::delete('fabrics/{fabric}', [FabricController::class, 'destroy'])
        ->middleware('permission:fabrics.delete');
    Route::get('fabrics-trash', [FabricController::class, 'trash'])
        ->middleware('permission:fabrics.trash.view');
    Route::post('fabrics/{fabric}/restore', [FabricController::class, 'restore'])
        ->middleware('permission:fabrics.restore');

    Route::post('fabric-stocks', [FabricStockController::class, 'store'])
        ->middleware('permission:fabrics.stocks.create');

    Route::post('notes', [NoteController::class, 'store'])
        ->middleware('permission:suppliers.notes.create|fabrics.notes.create');
});
