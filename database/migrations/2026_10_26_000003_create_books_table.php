<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Mengatur struktur tabel books serta relasi dengan tabel genres dan authors menggunakan foreignId.
     */
    public function up(): void
    {
        if (!Schema::hasTable('books')) {
            Schema::create('books', function (Blueprint $table) {
                $table->id();
                $table->text('description');
                $table->decimal('price', 10, 2);
                $table->integer('stock');
                $table->string('cover_photo', 255);

                // Mengatur relasi ke tabel genres menggunakan foreignId dengan cascade on delete
                $table->foreignId('genre_id')->constrained('genres')->onDelete('cascade');

                // Mengatur relasi ke tabel authors menggunakan foreignId dengan cascade on delete
                $table->foreignId('author_id')->constrained('authors')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
