<?php

namespace Modules\User\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Modules\User\Entities\User;
use Modules\Role\Entities\Role;
use Exception;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $users = User::all();
            return response()->json($users->load(['roles', 'sentNotifications', 'receivedNotifications']), 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getUsersPaginated(Request $request)
    {
        try {

            $pageSize = $request->input('size');
            $pageIndex = $request->input('page');

            $users = User::with(['roles', 'sentNotifications', 'receivedNotifications'])
                ->paginate($pageSize, ['*'], 'page', $pageIndex);

            return response()->json($users, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {

            $request->validate([

                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|max:10',
                'role_id' => 'required|exists:roles,id'
            ]);

            $role = Role::find($request->role_id);

            $user = User::create($request->all());
            $user->roles()->attach($role);

            return response()->json($user->load(['roles', 'sentNotifications', 'receivedNotifications']), 201);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {

            $user = User::findOrFail($id);
            return response()->json($user->load(['roles', 'sentNotifications', 'receivedNotifications']), 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
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
            if ($request->has('password')) {
                $user->password = Hash::make($request->input('password'));
                $user->save();
            }

            // Atualizar as roles se fornecidas
            if ($request->has('role_id')) {
                $user->roles()->sync($request->input('role_id'));
            }

            return response()->json($user->load(['roles', 'sentNotifications', 'receivedNotifications']), 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    /**
     * Search for users based on a given query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        try {
            $term = $request->input('q');
            $users = User::where('name', 'LIKE', '%' . $term . '%')
                ->orderBy('updated_at', 'desc')
                ->get();
            return response()->json($users->load(['roles']), 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
