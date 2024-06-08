<?php

namespace Modules\Auth\Http\Controllers;

use Illuminate\Http\Request;
use Modules\User\Entities\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Modules\Auth\Notifications\ResetPasswordNotification;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('access_token')->plainTextToken;

        return response()->json([
            'role' => $user->roles()->first()->role_name,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out'], 200);
    }

    public function sendResetCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'No user found with this email address.'], 404);
        }

        $code = Str::random(6);
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            ['code' => $code, 'created_at' => now()]
        );

        $user->notify(new ResetPasswordNotification($code));

        return response()->json(['message' => 'Reset code sent to your email.']);
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'password' => 'required|confirmed'
        ]);

        $record = DB::table('password_resets')
        ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record || now()->subMinutes(60)->gt($record->created_at)) {
            return response()->json(['message' => 'Invalid or expired reset code'], 422);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Limpar o registro de recuperação para evitar reuso
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been successfully reset.']);
    }
}
