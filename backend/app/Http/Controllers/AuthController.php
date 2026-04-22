<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PasswordReset;
use App\Mail\PasswordResetMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'nullable|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,client,mechanic',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;
        $allowedEmail = 'amirsiraj1995@gmail.com';

        if ($email !== $allowedEmail) {
            return response()->json([
                'message' => 'This email is not authorized for password reset.',
            ], 403);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No user found with this email address.',
            ], 404);
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $token = Str::random(64);

        PasswordReset::where('email', $email)->delete();

        PasswordReset::create([
            'email' => $email,
            'otp' => $otp,
            'token' => $token,
            'expires_at' => now()->addMinutes(15),
        ]);

        try {
            Mail::to($email)->send(new PasswordResetMail($otp, $user->username));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send email. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'OTP has been sent to your email address.',
            'token' => $token,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'token' => 'required|string',
        ]);

        $passwordReset = PasswordReset::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('token', $request->token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$passwordReset) {
            return response()->json([
                'message' => 'Invalid or expired OTP.',
            ], 400);
        }

        $resetToken = Str::random(64);

        $passwordReset->update([
            'token' => $resetToken,
            'expires_at' => now()->addMinutes(30),
        ]);

        return response()->json([
            'message' => 'OTP verified successfully.',
            'reset_token' => $resetToken,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'reset_token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $passwordReset = PasswordReset::where('email', $request->email)
            ->where('token', $request->reset_token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$passwordReset) {
            return response()->json([
                'message' => 'Invalid or expired reset token.',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        PasswordReset::where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password has been reset successfully.',
        ]);
    }

    public function forgotUsername(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;
        $allowedEmail = 'amirsiraj1995@gmail.com';

        if ($email !== $allowedEmail) {
            return response()->json([
                'message' => 'This email is not authorized.',
            ], 403);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No user found with this email address.',
            ], 404);
        }

        try {
            Mail::to($email)->send(new \App\Mail\ForgotUsernameMail($user->username));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send email. Please try again later.',
            ], 500);
        }

        return response()->json([
            'message' => 'Your username has been sent to your email address.',
        ]);
    }
}
