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

    Route::get('activities/search', 'ActivityController@search')->name('activities.search');
    Route::get('activities', 'ActivityController@index')->name('activities.index');
    Route::get('activities/{id}', 'ActivityController@show')->name('activities.show');

    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::apiResource('activities', 'ActivityController')->names('admin.activities');
    });

    Route::prefix('coordinator')->middleware('role:coordinator-action')->group(function () {
        Route::apiResource('activities', 'ActivityController')->only(['index', 'show'])->names('coordenador.activities');
    });
});
