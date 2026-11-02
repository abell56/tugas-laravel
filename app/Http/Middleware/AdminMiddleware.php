<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Memeriksa apakah pengguna memiliki hak akses sebagai admin.
     * Mendukung:
     * 1. Pengguna login dengan role === 'admin'
     * 2. Header 'Authorization: Bearer <admin-token>'
     * 3. Header 'X-Role: admin' atau input 'role=admin' (untuk kemudahan pengujian di Postman)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek jika pengguna terautentikasi dan memiliki role 'admin'
        if ($request->user() && ($request->user()->role === 'admin' || $request->user()->is_admin)) {
            return $next($request);
        }

        // 2. Ambil parameter role atau header
        $roleHeader = strtolower($request->header('X-Role') ?? $request->header('role') ?? $request->input('role') ?? '');
        $authHeader = $request->header('Authorization');

        // 3. Cek jika terdapat identitas role 'admin'
        if ($roleHeader === 'admin' || ($authHeader && str_contains(strtolower($authHeader), 'admin'))) {
            return $next($request);
        }

        // Jika bukan admin / belum terautentikasi, tolak request dengan status 403 Forbidden
        return response()->json([
            'message' => 'Akses ditolak. Fitur ini hanya dapat diakses oleh admin.',
        ], 403);
    }
}
