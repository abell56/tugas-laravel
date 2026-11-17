<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class AuthorController extends Controller
{
    /**
     * Menampilkan seluruh data Author beserta relasi buku dalam format JSON (Read All).
     */
    public function index()
    {
        // Mengambil seluruh data dari Model Author beserta relasi buku (books)
        $authors = Author::with('books')->get();

        // Mengembalikan data dalam format JSON
        return response()->json($authors, 200);
    }

    /**
     * Menyimpan data Author baru ke database (Create).
     */
    public function store(Request $request)
    {
        // Validasi input data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        if (empty($validated['photo'])) {
            $validated['photo'] = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop';
        }
        if (empty($validated['bio'])) {
            $validated['bio'] = 'Penulis sastra dan naskah literasi.';
        }

        // Menyimpan data author baru
        $author = Author::create($validated);

        // Mengembalikan respons dalam format JSON dengan status HTTP 201 (Created)
        return response()->json([
            'message' => 'Data author berhasil ditambahkan',
            'data' => $author,
        ], 201);
    }

    /**
     * Menampilkan detail data Author berdasarkan ID beserta relasi buku (Show).
     */
    public function show($id)
    {
        // Mencari data author berdasarkan ID beserta relasi Model buku (books)
        $author = Author::with('books')->find($id);

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
     * Memperbarui data Author berdasarkan ID (Update).
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
            'name' => 'sometimes|required|string|max:255',
            'photo' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        if (array_key_exists('photo', $validated) && empty($validated['photo'])) {
            $validated['photo'] = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop';
        }
        if (array_key_exists('bio', $validated) && empty($validated['bio'])) {
            $validated['bio'] = 'Penulis sastra dan naskah literasi.';
        }

        // Memperbarui data author
        $author->update($validated);
        $author->load('books');

        // Mengembalikan respons data berhasil diperbarui
        return response()->json([
            'message' => 'Data author berhasil diperbarui',
            'data' => $author,
        ], 200);
    }

    /**
     * Menghapus data Author berdasarkan ID (Destroy).
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

        try {
            // Menghapus data author
            $author->delete();

            // Mengembalikan respons data berhasil dihapus
            return response()->json([
                'message' => 'Data author berhasil dihapus',
            ], 200);
        } catch (QueryException $e) {
            if ($e->getCode() == 23000 || str_contains($e->getMessage(), '1451')) {
                return response()->json([
                    'message' => 'Gagal menghapus data: Penulis ini tidak dapat dihapus karena masih memiliki relasi data buku.',
                    'error' => 'Integrity constraint violation: Data sedang digunakan pada tabel lain.'
                ], 409);
            }

            throw $e;
        }
    }
}
