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
Route::get('sai', 'ServiceActivityIndicatorController@index');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('service-activity-indicators/{id}', 'ServiceActivityIndicatorController@show');
    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::apiResource('service-activity-indicators', 'ServiceActivityIndicatorController')->names('admin.service-activity-indicators');
    });

    Route::prefix('coordinator')->middleware('role:coordinator-action')->group(function () {
        Route::apiResource('service-activity-indicators', 'ServiceActivityIndicatorController')->only(['index', 'show', 'update'])->names('coordinator.service-activity-indicators');
    });
});
