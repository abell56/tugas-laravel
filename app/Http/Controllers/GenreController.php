<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class GenreController extends Controller
{
    /**
     * Menampilkan seluruh data Genre beserta relasi buku dalam format JSON (Read All).
     */
    public function index()
    {
        // Mengambil seluruh data dari Model Genre beserta relasi buku (books)
        $genres = Genre::with('books')->get();

        // Mengembalikan data dalam format JSON
        return response()->json($genres, 200);
    }

    /**
     * Menyimpan data Genre baru ke database (Create).
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
     * Menampilkan detail data Genre berdasarkan ID beserta relasi buku (Show).
     */
    public function show($id)
    {
        // Mencari data genre berdasarkan ID beserta relasi Model buku (books)
        $genre = Genre::with('books')->find($id);

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
     * Memperbarui data Genre berdasarkan ID (Update).
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
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ]);

        // Memperbarui data genre
        $genre->update($validated);
        $genre->load('books');

        // Mengembalikan respons data berhasil diperbarui
        return response()->json([
            'message' => 'Data genre berhasil diperbarui',
            'data' => $genre,
        ], 200);
    }

    /**
     * Menghapus data Genre berdasarkan ID (Destroy).
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

        try {
            // Menghapus data genre
            $genre->delete();

            // Mengembalikan respons data berhasil dihapus
            return response()->json([
                'message' => 'Data genre berhasil dihapus',
            ], 200);
        } catch (QueryException $e) {
            if ($e->getCode() == 23000 || str_contains($e->getMessage(), '1451')) {
                return response()->json([
                    'message' => 'Gagal menghapus data: Kategori/Genre ini tidak dapat dihapus karena masih memiliki relasi data buku.',
                    'error' => 'Integrity constraint violation: Data sedang digunakan pada tabel lain.'
                ], 409);
            }

            throw $e;
        }
    }
}
