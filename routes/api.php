<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;

// Routing API menggunakan apiResource untuk Genre dan Author
Route::apiResource('genres', GenreController::class);
Route::apiResource('authors', AuthorController::class);

// Routing API untuk data Book
Route::get('/books', [BookController::class, 'index'])->name('api.books.index');
