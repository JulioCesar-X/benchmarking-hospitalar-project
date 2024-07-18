<?php

namespace App\Http\Controllers;

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function index()
    {
        try {
            $cacheKey = 'users_index_' . auth()->id(); 

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $users = User::with(['roles:id,role_name', 'sentNotifications', 'receivedNotifications'])
            ->where('id', '!=', auth()->id())
                ->get();

            Cache::put($cacheKey, $users, now()->addMinutes(30));

            return response()->json($users, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }


    public function getUsersPaginated(Request $request)
    {
        try {
            $pageSize = $request->input('size', 10);
            $pageIndex = $request->input('page', 1);
            $currentUser = Auth::user();
            $currentUserRole = $currentUser->roles->first()->role_name;
            $currentUserId = $currentUser->id;

            $usersQuery = User::with(['roles', 'sentNotifications', 'receivedNotifications'])
            ->where('id', '!=', $currentUserId); 

            if ($currentUserRole === 'Admin') {
                $usersQuery->whereHas('roles', function ($query) {
                    $query->whereNotIn('role_name', ['Admin', 'Root']);
                });
            } elseif ($currentUserRole === 'Coordenador') {
                $usersQuery->whereHas('roles', function ($query) {
                    $query->where('role_name', 'User');
                });
            }

            // Order by updated_at and paginate the results
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

    public function showCurrentUser()
    {
        try {
            $user = Auth::user();
            return response()->json($user, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|nullable',
            'email' => 'string|email|max:255|unique:users,email,' . $user->id . '|nullable',
            'password' => [
                'nullable',
                'string',
                'min:10',
                'regex:/[a-z]/',      // deve ter pelo menos uma letra minúscula
                'regex:/[A-Z]/',      // deve ter pelo menos uma letra maiúscula
                'regex:/[0-9]/',      // deve ter pelo menos um dígito
                'regex:/[@$!%*?&#]/', // deve ter pelo menos um caractere especial
            ],
            
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Atualizar os campos do usuário
            $user->update(array_filter($validator->validated(), function ($key) {
                return in_array($key, ['name', 'email']);
            }, ARRAY_FILTER_USE_KEY));

            // Atualizar a senha se fornecida
            if ($request->has('password') && $request->input('password')) {
                $user->password = bcrypt($request->input('password'));
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

    public function updatePassword(Request $request)
    {
        try {
            $user = Auth::user();
            $user_auth = User::findOrFail($user->id);

            if (!$user_auth || !Hash::check($request->currentPassword, $user_auth->password)) {
                return response()->json(['error' => 'Senha atual está incorreta'], 400);
            }

            $user_auth->password = bcrypt($request->newPassword);
            $user_auth->save();

            return response()->json(['message' => 'Senha atualizada com sucesso!'], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    
    public function resetPassword($id)
    {
        try {

            $user = User::findOrFail($id);
            $user->password = bcrypt($user->nif);
            $user->save();

            return response()->json($user, 200);
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
            $currentUserId = $currentUser->id;

            $usersQuery = User::with('roles')
                ->where('id', '!=', $currentUserId) 
                ->where(function ($query) use ($term) {
                    $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($term) . '%'])
                        ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($term) . '%']);
                });

            if ($currentUserRole === 'Admin') {
                $usersQuery->whereHas('roles', function ($query) {
                    $query->whereNotIn('role_name', ['Admin', 'Root']);
                });
            } elseif ($currentUserRole === 'Coordenador') {
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