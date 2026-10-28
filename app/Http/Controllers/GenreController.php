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
        // Mengambil seluruh data dari Model Genre
        $genres = Genre::all();

        // Mengembalikan data dalam format JSON
        return response()->json($genres, 200);
    }

    /**
     * Menyimpan data Genre baru ke database
     */
    public function store(Request $request)
    {
        // Validasi input data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Menyimpan data genre baru
        $genre = Genre::create($validated);

        // Mengembalikan respons dalam format JSON dengan status HTTP 201 (Created)
        return response()->json([
            'message' => 'Data genre berhasil ditambahkan',
            'data' => $genre,
        ], 201);
    }
}
