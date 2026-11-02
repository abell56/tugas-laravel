<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class BookController extends Controller
{
    /**
     * Menampilkan seluruh data Book beserta relasi author dan genre dalam format JSON (Read All).
     */
    public function index()
    {
        // Mengambil seluruh data buku dengan eager loading relasi author dan genre
        $books = Book::with(['author', 'genre'])->get();

        return response()->json($books, 200);
    }

    /**
     * Menyimpan data Book baru ke database (Create).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'cover_photo' => 'required|string|max:255',
            'genre_id' => 'required|exists:genres,id',
            'author_id' => 'required|exists:authors,id',
        ]);

        $book = Book::create($validated);
        $book->load(['author', 'genre']);

        return response()->json([
            'message' => 'Data buku berhasil ditambahkan',
            'data' => $book,
        ], 201);
    }

    /**
     * Menampilkan detail data Book berdasarkan ID beserta relasi author dan genre (Show).
     */
    public function show($id)
    {
        // Mengambil data buku beserta relasi Model author dan genre
        $book = Book::with(['author', 'genre'])->find($id);

        if (!$book) {
            return response()->json([
                'message' => 'Data buku tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'message' => 'Detail data buku',
            'data' => $book,
        ], 200);
    }

    /**
     * Memperbarui data Book berdasarkan ID (Update).
     */
    public function update(Request $request, $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'message' => 'Data buku tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'cover_photo' => 'sometimes|required|string|max:255',
            'genre_id' => 'sometimes|required|exists:genres,id',
            'author_id' => 'sometimes|required|exists:authors,id',
        ]);

        $book->update($validated);
        $book->load(['author', 'genre']);

        return response()->json([
            'message' => 'Data buku berhasil diperbarui',
            'data' => $book,
        ], 200);
    }

    /**
     * Menghapus data Book berdasarkan ID (Destroy).
     */
    public function destroy($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'message' => 'Data buku tidak ditemukan',
            ], 404);
        }

        try {
            $book->delete();

            return response()->json([
                'message' => 'Data buku berhasil dihapus',
            ], 200);
        } catch (QueryException $e) {
            // Tangani error foreign key constraint (SQLSTATE 23000 / error code 1451)
            if ($e->getCode() == 23000 || str_contains($e->getMessage(), '1451')) {
                return response()->json([
                    'message' => 'Gagal menghapus data: Buku ini tidak dapat dihapus karena masih terkait dengan data transaksi.',
                    'error' => 'Integrity constraint violation: Data sedang digunakan pada tabel lain.'
                ], 409);
            }

            throw $e;
        }
    }
}
