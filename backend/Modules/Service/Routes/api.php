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

Route::get('services', 'ServiceController@index')->name('services.index');
Route::get('services/{id}', 'ServiceController@show')->name('services.show');
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::apiResource('services', 'ServiceController')->names('admin.services');
    });

});
