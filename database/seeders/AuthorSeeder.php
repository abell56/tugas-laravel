<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = [
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

        foreach ($authors as $author) {
            Author::updateOrCreate(['id' => $author['id']], $author);
        }
    }
}
