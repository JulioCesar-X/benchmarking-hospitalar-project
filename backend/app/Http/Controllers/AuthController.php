<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use App\Role;
use Illuminate\Support\Facades\Log;




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

        Log::info('Senha fornecida:', [$request->password]);
        Log::info('Senha armazenada:', [$user->password]);

        if (!Hash::check($request->password, $user->password)) {
            Log::info("A senha fornecida não corresponde ao hash armazenado.");
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }

        $token = $user->createToken('access_token')->plainTextToken;

        return response()->json([
            'role' => $user->roles()->first()->role_name,
            'name' => $user->name,
            'email' => $user->email,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:3',
        ]);

        $hashedPassword = Hash::make($request->password);
        Log::info('Senha criptografada:', [$hashedPassword]);

        // Verificação adicional
        if (!Hash::check($request->password, $hashedPassword)) {
            Log::info('Falha na verificação do hash após criptografia.');
            return response()->json(['message' => 'Erro na criptografia da senha.'], 500);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $hashedPassword,
            'email_verified_at' => now(),
        ]);

        $role = Role::where('role_name', 'User')->first();
        $user->roles()->attach($role);

        return response()->json(['message' => 'Registration successful'], 200);
    }



    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out'], 200);
    }


    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            $user = User::where('email', $request->email)->first();
            $token = app('auth.password.broker')->createToken($user);

            Mail::to($request->email)->send(new ResetPasswordMail($token));

            return response()->json(['message' => __($status)], 200);
        }

        return response()->json(['email' => __($status)], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:3',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);;
                $user->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)], 200);
        }

        return response()->json(['email' => [__($status)]], 400);
    }
}