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

    Route::get('activities/ByService', 'ServiceActivityIndicatorController@getActivitiesByServiceID');  
    Route::get('sai/indicators/records', 'ServiceActivityIndicatorController@getIndicatorsRecords');
    Route::get('sai/indicators/goals', 'ServiceActivityIndicatorController@getIndicatorsGoals');
    Route::get('sai', 'ServiceActivityIndicatorController@index');
    Route::get('sai/{id}', 'ServiceActivityIndicatorController@show');

    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::apiResource('sai', 'ServiceActivityIndicatorController')->names('admin.sai');
    });

    Route::prefix('coordenador')->middleware('role:coordinator-action')->group(function () {
        Route::apiResource('sai', 'ServiceActivityIndicatorController')->only(['index', 'show', 'update'])->names('coordenador.sai');
    });
});
