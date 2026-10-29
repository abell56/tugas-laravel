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

    /**
     * Menampilkan detail data Author berdasarkan ID
     */
    public function show($id)
    {
        // Mencari data author berdasarkan ID
        $author = Author::find($id);

        // Validasi jika data tidak ditemukan
        if (!$author) {
            return response()->json([
                'message' => 'Data author tidak ditemukan',
            ], 404);
        }

        // Mengembalikan respons detail data author
        return response()->json([
            'message' => 'Detail data author',
            'data' => $author,
        ], 200);
    }

    /**
     * Memperbarui data Author berdasarkan ID
     */
    public function update(Request $request, $id)
    {
        // Mencari data author berdasarkan ID
        $author = Author::find($id);

        // Validasi jika data tidak ditemukan
        if (!$author) {
            return response()->json([
                'message' => 'Data author tidak ditemukan',
            ], 404);
        }

        // Validasi input data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => 'required|string|max:255',
            'bio' => 'required|string',
        ]);

        // Memperbarui data author
        $author->update($validated);

        // Mengembalikan respons data berhasil diperbarui
        return response()->json([
            'message' => 'Data author berhasil diperbarui',
            'data' => $author,
        ], 200);
    }

    /**
     * Menghapus data Author berdasarkan ID
     */
    public function destroy($id)
    {
        // Mencari data author berdasarkan ID
        $author = Author::find($id);

        // Validasi jika data tidak ditemukan
        if (!$author) {
            return response()->json([
                'message' => 'Data author tidak ditemukan',
            ], 404);
        }

        // Menghapus data author
        $author->delete();

        // Mengembalikan respons data berhasil dihapus
        return response()->json([
            'message' => 'Data author berhasil dihapus',
        ], 200);
    }
}
