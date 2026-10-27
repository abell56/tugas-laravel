<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    /**
     * Menampilkan seluruh data Genre dalam format JSON
     */
    public function index()
    {
        // Mengambil data dari Model Genre
        $genres = Genre::all();

        // Mengembalikan data dalam format JSON
        return response()->json($genres, 200);
    }
}
