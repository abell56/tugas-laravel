<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    /**
     * Menampilkan seluruh data Author dalam format JSON
     */
    public function index()
    {
        // Mengambil seluruh data dari Model Author
        $authors = Author::all();

        // Mengembalikan data dalam format JSON
        return response()->json($authors, 200);
    }

    /**
     * Menyimpan data Author baru ke database
     */
    public function store(Request $request)
    {
        // Validasi input data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => 'required|string|max:255',
            'bio' => 'required|string',
        ]);

        // Menyimpan data author baru
        $author = Author::create($validated);

        // Mengembalikan respons dalam format JSON dengan status HTTP 201 (Created)
        return response()->json([
            'message' => 'Data author berhasil ditambahkan',
            'data' => $author,
        ], 201);
    }
}
