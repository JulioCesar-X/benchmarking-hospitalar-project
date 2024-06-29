<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Modules\Indicator\Http\Controllers\IndicatorController;

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

    Route::get('indicators/sai/charts', 'IndicatorController@getAllInDataGraphs');
    Route::get('indicators/search', 'IndicatorController@search')->name('indicators.search');
    Route::get('indicators/sai/paginated', 'IndicatorController@getSAIPaginated')->name('indicators.sai.paginated');
    Route::get('/indicators/sai/records', 'IndicatorController@getIndicatorsRecords');
    Route::get('/indicators/sai/goals', 'IndicatorController@getIndicatorsGoals');
    Route::get('indicators', 'IndicatorController@index')->name('indicators');
    Route::get('indicators/{id}', 'IndicatorController@show')->name('indicators.show');


    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::get('indicators/paginated', 'IndicatorController@getIndicatorsPaginated')->name('admin.indicators.paginated');
        Route::apiResource('indicators', 'IndicatorController')->names('admin.indicators');
    });

    Route::prefix('coordenador')->middleware('role:coordinator-action')->group(function () {
        Route::apiResource('indicators', 'IndicatorController')->only(['index', 'show'])->names('coordenador.indicators');
    });
});
