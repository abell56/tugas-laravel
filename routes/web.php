<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;

Route::get('/', function () {
    return view('welcome');
});

// Routing untuk menampilkan data Genre
Route::get('/genres', [GenreController::class, 'index'])->name('genres.index');

// Routing untuk menampilkan data Author
Route::get('/authors', [AuthorController::class, 'index'])->name('authors.index');

// Routing untuk menampilkan data Book
Route::get('/books', [BookController::class, 'index'])->name('books.index');
