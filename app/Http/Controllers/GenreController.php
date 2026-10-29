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

    /**
     * Menampilkan detail data Genre berdasarkan ID
     */
    public function show($id)
    {
        // Mencari data genre berdasarkan ID
        $genre = Genre::find($id);

        // Validasi jika data tidak ditemukan
        if (!$genre) {
            return response()->json([
                'message' => 'Data genre tidak ditemukan',
            ], 404);
        }

        // Mengembalikan respons detail data genre
        return response()->json([
            'message' => 'Detail data genre',
            'data' => $genre,
        ], 200);
    }

    /**
     * Memperbarui data Genre berdasarkan ID
     */
    public function update(Request $request, $id)
    {
        // Mencari data genre berdasarkan ID
        $genre = Genre::find($id);

        // Validasi jika data tidak ditemukan
        if (!$genre) {
            return response()->json([
                'message' => 'Data genre tidak ditemukan',
            ], 404);
        }

        // Validasi input data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Memperbarui data genre
        $genre->update($validated);

        // Mengembalikan respons data berhasil diperbarui
        return response()->json([
            'message' => 'Data genre berhasil diperbarui',
            'data' => $genre,
        ], 200);
    }

    /**
     * Menghapus data Genre berdasarkan ID
     */
    public function destroy($id)
    {
        // Mencari data genre berdasarkan ID
        $genre = Genre::find($id);

        // Validasi jika data tidak ditemukan
        if (!$genre) {
            return response()->json([
                'message' => 'Data genre tidak ditemukan',
            ], 404);
        }

        // Menghapus data genre
        $genre->delete();

        // Mengembalikan respons data berhasil dihapus
        return response()->json([
            'message' => 'Data genre berhasil dihapus',
        ], 200);
    }
}
