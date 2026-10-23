<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    protected $table = 'genres';

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Data array Genre
     */
    private static $genres = [
        [
            'id' => 1,
            'name' => 'Fiksi',
            'description' => 'Karya sastra imajinatif.'
        ],
        [
            'id' => 2,
            'name' => 'Non-Fiksi',
            'description' => 'Karya berdasarkan fakta dan sejarah.'
        ],
        [
            'id' => 3,
            'name' => 'Misteri',
            'description' => 'Cerita bertema teka-teki dan detektif.'
        ],
        [
            'id' => 4,
            'name' => 'Pengembangan Diri',
            'description' => 'Buku motivasi dan peningkatan kualitas diri.'
        ],
        [
            'id' => 5,
            'name' => 'Teknologi',
            'description' => 'Buku seputar pemrograman, database, dan AI.'
        ]
    ];

    /**
     * Mengambil seluruh data array Genre
     *
     * @param  array|mixed  $columns
     * @return \Illuminate\Support\Collection
     */
    public static function all($columns = ['*'])
    {
        return collect(self::$genres);
    }

    /**
     * Mengambil 1 data Genre berdasarkan ID
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
