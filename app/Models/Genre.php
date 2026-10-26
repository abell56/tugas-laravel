<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasFactory;

    protected $table = 'genres';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Relasi ke model Book
     */
    public function books()
    {
        return $this->hasMany(Book::class, 'genre_id');
    }
}
