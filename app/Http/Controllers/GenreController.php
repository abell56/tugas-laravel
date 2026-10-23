<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    /**
     * Menampilkan daftar data Genre dari Model ke View
     */
    public function index()
    {
        // Mengambil data array dari Model Genre
        $genres = Genre::all();

        // Mengirimkan data ke View genres.index
        return view('genres.index', [
            'title' => 'Daftar Genre Buku',
            'genres' => $genres,
        ]);
    }
}
