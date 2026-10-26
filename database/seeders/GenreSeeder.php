<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genres = [
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

        foreach ($genres as $genre) {
            Genre::updateOrCreate(['id' => $genre['id']], $genre);
        }
    }
}
