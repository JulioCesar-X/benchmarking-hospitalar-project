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
    Route::get('goals/monthly', 'GoalController@getMonthlyGoals')->name('goals.monthly');
    Route::get('goals', 'GoalController@index')->name('goals.index');
    Route::get('goals/{id}',
        'GoalController@show'
    )->name('goals.show');

    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::apiResource('goals', 'GoalController')->names('admin.goals');
    });

    Route::prefix('coordenador')->middleware('role:coordinator-action')->group(function () {
        Route::apiResource('goals', 'GoalController')->names('coordenador.goals');
    });
});
