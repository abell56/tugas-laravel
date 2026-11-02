<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;

/*
|--------------------------------------------------------------------------
| Admin Protected Routes (Read All & Destroy)
|--------------------------------------------------------------------------
| Endpoint Read All (index) dan Destroy (destroy) hanya dapat diakses
| oleh user dengan hak akses admin (diproteksi middleware 'admin').
|
| - GET    /api/books        (Read All Books)
| - DELETE /api/books/{id}   (Destroy Book)
| - GET    /api/authors      (Read All Authors)
| - DELETE /api/authors/{id} (Destroy Author)
| - GET    /api/genres       (Read All Genres)
| - DELETE /api/genres/{id}  (Destroy Genre)
*/
Route::middleware(['admin'])->group(function () {
    Route::apiResource('books', BookController::class)->only(['index', 'destroy']);
    Route::apiResource('authors', AuthorController::class)->only(['index', 'destroy']);
    Route::apiResource('genres', GenreController::class)->only(['index', 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Customer Authenticated Routes (Create, Update, & Show)
|--------------------------------------------------------------------------
| Endpoint Create (store), Update (update), dan Show (show) hanya dapat
| diakses oleh customer yang sudah melakukan autentikasi (diproteksi middleware 'customer').
|
| - POST      /api/books        (Create Book)
| - GET       /api/books/{id}   (Show Book Detail beserta relasi)
| - PUT/PATCH /api/books/{id}   (Update Book)
| - POST      /api/authors      (Create Author)
| - GET       /api/authors/{id} (Show Author Detail beserta relasi)
| - PUT/PATCH /api/authors/{id} (Update Author)
| - POST      /api/genres       (Create Genre)
| - GET       /api/genres/{id}  (Show Genre Detail beserta relasi)
| - PUT/PATCH /api/genres/{id}  (Update Genre)
*/
Route::middleware(['customer'])->group(function () {
    Route::apiResource('books', BookController::class)->only(['store', 'update', 'show']);
    Route::apiResource('authors', AuthorController::class)->only(['store', 'update', 'show']);
    Route::apiResource('genres', GenreController::class)->only(['store', 'update', 'show']);
});
