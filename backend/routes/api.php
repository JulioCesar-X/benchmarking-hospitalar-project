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
    Route::apiResource('indicators', 'IndicatorController');

    Route::middleware('role:admin-action')->group(function () {
        Route::get('admin/users', 'UserController@index')->name('admin.users.index');
        Route::get('admin/users/{user}', 'UserController@show')->name('admin.users.show');
        Route::put('admin/users/{user}', 'UserController@update')->name('admin.users.update');
        Route::delete('admin/users/{user}', 'UserController@destroy')->name('admin.users.destroy');

        Route::apiResource('activities', 'ActivityController');
        Route::apiResource('goals', 'GoalController');

        Route::apiResource('notifications', 'NotificationController')->names([
            'index' => 'admin.notifications.index',
            'store' => 'admin.notifications.store',
            'create' => 'admin.notifications.create',
            'show' => 'admin.notifications.show',
            'edit' => 'admin.notifications.edit',
            'update' => 'admin.notifications.update',
            'destroy' => 'admin.notifications.destroy',
        ]);

        Route::apiResource('records', 'RecordController');
        Route::apiResource('roles', 'RoleController');
        Route::apiResource('services', 'ServiceController');
        Route::apiResource('service-activity-indicators', 'ServiceActivityIndicatorController');
    });

    // Rotas para coordenador
    Route::middleware('role:coordinator-action')->group(function () {
        Route::get('coordinator/users', 'UserController@index')->name('coordinator.users.index');
        Route::get('admin/users/{user}', 'UserController@show')->name('admin.users.show');
        Route::post('coordinator/users', 'UserController@store')->name('coordinator.users.store');
        Route::put('coordinator/users/{user}', 'UserController@update')->name('coordinator.users.update');
        Route::apiResource('goals', 'GoalController');
        Route::apiResource('records', 'RecordController');
        
        Route::apiResource('notifications', 'NotificationController')->names([
            'index' => 'coordinator.notifications.index',
            'store' => 'coordinator.notifications.store',
            'create' => 'coordinator.notifications.create',
            'show' => 'coordinator.notifications.show',
            'edit' => 'coordinator.notifications.edit',
            'update' => 'coordinator.notifications.update',
            'destroy' => 'coordinator.notifications.destroy',
        ]);
    });

    // Rotas comuns para todos os usuários autenticados
    Route::get('indicators/accumulated', 'IndicatorController@getAccumulatedIndicators');
    Route::get('records/variation-rates', 'RecordController@getVariationRates');
    Route::get('goals/monthly', 'GoalController@getMonthlyGoals');

    Route::post('/logout', 'AuthController@logout');

});


