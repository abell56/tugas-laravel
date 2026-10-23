<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $table = 'authors';

    protected $fillable = [
        'name',
        'photo',
        'bio',
    ];

    /**
     * Data array Author
     */
    private static $authors = [
        [
            'id' => 1,
            'name' => 'Pramoedya Ananta Toer',
            'photo' => 'pram.jpg',
            'bio' => 'Sastrawan terkemuka Indonesia.'
        ],
        [
            'id' => 2,
            'name' => 'Tere Liye',
            'photo' => 'tereliye.jpg',
            'bio' => 'Penulis novel populer Indonesia.'
        ],
        [
            'id' => 3,
            'name' => 'Andrea Hirata',
            'photo' => 'andrea.jpg',
            'bio' => 'Penulis novel Laskar Pelangi.'
        ],
        [
            'id' => 4,
            'name' => 'Dee Lestari',
            'photo' => 'dee.jpg',
            'bio' => 'Penulis seri Perahu Kertas dan Supernova.'
        ],
        [
            'id' => 5,
            'name' => 'Fiersa Besari',
            'photo' => 'fiersa.jpg',
            'bio' => 'Penulis dan pemusik Indonesia.'
        ]
    ];

    /**
     * Mengambil seluruh data array Author
     *
     * @param  array|mixed  $columns
     * @return \Illuminate\Support\Collection
     */
    public static function all($columns = ['*'])
    {
        return collect(self::$authors);
    }

    /**
     * Mengambil 1 data Author berdasarkan ID
     *
     * @param  int  $id
     * @param  array|mixed  $columns
     * @return array|null
     */
    public static function find($id, $columns = ['*'])
    {
        return static::all()->firstWhere('id', $id);
    }
}
