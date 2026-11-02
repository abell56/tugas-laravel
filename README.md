# Book Sales (booksales-api)

Aplikasi pengelolaan data penjualan buku dan katalog berbasis framework Laravel dengan implementasi arsitektur **Model-View-Controller (MVC)** dan **RESTful API**.

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

## 📁 Implementasi Arsitektur RESTful API & Relasi Model

Proyek ini mengimplementasikan arsitektur **RESTful API** berbasis JSON untuk entitas **Book**, **Author**, dan **Genre** dengan relasi antar Model:

```
[ Client / Postman ]
        │
        ├─► [ routes/api.php ]
        │         │
        │         ├─► [ Middleware: admin ] (Read All & Destroy)
        │         └─► [ Middleware: customer ] (Create, Update, & Show)
        │
        ▼
[ Controllers ] ──(Eager Loading: with)──► [ Models (Database / Eloquent) ]
 (BookController, AuthorController,         (Book.php, Author.php, Genre.php)
  GenreController)                                  │
                                             (foreignId relation)
                                                    │
        ◄─────────────────(Return JSON Response)────┘
[ JSON Output (HTTP 200 / 201 / 401 / 403 / 404) ]
```

### 1. Mengambil Data dari Relasi Model (Eager Loading)
Data relasi antar model diambil secara optimal menggunakan fitur Eager Loading (`with()`):
* **`Book`**: Memuat relasi ke model `Author` (`belongsTo`) dan `Genre` (`belongsTo`):
  * `Book::with(['author', 'genre'])->get()` (Read All)
  * `Book::with(['author', 'genre'])->find($id)` (Show Detail)
* **`Author`**: Memuat relasi ke model `Book` (`hasMany`):
  * `Author::with('books')->get()` (Read All)
  * `Author::with('books')->find($id)` (Show Detail)
* **`Genre`**: Memuat relasi ke model `Book` (`hasMany`):
  * `Genre::with('books')->get()` (Read All)
  * `Genre::with('books')->find($id)` (Show Detail)

### 2. Mengatur Relasi di Migration dengan `foreignId`
Relasi antar tabel diatur menggunakan `foreignId()` pada migration tabel `books` (`database/migrations/2026_10_26_000003_create_books_table.php`):
```php
// Mengatur relasi ke tabel genres menggunakan foreignId
$table->foreignId('genre_id')->constrained('genres')->onDelete('cascade');

// Mengatur relasi ke tabel authors menggunakan foreignId
$table->foreignId('author_id')->constrained('authors')->onDelete('cascade');
```

### 3. Pengaturan Hak Akses Routing (`routes/api.php`)
Routing endpoint dikelompokkan berdasarkan hak akses menggunakan middleware:
* **Admin Only (`admin`)**:
  * **Read All (`index`)**: Menampilkan seluruh data entitas.
  * **Destroy (`destroy`)**: Menghapus data entitas berdasarkan ID.
* **Customer Authenticated Only (`customer`)**:
  * **Create (`store`)**: Menambahkan data baru.
  * **Update (`update`)**: Memperbarui data yang ada.
  * **Show (`show`)**: Menampilkan detail data entitas beserta relasinya.

---

## 🌐 Daftar Endpoint API

| Endpoint | Method | Middleware | Controller & Method | Format Output | Deskripsi & Hak Akses |
| :--- | :---: | :---: | :--- | :---: | :--- |
| `/api/books` | `GET` | `admin` | `BookController@index` | `JSON` | Read All Buku beserta relasi Penulis & Genre (Admin) |
| `/api/books` | `POST` | `customer` | `BookController@store` | `JSON` | Create Buku baru (Customer Terautentikasi) |
| `/api/books/{id}` | `GET` | `customer` | `BookController@show` | `JSON` | Show Detail Buku beserta relasi (Customer Terautentikasi) |
| `/api/books/{id}` | `PUT/PATCH` | `customer` | `BookController@update` | `JSON` | Update Buku berdasarkan ID (Customer Terautentikasi) |
| `/api/books/{id}` | `DELETE` | `admin` | `BookController@destroy` | `JSON` | Destroy Buku berdasarkan ID (Admin) |
| `/api/authors` | `GET` | `admin` | `AuthorController@index` | `JSON` | Read All Penulis beserta daftar bukunya (Admin) |
| `/api/authors` | `POST` | `customer` | `AuthorController@store` | `JSON` | Create Penulis baru (Customer Terautentikasi) |
| `/api/authors/{id}` | `GET` | `customer` | `AuthorController@show` | `JSON` | Show Detail Penulis beserta daftar bukunya (Customer Terautentikasi) |
| `/api/authors/{id}` | `PUT/PATCH` | `customer` | `AuthorController@update` | `JSON` | Update Penulis berdasarkan ID (Customer Terautentikasi) |
| `/api/authors/{id}` | `DELETE` | `admin` | `AuthorController@destroy` | `JSON` | Destroy Penulis berdasarkan ID (Admin) |
| `/api/genres` | `GET` | `admin` | `GenreController@index` | `JSON` | Read All Genre/Kategori beserta daftar bukunya (Admin) |
| `/api/genres` | `POST` | `customer` | `GenreController@store` | `JSON` | Create Genre baru (Customer Terautentikasi) |
| `/api/genres/{id}` | `GET` | `customer` | `GenreController@show` | `JSON` | Show Detail Genre beserta daftar bukunya (Customer Terautentikasi) |
| `/api/genres/{id}` | `PUT/PATCH` | `customer` | `GenreController@update` | `JSON` | Update Genre berdasarkan ID (Customer Terautentikasi) |
| `/api/genres/{id}` | `DELETE` | `admin` | `GenreController@destroy` | `JSON` | Destroy Genre berdasarkan ID (Admin) |

---

## 🗄️ Database Migration & Seeder

Struktur tabel dan data awal (dummy) telah disediakan melalui fitur Laravel Migration dan Seeder:

### 1. File Migration (`database/migrations/`)
* `0001_01_01_000000_create_users_table.php`: Tabel `users` dengan kolom `role` (`admin` / `customer`).
* `2026_10_26_000001_create_genres_table.php`: Tabel `genres`.
* `2026_10_26_000002_create_authors_table.php`: Tabel `authors`.
* `2026_10_26_000003_create_books_table.php`: Tabel `books` dengan foreignId relasi `genre_id` dan `author_id`.

### 2. File Seeder (`database/seeders/`)
* `UserSeeder.php`: Akun `admin@booksales.test` dan `customer@booksales.test`.
* `GenreSeeder.php`: 5 kategori buku dummy.
* `AuthorSeeder.php`: 5 penulis dummy.
* `BookSeeder.php`: 5 buku dummy dengan relasi genre dan author.
* `DatabaseSeeder.php`: Menjalankan seluruh seeder secara terurut.

### 3. Perintah Eksekusi Migration & Seeding
```bash
php artisan migrate:fresh --seed
```

---

## 📄 Struktur Direktori Utama
* `app/Http/Controllers/` - Kontroler API (`BookController.php`, `AuthorController.php`, `GenreController.php`).
* `app/Http/Middleware/` - Middleware proteksi (`AdminMiddleware.php`, `CustomerMiddleware.php`).
* `app/Models/` - Model Eloquent (`Book.php`, `Author.php`, `Genre.php`, `User.php`).
* `database/migrations/` - Migration skema database dengan relasi `foreignId`.
* `routes/api.php` - Definisi endpoint RESTful API aplikasi sesuai hak akses Admin & Customer.
