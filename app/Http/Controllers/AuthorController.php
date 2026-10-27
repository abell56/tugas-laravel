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
        // Mengambil data dari Model Author
        $authors = Author::all();

        // Mengembalikan data dalam format JSON
        return response()->json($authors, 200);
    }
}
