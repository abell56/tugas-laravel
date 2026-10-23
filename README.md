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

Proyek ini menerapkan konsep **Model-View-Controller (MVC)** untuk entitas **Genre** dan **Author**:

```
[ Browser / Client ]
        │
        ▼ (Request HTTP)
[ routes/web.php ]
        │
        ▼
[ Controllers ] ──(Ambil Data)──► [ Models (Data Array) ]
 (GenreController, AuthorController)     (Genre.php, Author.php)
        │
        ▼ (Kirim Data ke View)
[ Views (Blade) ]
 (genres/index.blade.php, authors/index.blade.php)
```

### 1. Model (`app/Models/`)
* **`Genre.php`**: Mengelola data array genre buku (`id`, `name`, `description`) dengan method `all()` dan `find($id)`.
* **`Author.php`**: Mengelola data array penulis buku (`id`, `name`, `photo`, `bio`) dengan method `all()` dan `find($id)`.

### 2. Controller (`app/Http/Controllers/`)
* **`GenreController.php`**: Mengambil data dari `Genre::all()` dan meneruskannya ke view `genres.index`.
* **`AuthorController.php`**: Mengambil data dari `Author::all()` dan meneruskannya ke view `authors.index`.

### 3. View (`resources/views/`)
* **`layouts/main.blade.php`**: Kerangka layout utama berbasis Bootstrap 5 dengan navbar responsif dan navigasi aktif.
* **`genres/index.blade.php`**: Halaman tabel daftar genre buku.
* **`authors/index.blade.php`**: Halaman tabel daftar penulis (author) buku.
* **`welcome.blade.php`**: Halaman beranda yang menghubungkan navigasi ke fitur Genre dan Author.

---

## 🌐 Daftar Endpoint / Rute Halaman

| URL | Method | Controller & Method | Deskripsi |
| :--- | :---: | :--- | :--- |
| `/` | `GET` | Closure (`welcome.blade.php`) | Halaman beranda (Home) |
| `/genres` | `GET` | `GenreController@index` | Menampilkan daftar data Genre |
| `/authors` | `GET` | `AuthorController@index` | Menampilkan daftar data Author |

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
