<?php

use Illuminate\Support\Facades\Route;


Route::group(['middleware' => 'throttle:10000,1'], function () {
    Route::post('/verify-reset-token', 'AuthController@verifyResetToken');
    Route::post('/login', 'AuthController@login');
    Route::post('/forgot-password', 'AuthController@forgotPassword');
    Route::post('/reset-password', 'AuthController@resetPassword')->name('password.reset');

    Route::get('services', 'ServiceController@index');
    Route::get('services/paginated', 'ServiceController@getServicesPaginated');
    Route::get('services/search', 'ServiceController@search');
    Route::get('services/{id}', 'ServiceController@show');
    
    Route::get('indicators', 'IndicatorController@index');
});

Route::middleware(['auth:sanctum', 'throttle:10000,1'])->group(function () {
    
    Route::get('notifications/unread', 'NotificationController@getUnreadNotifications');
    Route::patch('notifications/{id}/mark-as-read','NotificationController@markAsRead');
    Route::patch('notifications/{id}/respond', 'NotificationController@respondToNotification');
    Route::get('notifications/sent', 'NotificationController@getAllNotificationSent');
    Route::get('notifications/received', 'NotificationController@getAllNotificationReceived');
    Route::apiResource('notifications', 'NotificationController');

   
    Route::post('/register', 'AuthController@register');
    Route::post('/logout', 'AuthController@logout');
    
    Route::get('indicators/sai/records-mensal', 'IndicatorController@getRecordsMensal');
    Route::get('indicators/sai/records-anual', 'IndicatorController@getRecordsAnual');
    Route::get('indicators/sai/records-last-year', 'IndicatorController@getRecordsLastYear');
    
    Route::get('indicators/sai/goals-mensal', 'IndicatorController@getGoalsMensal');
    Route::get('indicators/sai/goal-mes', 'IndicatorController@getGoalMes');
    Route::get('indicators/sai/goal-anual', 'IndicatorController@getGoalAnual');
    Route::get('indicators/sai/previous-year-total', 'IndicatorController@getPreviousYearTotal');
    Route::get('indicators/sai/current-year-total', 'IndicatorController@getCurrentYearTotal');
    Route::get('indicators/sai/variations', 'IndicatorController@getVariations');
    
    Route::get('indicators/search', 'IndicatorController@search');
    Route::get('indicators/paginated', 'IndicatorController@getIndicatorsPaginated');
    Route::get('indicators/{id}', 'IndicatorController@show');
    
    
    Route::get('activities/search', 'ActivityController@search');
    Route::get('activities/paginated', 'ActivityController@getActivitiesPaginated');
    Route::apiResource('activities', 'ActivityController');
    
    Route::apiResource('goals', 'GoalController');
    Route::apiResource('records', 'RecordController');

    Route::get('/indicators/sai/records', 'IndicatorController@getIndicatorsRecords');
    Route::get('/indicators/sai/goals', 'IndicatorController@getIndicatorsGoals');
    Route::get('indicators/paginated', 'IndicatorController@getIndicatorsPaginated');
    Route::post('indicators', 'IndicatorController@store');
    Route::put('indicators/{id}', 'IndicatorController@update');
    Route::delete('indicators/{id}', 'IndicatorController@destroy');


    Route::post('services', 'ServiceController@store');
    Route::put('services/{id}', 'ServiceController@update');
    Route::delete('services/{id}', 'ServiceController@destroy');

    Route::get('users/paginated', 'UserController@getUsersPaginated');
    Route::get('users/current', 'UserController@showCurrentUser');
    Route::post('users/{id}/reset-password-default', 'UserController@resetPassword');
    Route::get('users/search', 'UserController@search');
    Route::apiResource('users', 'UserController');


});