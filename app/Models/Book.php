<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $table = 'books';

    public $timestamps = false;

    protected $fillable = [
        'description',
        'price',
        'stock',
        'cover_photo',
        'genre_id',
        'author_id',
    ];

    /**
     * Relasi ke model Author (Penulis)
     */
    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    /**
     * Relasi ke model Genre (Kategori)
     */
    public function genre()
    {
        return $this->belongsTo(Genre::class, 'genre_id');
    }

    /**
     * Accessor judul buku (diambil dari description)
     */
    public function getTitleAttribute()
    {
        return $this->description;
    }
}
