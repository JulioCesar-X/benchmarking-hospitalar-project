<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\IndicatorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceActivityIndicatorController;
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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
// Rotas de recursos para Usuários
Route::apiResource('users', 'UserController');
Route::get('users1/search/', 'UserController@search');

// Rotas de recursos para Atividades
Route::apiResource('activities', 'ActivityController');
Route::get('activities2/search/', 'ActivityController@search');
// Rotas de recursos para Metas
Route::apiResource('goals', 'GoalController');

// Rotas de recursos para Indicadores
Route::apiResource('indicators', 'IndicatorController');
Route::get('indicators3/search/', 'IndicatorController@search');

// Rotas de recursos para Notificações
Route::apiResource('notifications', 'NotificationController');

// Rotas de recursos para Registros
Route::apiResource('records', 'RecordController');

// Rotas de recursos para Roles
Route::apiResource('roles', 'RoleController');

// Rotas de recursos para Serviços
Route::apiResource('services', 'ServiceController');
Route::get('services4/search/', 'ServiceController@search');

// Rotas de recursos para Indicadores de Atividades de Serviços
Route::apiResource('service-activity-indicators', 'ServiceActivityIndicatorController');
