<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';

    public $timestamps = false;

    protected $fillable = [
        'order_number',
        'customer_id',
        'book_id',
        'total_amount',
    ];

    /**
     * Relasi ke model User (Customer)
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Alias relasi customer
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Relasi ke model Book (Buku)
     */
    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }
}
