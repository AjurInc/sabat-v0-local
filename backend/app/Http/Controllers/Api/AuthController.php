<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Sign up a new user
     */
    public function signup(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                    'regex:/[A-Z]/',      // Uppercase
                    'regex:/[0-9]/',      // Number
                    'regex:/[@$!%*?&]/',  // Special char
                ],
            ], [
                'password.regex' => 'Password must contain uppercase letter, number, and special character',
            ]);

            // Create verification code
            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => now()->addMinutes(10),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Account created. Verification code sent.',
                'data' => [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'verification_code' => $verificationCode,
                    'expires_at' => $user->verification_code_expires_at->toIso8601String(),
                    'expires_in_seconds' => 600,
                ],
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Verify signup code and issue JWT token
     */
    public function verifyCode(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'verification_code' => 'required|string|size:6',
            ]);

            $user = User::findOrFail($validated['user_id']);

            // Check if user already verified
            if ($user->email_verified_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'User already verified',
                ], 400);
            }

            // Check code
            if ($user->verification_code !== $validated['verification_code']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid verification code',
                ], 400);
            }

            // Check expiration
            if (now()->isAfter($user->verification_code_expires_at)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Verification code expired',
                ], 400);
            }

            // Mark as verified
            $user->update([
                'email_verified_at' => now(),
                'verification_code' => null,
                'verification_code_expires_at' => null,
            ]);

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Email verified successfully',
                'data' => [
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => 3600,
                    'user' => $user->only(['id', 'name', 'email', 'email_verified_at']),
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Sign in user
     */
    public function signin(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|exists:users',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $validated['email'])->firstOrFail();

            // Check password
            if (!Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials',
                ], 401);
            }

            // If user not verified, send new code
            if (!$user->email_verified_at) {
                $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $user->update([
                    'verification_code' => $verificationCode,
                    'verification_code_expires_at' => now()->addMinutes(10),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Verification code sent to your email',
                    'data' => [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'verification_code' => $verificationCode,
                        'expires_in_seconds' => 600,
                        'verification_required' => true,
                    ],
                ], 200);
            }

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Signed in successfully',
                'data' => [
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => 3600,
                    'user' => $user->only(['id', 'name', 'email', 'email_verified_at']),
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ], 200);
    }

    /**
     * Get current user
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ], 200);
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed',
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ],
        ], 200);
    }

    /**
     * Forgot password
     */
    public function forgotPassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|exists:users',
            ]);

            $user = User::where('email', $validated['email'])->firstOrFail();

            // Generate reset code
            $resetCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->update([
                'password_reset_code' => $resetCode,
                'password_reset_code_expires_at' => now()->addMinutes(30),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password reset code sent to your email',
                'data' => [
                    'email' => $user->email,
                    'reset_code' => $resetCode,
                    'expires_in_seconds' => 1800,
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Reset password with code
     */
    public function resetPassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|exists:users',
                'reset_code' => 'required|string|size:6',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                    'regex:/[@$!%*?&]/',
                ],
            ]);

            $user = User::where('email', $validated['email'])->firstOrFail();

            // Check reset code
            if ($user->password_reset_code !== $validated['reset_code']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid reset code',
                ], 400);
            }

            // Check expiration
            if (now()->isAfter($user->password_reset_code_expires_at)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reset code expired',
                ], 400);
            }

            // Update password
            $user->update([
                'password' => Hash::make($validated['password']),
                'password_reset_code' => null,
                'password_reset_code_expires_at' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }
}
