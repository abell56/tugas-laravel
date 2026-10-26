<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            [
                'id' => 1,
                'description' => 'Bumi Manusia - Novel Sejarah',
                'price' => 130000.00,
                'stock' => 27,
                'cover_photo' => 'bumi_manusia.jpg',
                'genre_id' => 1,
                'author_id' => 1,
            ],
            [
                'id' => 2,
                'description' => 'Bumi - Novel Petualangan',
                'price' => 95000.00,
                'stock' => 15,
                'cover_photo' => 'bumi.jpg',
                'genre_id' => 1,
                'author_id' => 2,
            ],
            [
                'id' => 3,
                'description' => 'Laskar Pelangi - Novel Inspiratif',
                'price' => 88000.00,
                'stock' => 30,
                'cover_photo' => 'laskar_pelangi.jpg',
                'genre_id' => 1,
                'author_id' => 3,
            ],
            [
                'id' => 4,
                'description' => 'Perahu Kertas - Novel Romantis',
                'price' => 90000.00,
                'stock' => 25,
                'cover_photo' => 'perahu_kertas.jpg',
                'genre_id' => 1,
                'author_id' => 4,
            ],
            [
                'id' => 5,
                'description' => 'Garis Waktu - Novel Romansa & Perjalanan',
                'price' => 85000.00,
                'stock' => 20,
                'cover_photo' => 'garis_waktu.jpg',
                'genre_id' => 1,
                'author_id' => 5,
            ],
        ];

        foreach ($books as $book) {
            Book::updateOrCreate(['id' => $book['id']], $book);
        }
    }
}
