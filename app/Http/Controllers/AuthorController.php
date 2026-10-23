<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    /**
     * Menampilkan daftar data Author dari Model ke View
     */
    public function index()
    {
        // Mengambil data array dari Model Author
        $authors = Author::all();

        // Mengirimkan data ke View authors.index
        return view('authors.index', [
            'title' => 'Daftar Penulis (Author)',
            'authors' => $authors,
        ]);
    }
}
