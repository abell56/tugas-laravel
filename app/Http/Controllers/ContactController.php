<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Mengambil seluruh pesan kontak yang dikirim oleh pengguna (Untuk Admin)
     */
    public function index()
    {
        $messages = Contact::orderBy('id', 'desc')->get();
        return response()->json($messages, 200);
    }

    /**
     * Menyimpan pesan baru dari formulir kontak pengguna ke database (Contact to Admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'message.required' => 'Pesan tidak boleh kosong.',
        ]);

        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'] ?? 'Pertanyaan Buku',
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Pesan Anda berhasil dikirim ke Admin Bookstore. Terima kasih atas masukan Anda!',
            'data' => $contact,
        ], 201);
    }

    /**
     * Menghapus pesan kontak dari database
     */
    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json(['message' => 'Pesan tidak ditemukan.'], 404);
        }

        $contact->delete();

        return response()->json(['message' => 'Pesan berhasil dihapus.'], 200);
    }
}
