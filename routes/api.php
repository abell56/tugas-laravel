<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;

// Routing API untuk data Genre
Route::get('/genres', [GenreController::class, 'index'])->name('api.genres.index');

// Routing API untuk data Author
Route::get('/authors', [AuthorController::class, 'index'])->name('api.authors.index');

// Routing API untuk data Book
Route::get('/books', [BookController::class, 'index'])->name('api.books.index');
