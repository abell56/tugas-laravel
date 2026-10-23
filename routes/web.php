<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;

Route::get('/', function () {
    return view('welcome');
});

// Routing untuk menampilkan data array Genre
Route::get('/genres', [GenreController::class, 'index'])->name('genres.index');

// Routing untuk menampilkan data array Author
Route::get('/authors', [AuthorController::class, 'index'])->name('authors.index');

