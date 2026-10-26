<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Menampilkan daftar data Book dari database ke View
     */
    public function index()
    {
        // Mengambil seluruh data buku beserta relasi author dan genre
        $books = Book::with(['author', 'genre'])->get();

        // Mengirimkan data ke View books.index
        return view('books.index', [
            'title' => 'Daftar Buku (Book)',
            'books' => $books,
        ]);
    }
}
