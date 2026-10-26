# Book Sales (booksales-api)

Aplikasi pengelolaan data penjualan buku dan katalog berbasis framework Laravel dengan implementasi arsitektur **Model-View-Controller (MVC)**.

---

## 📋 Prasyarat Sistem

Sebelum menjalankan proyek ini, pastikan sistem Anda telah terinstal software berikut:
* **PHP**: `>= 8.2` (dengan ekstensi `zip`, `pdo`, `mbstring`, `fileinfo` aktif di `php.ini`)
* **Composer**: `>= 2.x`
* **Git**: versi terbaru
* **Database**: MySQL / MariaDB (XAMPP / Laragon)

---

## 🚀 Langkah Instalasi & Menjalankan Proyek

### 1. Clone Repositori & Masuk Direktori
```bash
git clone https://github.com/abell56/tugas-laravel.git
cd booksales-api
```

### 2. Instalasi Dependensi PHP
```bash
composer install
```

### 3. Konfigurasi Lingkungan (.env)
Salin file `.env.example` menjadi `.env` (jika belum ada) dan sesuaikan konfigurasi database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_penjualan_buku
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=file
QUEUE_CONNECTION=sync
CACHE_STORE=file
```

Generate application key:
```bash
php artisan key:generate
```

### 4. Menjalankan Server Lokal
Jalankan development server Laravel:
```bash
php artisan serve
```
Akses aplikasi melalui browser di: `http://127.0.0.1:8000`

---

## 📁 Implementasi Arsitektur MVC

Proyek ini menerapkan konsep **Model-View-Controller (MVC)** untuk entitas **Genre**, **Author**, dan **Book**:

```
[ Browser / Client ]
        │
        ▼ (Request HTTP)
[ routes/web.php ]
        │
        ▼
[ Controllers ] ──(Ambil Data)──► [ Models (Database / Eloquent) ]
 (GenreController, AuthorController,   (Genre.php, Author.php, Book.php)
  BookController)
        │
        ▼ (Kirim Data ke View)
[ Views (Blade) ]
 (genres/index.blade.php, authors/index.blade.php, books/index.blade.php)
```

### 1. Model (`app/Models/`)
* **`Genre.php`**: Model Eloquent untuk tabel `genres` (`id`, `name`, `description`) dengan relasi `books()`.
* **`Author.php`**: Model Eloquent untuk tabel `authors` (`id`, `name`, `photo`, `bio`) dengan relasi `books()`.
* **`Book.php`**: Model Eloquent untuk tabel `books` (`id`, `description`, `price`, `stock`, `cover_photo`, `genre_id`, `author_id`) dengan relasi `author()` dan `genre()`.

### 2. Controller (`app/Http/Controllers/`)
* **`GenreController.php`**: Mengambil data dari `Genre::all()` dan meneruskannya ke view `genres.index`.
* **`AuthorController.php`**: Mengambil data dari `Author::all()` dan meneruskannya ke view `authors.index`.
* **`BookController.php`**: Mengambil data dari `Book::with(['author', 'genre'])->get()` dan meneruskannya ke view `books.index`.

### 3. View (`resources/views/`)
* **`layouts/main.blade.php`**: Kerangka layout utama berbasis Bootstrap 5 dengan navbar responsif dan menu Home, Genre, Author, serta Book.
* **`genres/index.blade.php`**: Halaman tabel daftar genre buku.
* **`authors/index.blade.php`**: Halaman tabel daftar penulis (author) buku.
* **`books/index.blade.php`**: Halaman tabel daftar buku lengkap dengan cover, judul/deskripsi, penulis, genre, harga, dan stok.
* **`welcome.blade.php`**: Halaman beranda dengan navigasi ke fitur Genre, Author, dan Book.

---

## 🌐 Daftar Endpoint / Rute Halaman

| URL | Method | Controller & Method | Deskripsi |
| :--- | :---: | :--- | :--- |
| `/` | `GET` | Closure (`welcome.blade.php`) | Halaman beranda (Home) |
| `/genres` | `GET` | `GenreController@index` | Menampilkan daftar data Genre |
| `/authors` | `GET` | `AuthorController@index` | Menampilkan daftar data Author |
| `/books` | `GET` | `BookController@index` | Menampilkan daftar data Buku (Book) |

---

## 🗄️ Database Migration & Seeder

Struktur tabel dan data awal (dummy) telah disediakan melalui fitur Laravel Migration dan Seeder:

### 1. File Migration (`database/migrations/`)
* `2026_10_26_000001_create_genres_table.php`
* `2026_10_26_000002_create_authors_table.php`
* `2026_10_26_000003_create_books_table.php`

### 2. File Seeder (`database/seeders/`)
* `GenreSeeder.php`: Memuat 5 data dummy kategori buku.
* `AuthorSeeder.php`: Memuat 5 data dummy penulis buku.
* `BookSeeder.php`: Memuat 5 data dummy buku (Bumi Manusia, Bumi, Laskar Pelangi, Perahu Kertas, Garis Waktu).
* `DatabaseSeeder.php`: Menjalankan seluruh seeder di atas secara terurut.

### 3. Perintah Eksekusi Migration & Seeding
```bash
php artisan migrate
php artisan db:seed
```

---

## 📸 Hasil Tampilan Aplikasi

### 1. Halaman Beranda (Home)
![Halaman Beranda](docs/images/home.png)

### 2. Halaman Daftar Genre
![Daftar Genre Buku](docs/images/genres.png)

### 3. Halaman Daftar Penulis (Author)
![Daftar Penulis](docs/images/authors.png)

---

## 📄 Struktur Direktori Utama
* `app/Http/Controllers/` - Kontroler aplikasi (`GenreController.php`, `AuthorController.php`).
* `app/Models/` - Model pengelola data (`Genre.php`, `Author.php`, `User.php`).
* `resources/views/` - Template tampilan Blade (layout, views genre & author).
* `routes/web.php` - Definisi rute web aplikasi.
