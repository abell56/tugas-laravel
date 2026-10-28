<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;

// Routing API untuk data Genre
Route::get('/genres', [GenreController::class, 'index'])->name('api.genres.index');
Route::post('/genres', [GenreController::class, 'store'])->name('api.genres.store');

// Routing API untuk data Author
Route::get('/authors', [AuthorController::class, 'index'])->name('api.authors.index');
Route::post('/authors', [AuthorController::class, 'store'])->name('api.authors.store');

// Routing API untuk data Book
Route::get('/books', [BookController::class, 'index'])->name('api.books.index');
