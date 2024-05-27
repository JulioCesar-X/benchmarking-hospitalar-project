<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('records/variation-rates', 'RecordController@getVariationRates')->name('records.variation-rates');
    Route::get('records', 'RecordController@index')->name('records.index');
    Route::get('records/{id}', 'RecordController@show')->name('records.show');

    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::apiResource('records', 'RecordController')->names('admin.records');
    });

    Route::prefix('coordinator')->middleware('role:coordinator-action')->group(function () {
        Route::apiResource('records', 'RecordController')->names('coordinator.records');
    });
});
