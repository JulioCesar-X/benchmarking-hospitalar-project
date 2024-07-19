<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\DB;
use App\Mail\ResetPasswordMailConfirmation;
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

        $firstLogin = $user->first_login;

        if ($firstLogin) {
            // Update the first_login status
            $user->first_login = false;
            $user->save();
        }

        return response()->json([
            'role' => $user->roles()->first()->role_name,
            'name' => $user->name,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'first_login' => $firstLogin
        ]);
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

        try {
            $tokenData = DB::table('password_resets')
            ->where('email', $request->email)
                ->first();

            if ($tokenData && Hash::check($request->token, $tokenData->token)) {
                return response()->json(['message' => 'Token válido'], 200);
            } else {
    
                return response()->json(['message' => 'Token inválido ou expirado'], 400);
            }
        } catch (Exception $e) {

            return response()->json(['message' => 'Erro ao verificar o token de redefinição de senha'], 500);
        }
    }
}