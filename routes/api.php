<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;

/*
|--------------------------------------------------------------------------
| Public Routes (Dapat diakses oleh semua orang / Guest tanpa autentikasi)
|--------------------------------------------------------------------------
| Endpoint Read All (index) dan Show (detail) pada Author dan Genre
| dapat diakses secara publik tanpa perlu login atau autentikasi.
*/
Route::apiResource('genres', GenreController::class)->only(['index', 'show']);
Route::apiResource('authors', AuthorController::class)->only(['index', 'show']);
Route::get('/books', [BookController::class, 'index'])->name('api.books.index');

/*
|--------------------------------------------------------------------------
| Protected Routes (Hanya dapat diakses oleh Admin)
|--------------------------------------------------------------------------
| Endpoint Create (store), Update (update), dan Destroy (destroy)
| diproteksi menggunakan middleware 'admin' sehingga hanya user dengan
| hak akses admin yang diizinkan untuk mengaksesnya.
*/
Route::middleware(['admin'])->group(function () {
    Route::apiResource('genres', GenreController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('authors', AuthorController::class)->only(['store', 'update', 'destroy']);
});
