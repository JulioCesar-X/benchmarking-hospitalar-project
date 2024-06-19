<?php
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
    Route::prefix('coordenador')->middleware('role:coordinator-action')->group(function () {
        Route::get('notifications/received', 'NotificationController@getAllNotificationReceived')->name('coordenador.notifications.received');
        Route::apiResource('notifications', 'NotificationController')->names('coordenador.notifications');
    });
    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::get('notifications/received', 'NotificationController@getAllNotificationReceived')->name('admin.notifications.received');
        Route::apiResource('notifications', 'NotificationController@index')->names('admin.notifications');
    });

});
