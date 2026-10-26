<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
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
                $table->foreignId('genre_id')->constrained('genres')->onDelete('cascade');
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
