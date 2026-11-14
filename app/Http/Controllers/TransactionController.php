<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    /**
     * Menampilkan seluruh data transaksi atau pesanan berdasarkan customer
     */
    public function index(Request $request)
    {
        $query = Transaction::with(['customer', 'book.author', 'book.genre']);

        // Jika request membawa customer_id, filter berdasarkan customer tersebut
        if ($request->has('customer_id') && !empty($request->customer_id)) {
            $query->where('customer_id', $request->customer_id);
        }

        $transactions = $query->orderBy('id', 'desc')->get();

        return response()->json($transactions, 200);
    }

    /**
     * Menyimpan transaksi pesanan baru dari checkout keranjang (Checkout / Store)
     */
    public function store(Request $request)
    {
        // Ambil customer ID: dari request, atau dari auth, atau fallback customer pertama
        $customerId = $request->input('customer_id');
        if (!$customerId) {
            $defaultCustomer = User::where('role', 'customer')->first();
            $customerId = $defaultCustomer ? $defaultCustomer->id : 1;
        }

        $items = $request->input('items', []);
        $createdTransactions = [];

        // Buat nomor order induk yang unik
        $baseOrderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(4));

        if (!empty($items) && is_array($items)) {
            // Pemesanan beberapa buku sekaligus dari keranjang
            $counter = 1;
            foreach ($items as $item) {
                $bookId = $item['book_id'] ?? $item['id'];
                $price = $item['price'] ?? 0;
                $quantity = $item['quantity'] ?? 1;
                $totalAmount = $price * $quantity;

                $orderNumber = $baseOrderNumber . '-' . sprintf('%02d', $counter++);

                $trx = Transaction::create([
                    'order_number' => $orderNumber,
                    'customer_id' => $customerId,
                    'book_id' => $bookId,
                    'total_amount' => $totalAmount,
                ]);

                // Kurangi stok buku jika stok tersedia
                $book = Book::find($bookId);
                if ($book && $book->stock >= $quantity) {
                    $book->decrement('stock', $quantity);
                }

                $trx->load(['book', 'customer']);
                $createdTransactions[] = $trx;
            }
        } else {
            // Pemesanan buku tunggal (Direct Buy)
            $request->validate([
                'book_id' => 'required|exists:books,id',
                'total_amount' => 'required|numeric|min:0',
            ]);

            $orderNumber = $baseOrderNumber;

            $trx = Transaction::create([
                'order_number' => $orderNumber,
                'customer_id' => $customerId,
                'book_id' => $request->book_id,
                'total_amount' => $request->total_amount,
            ]);

            $book = Book::find($request->book_id);
            if ($book && $book->stock > 0) {
                $book->decrement('stock', 1);
            }

            $trx->load(['book', 'customer']);
            $createdTransactions[] = $trx;
        }

        return response()->json([
            'message' => 'Pesanan berhasil dibuat dan tercatat di database!',
            'order_number' => $baseOrderNumber,
            'total_items' => count($createdTransactions),
            'data' => $createdTransactions,
        ], 201);
    }

    /**
     * Menampilkan detail pesanan berdasarkan ID
     */
    public function show($id)
    {
        $transaction = Transaction::with(['customer', 'book.author', 'book.genre'])->find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        return response()->json($transaction, 200);
    }

    /**
     * Menghapus transaksi
     */
    public function destroy($id)
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        $transaction->delete();
        return response()->json(['message' => 'Transaksi berhasil dihapus'], 200);
    }
}
