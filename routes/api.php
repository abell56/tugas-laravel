<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| Public Authentication Routes (Register & Login)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/me', [AuthController::class, 'me']);

/*
|--------------------------------------------------------------------------
| Public Catalog Routes (Katalog Buku, Genre, Author)
|--------------------------------------------------------------------------
| Dapat diakses oleh umum (Guest) maupun Customer untuk melihat dan mencari
| katalog buku, detail buku, serta daftar kategori.
*/
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/genres', [GenreController::class, 'index']);
Route::get('/genres/{id}', [GenreController::class, 'show']);
Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{id}', [AuthorController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Management Routes (CRUD Buku, Kategori, & Penulis)
|--------------------------------------------------------------------------
| Digunakan oleh Admin untuk memonitor dan mengontrol data buku:
| - Tambah (store)
| - Ubah / Edit (update)
| - Hapus (destroy)
*/
Route::post('/books', [BookController::class, 'store']);
Route::put('/books/{id}', [BookController::class, 'update']);
Route::patch('/books/{id}', [BookController::class, 'update']);
Route::delete('/books/{id}', [BookController::class, 'destroy']);

Route::post('/genres', [GenreController::class, 'store']);
Route::put('/genres/{id}', [GenreController::class, 'update']);
Route::patch('/genres/{id}', [GenreController::class, 'update']);
Route::delete('/genres/{id}', [GenreController::class, 'destroy']);

Route::post('/authors', [AuthorController::class, 'store']);
Route::put('/authors/{id}', [AuthorController::class, 'update']);
Route::patch('/authors/{id}', [AuthorController::class, 'update']);
Route::delete('/authors/{id}', [AuthorController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Transaction / Orders Routes (Keranjang & Pemesanan)
|--------------------------------------------------------------------------
| - GET /api/transactions        (Daftar transaksi / pesanan)
| - POST /api/transactions       (Checkout pesanan dari keranjang)
| - GET /api/transactions/{id}   (Detail transaksi)
| - DELETE /api/transactions/{id}(Hapus transaksi)
*/
Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/{id}', [TransactionController::class, 'show']);
Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Payment Routes (Midtrans Snap)
|--------------------------------------------------------------------------
*/
Route::post('/payment/snap-token', [PaymentController::class, 'createSnapToken']);

/*
|--------------------------------------------------------------------------
| User Management Routes (Admin Monitoring)
|--------------------------------------------------------------------------
*/
Route::get('/users', [UserController::class, 'index']);
Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Contact Routes (Contact to Admin)
|--------------------------------------------------------------------------
*/
Route::post('/contacts', [ContactController::class, 'store']);
Route::get('/contacts', [ContactController::class, 'index']);
Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
