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
    Route::prefix('admin')->middleware('role:admin-action')->group(function () {
        Route::apiResource('notifications', 'NotificationController')->names('admin.notifications');
        Route::apiResource('notifications/received', 'NotificationController@getAllNotificationReceived')->names('admin.notifications.received');
    });

    Route::prefix('coordinator')->middleware('role:coordinator-action')->group(function () {
        Route::apiResource('notifications', 'NotificationController')->names('coordinator.notifications');
    });
});
