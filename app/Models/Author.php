<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    use HasFactory;

    protected $table = 'authors';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'photo',
        'bio',
    ];

    /**
     * Relasi ke model Book
     */
    public function books()
    {
        return $this->hasMany(Book::class, 'author_id');
    }
}
