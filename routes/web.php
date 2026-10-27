<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Selamat datang di Book Sales API',
        'endpoints' => [
            'books' => url('/api/books'),
            'authors' => url('/api/authors'),
            'genres' => url('/api/genres'),
        ]
    ]);
});
