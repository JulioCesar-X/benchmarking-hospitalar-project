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
        Route::apiResource('users',
            'UserController'
        )->names('admin.users');
        Route::get('search', 'UserController@search')->name('admin.users.search');
    });

    Route::prefix('coordenador')->middleware('role:coordinator-action')->group(function () {
        Route::apiResource('users', 'UserController')->only(['index', 'store', 'update','show'])->names('coordenador.users');
    });
});
