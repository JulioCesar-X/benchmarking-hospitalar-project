<?php

namespace App\Http\Controllers;

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Role;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMailConfirmation;
use App\Mail\WelcomeMail;
use Exception;




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



    /**
     * store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nif' => 'required|string|size:9|unique:users',
            'role_id' => 'required|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $hashedPassword = bcrypt($request->nif);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $hashedPassword,
                'nif' => $request->nif,
                'email_verified_at' => now(),
            ]);

            $role = Role::find($request->role_id);
            $user->roles()->attach($role);

            // Clear the cache
            Cache::forget('users_index');
            Mail::to($request->email)->send(new WelcomeMail($request->nif, $request->email));
            return response()->json(['message' => 'Registration successful'], 201);
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

    public function updateRoleUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);  // Buscando o usuário pelo ID
            $user->roles()->sync($request->input('role_id'));

            // Clear the cache
            Cache::forget('users_index');

            return response()->json($user->load('roles:id,role_name'), 200);
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
            'current_password' => 'required_with:email,password|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            if ($request->has('email') || $request->has('password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json(['error' => 'Senha atual está incorreta'], 400);
                }
            }

            // Atualizar os campos do usuário
            $user->update(array_filter($validator->validated(), function ($key) {
                return in_array($key, ['name', 'email']);
            }, ARRAY_FILTER_USE_KEY));

            // Atualizar a senha se fornecida
            if ($request->has('password') && $request->input('password')) {
                $user->password = bcrypt($request->input('password'));
                $user->save();
                Mail::to($user->email)->send(new ResetPasswordMailConfirmation($user->email));
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