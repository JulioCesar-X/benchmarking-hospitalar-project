<?php

use Illuminate\Support\Facades\Route;


Route::group(['middleware' => 'throttle:10000,1'], function () {
    Route::post('/login', 'AuthController@login');
    Route::post('/register', 'AuthController@register');
    Route::post('/forgot-password', 'AuthController@forgotPassword');
    Route::post('/reset-password', 'AuthController@resetPassword')->name('password.reset');

    Route::get('services', 'ServiceController@index');
    Route::get('services/paginated', 'ServiceController@getServicesPaginated');
    Route::get('services/search', 'ServiceController@search');
    Route::get('services/{id}', 'ServiceController@show');

    
    Route::get('indicators', 'IndicatorController@index');
});

Route::middleware(['auth:sanctum', 'throttle:10000,1'])->group(function () {
    Route::post('/logout', 'AuthController@logout');

    Route::get('activities/search', 'ActivityController@search');

    Route::get('indicators/sai/charts', 'IndicatorController@getAllInDataGraphs');
    Route::get('indicators/search', 'IndicatorController@search');
    Route::get('indicators/sai/paginated', 'IndicatorController@getSAIPaginated');
    Route::get('indicators/{id}', 'IndicatorController@show');

    
    Route::get('activities/paginated', 'ActivityController@getActivitiesPaginated');
    Route::apiResource('activities', 'ActivityController');

    Route::apiResource('goals', 'GoalController');

    Route::get('/indicators/sai/records', 'IndicatorController@getIndicatorsRecords');
    Route::get('/indicators/sai/goals', 'IndicatorController@getIndicatorsGoals');
    Route::get('indicators/paginated', 'IndicatorController@getIndicatorsPaginated');
    Route::post('indicators', 'IndicatorController@store');
    Route::put('indicators/{id}', 'IndicatorController@update');
    Route::delete('indicators/{id}', 'IndicatorController@destroy');

    Route::get('notifications/received', 'NotificationController@getAllNotificationReceived');
    Route::apiResource('notifications', 'NotificationController');
    Route::apiResource('records', 'RecordController');

    Route::post('services', 'ServiceController@store');
    Route::put('services/{id}', 'ServiceController@update');
    Route::delete('services/{id}', 'ServiceController@destroy');

    Route::get('users/paginated', 'UserController@getUsersPaginated');
    Route::get('users/search', 'UserController@search');
    Route::apiResource('users', 'UserController');

});