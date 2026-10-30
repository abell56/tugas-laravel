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
     * Dapat memeriksa autentikasi user (role === 'admin') atau header 'X-Role' untuk pengujian.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek jika pengguna terautentikasi dan memiliki role 'admin'
        if ($request->user() && ($request->user()->role === 'admin' || $request->user()->is_admin)) {
            return $next($request);
        }

        // 2. Cek jika terdapat header 'X-Role: admin' atau input role admin (untuk kemudahan testing di Postman)
        if (
            $request->header('X-Role') === 'admin' ||
            $request->header('role') === 'admin' ||
            $request->input('role') === 'admin'
        ) {
            return $next($request);
        }

        // Jika bukan admin / belum terautentikasi, tolak request dengan status 403 Forbidden
        return response()->json([
            'message' => 'Akses ditolak. Fitur ini hanya dapat diakses oleh admin.',
        ], 403);
    }
}
