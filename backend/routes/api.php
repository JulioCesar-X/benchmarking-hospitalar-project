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
// Route::post('/login', 'AuthController@login')->name('api.login');

// Route::middleware('auth:sanctum')->group(function () {

//     // Rotas comuns para todos os usuários autenticados
//     Route::post('/logout', 'AuthController@logout')->name('api.logout');

//     Route::get('indicators/accumulated', 'IndicatorController@getAccumulatedIndicators')->name('indicators.accumulated');
//     Route::get('records/variation-rates', 'RecordController@getVariationRates')->name('records.variation-rates');
//     Route::get('goals/monthly', 'GoalController@getMonthlyGoals')->name('goals.monthly');
//     Route::get('indicators', 'IndicatorController@index')->name('indicators.index');
//     Route::get('indicators/{id}', 'IndicatorController@show')->name('indicators.show');
//     Route::get('services', 'ServiceController@index')->name('services.index');
//     Route::get('services/{id}', 'ServiceController@show')->name('services.show');
//     Route::get('service-activity-indicators', 'ServiceActivityIndicatorController@index')->name('service-activity-indicators.index');
//     Route::get('service-activity-indicators/{id}', 'ServiceActivityIndicatorController@show')->name('service-activity-indicators.show');
//     Route::get('activities', 'ActivityController@index')->name('activities.index');
//     Route::get('activities/{id}', 'ActivityController@show')->name('activities.show');
//     Route::get('records', 'RecordController@index')->name('records.index');
//     Route::get('records/{id}', 'RecordController@show')->name('records.show');
//     Route::get('goals', 'GoalController@index')->name('goals.index');
//     Route::get('goals/{id}', 'GoalController@show')->name('goals.show');

//     // Rotas para admin
//     Route::prefix('admin')->middleware('role:admin-action')->group(function () {
//         Route::apiResource('users', 'UserController')->names('admin.users');
//         Route::apiResource('activities', 'ActivityController')->names('admin.activities');
//         Route::apiResource('notifications', 'NotificationController')->names('admin.notifications');
//         Route::apiResource('records', 'RecordController')->names('admin.records');
//         Route::apiResource('goals', 'GoalController')->names('admin.goals');
//         Route::apiResource('indicators', 'IndicatorController')->names('admin.indicators');
//         Route::apiResource('roles', 'RoleController')->names('admin.roles');
//         Route::apiResource('services', 'ServiceController')->names('admin.services');
//         Route::apiResource('service-activity-indicators', 'ServiceActivityIndicatorController')->names('admin.service-activity-indicators');
//     });

//     // Rotas para coordenador
//     Route::prefix('coordinator')->middleware('role:coordinator-action')->group(function () {
//         Route::apiResource('users', 'UserController')->only(['index', 'store', 'update'])->names('coordinator.users');
//         Route::apiResource('activities', 'ActivityController')->only(['index', 'show'])->names('coordinator.activities');
//         Route::apiResource('goals', 'GoalController')->names('coordinator.goals');
//         Route::apiResource('records', 'RecordController')->names('coordinator.records');
//         Route::apiResource('services', 'ServiceController')->only(['index', 'show'])->names('coordinator.services');
//         Route::apiResource('service-activity-indicators', 'ServiceActivityIndicatorController')->only(['index', 'show', 'update'])->names('coordinator.service-activity-indicators');
//         Route::apiResource('indicators', 'IndicatorController')->only(['index', 'show'])->names('coordinator.indicators');
//         Route::apiResource('notifications', 'NotificationController')->names('coordinator.notifications');
//     });
// });
