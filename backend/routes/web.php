<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Fabrics\FabricController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('fabrics/{fabric}/barcodes/{barcodeId}/print', [FabricController::class, 'printBarcode'])
    ->name('fabrics.barcodes.print');
