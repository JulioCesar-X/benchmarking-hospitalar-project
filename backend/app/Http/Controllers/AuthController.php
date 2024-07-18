<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use App\Role;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\ResetPasswordMailConfirmation;
use App\Mail\WelcomeMail;
use Exception;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $providedPassword = $request->password;
        $storedHash = $user->password;

        if (!password_verify($providedPassword, $storedHash)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }

        // Set token expiration to 4 hours
        $token = $user->createToken('access_token', ['*'], now()->addHours(4))->plainTextToken;

        return response()->json([
            'role' => $user->roles()->first()->role_name,
            'name' => $user->name,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    /**
     * Register a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
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

            $hashedPassword = bcrypt($request->nif); // Usar o NIF como a senha padrão

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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out'], 200);
    }


    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $token = app('auth.password.broker')->createToken($user);

        Mail::to($request->email)->send(new ResetPasswordMail($token, $request->email));

        return response()->json(['message' => 'Link de redefinição de senha enviado!'], 200);
    }



    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $tokenData = DB::table('password_resets')
        ->where('email', $request->email)
        ->first();

        if ($tokenData && Hash::check($request->token, $tokenData->token)) {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->password = bcrypt($password);
                    $user->save();
                }
            );

            if ($status == Password::PASSWORD_RESET) {
                // Excluir o token de redefinição de senha
                DB::table('password_resets')->where('email', $request->email)->delete();

                Mail::to($request->email)->send(new ResetPasswordMailConfirmation($request->email));

                return response()->json(['message' => 'Senha redefinida com sucesso!'], 200);
            }

            return response()->json(['email' => [__($status)]], 400);
        } else {
            return response()->json(['message' => 'Token inválido ou expirado'], 400);
        }
    }

    public function verifyResetToken(Request $request)
    {
        $request->validate(['token' => 'required', 'email' => 'required|email']);
        Log::info('Verificando o token de redefinição de senha: ' . $request->token);
        Log::info('Verificando o email de redefinição de senha: ' . $request->email);

        try {
            $tokenData = DB::table('password_resets')
            ->where('email', $request->email)
                ->first();

            if ($tokenData && Hash::check($request->token, $tokenData->token)) {
                return response()->json(['message' => 'Token válido'], 200);
            } else {
                Log::error('Erro ao verificar o token de redefinição de senha: ' . $tokenData);
                return response()->json(['message' => 'Token inválido ou expirado'], 400);
            }
        } catch (Exception $e) {
            Log::error('Erro ao verificar o token de redefinição de senha: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao verificar o token de redefinição de senha'], 500);
        }
    }
}