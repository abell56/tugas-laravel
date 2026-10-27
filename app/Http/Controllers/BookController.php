<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Menampilkan seluruh data Book dalam format JSON
     */
    public function index()
    {
        // Mengambil seluruh data buku beserta relasi author dan genre
        $books = Book::with(['author', 'genre'])->get();

        // Mengembalikan data buku dalam format JSON
        return response()->json($books, 200);
    }
}
