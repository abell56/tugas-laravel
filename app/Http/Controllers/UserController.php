<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Menampilkan seluruh data pengguna / user yang terdaftar di sistem
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role')
            ->orderBy('id', 'desc')
            ->get();

        $formatted = $users->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'fullName' => $u->name,
                'email' => $u->email,
                'role' => $u->role === 'customer' ? 'customer' : $u->role,
                'avatar' => $u->role === 'admin'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            ];
        });

        return response()->json($formatted, 200);
    }

    /**
     * Memperbarui peran / role pengguna (admin <-> customer)
     */
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:admin,customer',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Pengguna tidak ditemukan.'], 404);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'Peran pengguna berhasil diperbarui menjadi ' . strtoupper($request->role),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 200);
    }

    /**
     * Menghapus akun user jika diperlukan oleh administrator
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Pengguna tidak ditemukan.'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Pengguna berhasil dihapus.'], 200);
    }
}
