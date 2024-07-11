<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function getUsersPaginated(Request $request)
    {
        try {
            $pageSize = $request->input('size');
            $pageIndex = $request->input('page');
            $currentUser = Auth::user();
            $currentUserRole = $currentUser->roles->first()->role_name;
            Log::info('Current user role: ' . $currentUserRole);

            $usersQuery = User::with(['roles', 'sentNotifications', 'receivedNotifications']);

            // Aplicar as restrições baseadas no papel do usuário logado
            if ($currentUserRole === 'Admin') {
                // O admin pode ver todos os coordenadores e utilizadores
                $usersQuery->whereHas('roles', function ($query) {
                    $query->where('role_name', '!=', 'Admin');
                });
            } elseif ($currentUserRole === 'Coordenador') {
                // O coordenador só pode ver utilizadores
                $usersQuery->whereHas('roles', function ($query) {
                    $query->where('role_name', 'User');
                });
            }

            $users = $usersQuery->orderBy('updated_at', 'desc')->paginate($pageSize, ['*'], 'page', $pageIndex);

            return response()->json($users, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with('roles')->findOrFail($id);
            return response()->json($user, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function update(Request $request, User $user)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'string|max:255|nullable',
                'email' => 'string|email|max:255|unique:users,email,' . $user->id . '|nullable',
                'password' => 'string|max:10|nullable',
                'role_id' => 'required|exists:roles,id'
            ]);

            // Atualizar os campos do usuário
            $user->update(array_filter($validatedData, function ($key) {
                return in_array($key, ['name', 'email']);
            }, ARRAY_FILTER_USE_KEY));

            // Atualizar a senha se fornecida
            if ($request->has('password') && $request->input('password')) {
                $user->password = password_hash($request->password, PASSWORD_BCRYPT);
                $user->save();
            }

            // Atualizar as roles se fornecidas
            if ($request->has('role_id')) {
                $user->roles()->sync($request->input('role_id'));
            }

            // Clear the cache
            Cache::forget('users_index');

            return response()->json($user->load(['roles:id,role_name', 'sentNotifications', 'receivedNotifications']), 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            // Clear the cache
            Cache::forget('users_index');

            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $term = $request->input('q');
            $currentUser = Auth::user();
            $currentUserRole = $currentUser->roles->first()->role_name;

            $usersQuery = User::with('roles')
                ->where(function ($query) use ($term) {
                    $query->where('name', 'LIKE', '%' . $term . '%')
                        ->orWhere('email', 'LIKE', '%' . $term . '%');
                });

            // Aplicar as restrições baseadas no papel do usuário logado
            if ($currentUserRole === 'Admin') {
                // O admin pode ver todos os coordenadores e utilizadores
                $usersQuery->whereHas('roles', function ($query) {
                    $query->where('role_name', '!=', 'Admin');
                });
            } elseif ($currentUserRole === 'Coordenador') {
                // O coordenador só pode ver utilizadores
                $usersQuery->whereHas('roles', function ($query) {
                    $query->where('role_name', 'User');
                });
            }

            $users = $usersQuery->get();

            return response()->json($users, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}