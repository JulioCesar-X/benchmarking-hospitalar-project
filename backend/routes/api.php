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

Route::post('/login', 'AuthController@login')->name('api.login');

// Todas as rotas aqui requerem autenticação
Route::middleware('auth:sanctum')->group(function () {

    // Rotas para admin
    Route::middleware('can:admin-action')->group(function () {
        Route::apiResource('users', 'UserController');
        Route::apiResource('activities', 'ActivityController');
        Route::apiResource('goals', 'GoalController');
        Route::apiResource('indicators', 'IndicatorController');
        Route::apiResource('notifications', 'NotificationController');
        Route::apiResource('records', 'RecordController');
        Route::apiResource('roles', 'RoleController');
        Route::apiResource('services', 'ServiceController');
        Route::apiResource('service-activity-indicators', 'ServiceActivityIndicatorController');
    });

    // Rotas para coordenador
    Route::middleware('can:coordinator-action')->group(function () {
        Route::apiResource('users', 'UserController')->only(['index', 'store', 'update']);
        Route::apiResource('goals', 'GoalController');
        Route::apiResource('records', 'RecordController');
        Route::apiResource('notifications', 'NotificationController');
    });

    // Rotas comuns para todos os usuários autenticados
    Route::get('indicators/accumulated', 'IndicatorController@getAccumulatedIndicators');
    Route::get('records/variation-rates', 'RecordController@getVariationRates');
    Route::get('goals/monthly', 'GoalController@getMonthlyGoals');

    Route::post('/logout', 'AuthController@logout');

    // Rotas específicas para colaboradores (leitura apenas)
    Route::middleware('can:collaborator-view')->group(function () {
        Route::get('users', 'UserController@index');
        Route::get('users/{user}', 'UserController@show');
        Route::get('activities', 'ActivityController@index');
        Route::get('activities/{activity}', 'ActivityController@show');
        Route::get('goals', 'GoalController@index');
        Route::get('goals/{goal}', 'GoalController@show');
        Route::get('indicators', 'IndicatorController@index');
        Route::get('indicators/{indicator}', 'IndicatorController@show');
        Route::get('notifications', 'NotificationController@index');
        Route::get('notifications/{notification}', 'NotificationController@show');
        Route::get('records', 'RecordController@index');
        Route::get('records/{record}', 'RecordController@show');
        Route::get('roles', 'RoleController@index');
        Route::get('roles/{role}', 'RoleController@show');
        Route::get('services', 'ServiceController@index');
        Route::get('services/{service}', 'ServiceController@show');
        Route::get('service-activity-indicators', 'ServiceActivityIndicatorController@index');
        Route::get('service-activity-indicators/{service_activity_indicator}', 'ServiceActivityIndicatorController@show');
    });

});


