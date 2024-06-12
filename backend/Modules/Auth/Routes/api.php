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

Route::post('/login', 'AuthController@login');
Route::post('send-reset-code', 'AuthController@sendResetCode');
Route::post('reset-password', 'AuthController@resetPassword');
Route::get('/check-session', 'AuthController@checkSession');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', 'AuthController@logout');
});

