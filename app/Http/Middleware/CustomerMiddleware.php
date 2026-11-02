<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Memeriksa apakah request berasal dari customer yang sudah terautentikasi.
     * Mendukung:
     * 1. Pengguna login (auth / session / token) dengan role 'customer'
     * 2. Header autentikasi 'Authorization: Bearer <token>'
     * 3. Header testing 'X-Role: customer' atau input 'role=customer' (untuk kemudahan pengujian di Postman)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek jika pengguna terautentikasi via Laravel Auth guard
        if ($request->user()) {
            if ($request->user()->role === 'customer' || empty($request->user()->role)) {
                return $next($request);
            }

            return response()->json([
                'message' => 'Akses ditolak. Fitur ini hanya dapat diakses oleh customer yang sudah melakukan autentikasi.',
            ], 403);
        }

        // 2. Ambil parameter role atau header autentikasi
        $roleHeader = strtolower($request->header('X-Role') ?? $request->header('role') ?? $request->input('role') ?? '');
        $authHeader = $request->header('Authorization');

        // 3. Jika membawa identitas/role customer atau token autentikasi customer
        if ($roleHeader === 'customer' || ($authHeader && str_contains(strtolower($authHeader), 'customer'))) {
            return $next($request);
        }

        // 4. Jika role dikirim tapi bukan customer (misalnya admin mencoba akses endpoint khusus customer)
        if (!empty($roleHeader) && $roleHeader !== 'customer') {
            return response()->json([
                'message' => 'Akses ditolak. Fitur ini hanya dapat diakses oleh customer yang sudah melakukan autentikasi.',
            ], 403);
        }

        // 5. Jika tidak ada kredensial / belum login (Unauthorized 401)
        return response()->json([
            'message' => 'Unauthenticated. Akses hanya untuk customer yang sudah melakukan autentikasi. Silakan sertakan token autentikasi atau header X-Role: customer.',
        ], 401);
    }
}
