<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Registrasi pengguna baru ke database (Register)
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:admin,customer,user',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar. Silakan gunakan email lain.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // Normalisasi role: 'user' disamakan dengan 'customer' di database
        $roleInput = strtolower($request->input('role', 'customer'));
        $role = ($roleInput === 'admin') ? 'admin' : 'customer';

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'role' => $role,
        ]);

        $formattedUser = [
            'id' => $user->id,
            'fullName' => $user->name,
            'name' => $user->name,
            'username' => strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $user->name)),
            'email' => $user->email,
            'role' => $user->role === 'customer' ? 'user' : $user->role,
            'registeredAt' => $user->created_at ? $user->created_at->format('d M Y') : date('d M Y'),
        ];

        return response()->json([
            'message' => 'Registrasi berhasil! Akun Anda telah disimpan di database.',
            'user' => $formattedUser,
            'token' => 'Bearer token-user-' . $user->id,
        ], 201);
    }

    /**
     * Login autentikasi pengguna dari database (Login)
     */
    public function login(Request $request)
    {
        $identifier = $request->input('identifier') ?? $request->input('email') ?? $request->input('username');
        $password = $request->input('password');

        if (empty($identifier) || empty($password)) {
            return response()->json([
                'message' => 'Username/Email dan kata sandi wajib diisi.',
            ], 422);
        }

        // Cari user berdasarkan email atau name/username
        $user = User::where('email', $identifier)
            ->orWhere('name', $identifier)
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'message' => 'Username/Email atau kata sandi tidak valid.',
            ], 401);
        }

        $formattedUser = [
            'id' => $user->id,
            'fullName' => $user->name,
            'name' => $user->name,
            'username' => strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $user->name)),
            'email' => $user->email,
            'role' => $user->role === 'customer' ? 'user' : $user->role,
            'registeredAt' => $user->created_at ? $user->created_at->format('d M Y') : date('d M Y'),
            'avatar' => $user->role === 'admin'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        ];

        return response()->json([
            'message' => 'Login berhasil! Selamat datang kembali, ' . $user->name . '.',
            'user' => $formattedUser,
            'token' => 'Bearer token-' . $user->role . '-' . $user->id,
        ], 200);
    }

    /**
     * Mengambil data profil user yang sedang aktif
     */
    public function me(Request $request)
    {
        $authHeader = $request->header('Authorization', '');
        // Ekstrak user id jika format token-role-id
        if (preg_match('/-(\d+)$/', $authHeader, $matches)) {
            $user = User::find($matches[1]);
            if ($user) {
                return response()->json([
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role === 'customer' ? 'user' : $user->role,
                ]);
            }
        }

        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    /**
     * Logout
     */
    public function logout()
    {
        return response()->json([
            'message' => 'Logout berhasil.',
        ], 200);
    }
}
