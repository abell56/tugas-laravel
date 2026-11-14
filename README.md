# 📚 Bookstore - Fullstack Web Application (Laravel 12 + React.js)

Aplikasi Toko Buku Online Modern Fullstack yang menggabungkan kekuatan **Laravel 12** sebagai RESTful API Backend dan **React 19 SPA (Single Page Application)** dengan **Vite** serta **Bootstrap 5** sebagai antarmuka pengguna interaktif. Dilengkapi sistem autentikasi database nyata, integrasi gateway pembayaran **Midtrans Snap**, keranjang belanja (*shopping cart*), riwayat transaksi, hingga dashboard monitoring administrator.

---

## 🌟 Fitur Utama Aplikasi

### 👤 1. Skenario Pengguna / Customer
* **Autentikasi Akun**: Registrasi pengguna baru dan Login tersinkronisasi penuh dengan tabel `users` di database.
* **Katalog & Live Search**: Pencarian buku secara *real-time* berdasarkan judul, deskripsi, penulis, serta filter kategori/genre.
* **Keranjang Belanja (*Shopping Cart*)**: Tambah buku ke keranjang (*Add to Cart*), modifikasi jumlah eksemplar, badge counter dinamis di navbar, dan penyimpanan persisten di `localStorage`.
* **Pembayaran Digital (Midtrans Gateway)**:
  * Terintegrasi dengan **Midtrans Snap** (Sandbox).
  * Dilengkapi **Modal Simulator Pembayaran Interaktif** (QRIS, Virtual Account BCA, Mandiri, serta Bayar di Tempat / COD).
  * Pemotongan stok buku secara otomatis saat transaksi berhasil.
* **Riwayat Pesanan Pelanggan**: Halaman profil akun menampilkan daftar nomor pesanan (`ORD-YYYYMMDD-XXXX`), status pembayaran, detail buku, serta tombol *Beli Lagi*.
* **Profil Toko Buku (About Us)**: Halaman profil perusahaan lengkap dengan visi, misi, statistik pencapaian, dan pilar keunggulan.
* **Kontak ke Admin (Contact to Admin)**: Formulir pengiriman pesan, kritik, dan saran yang langsung tersimpan di database inbox admin.
* **Halaman Tim Kami (Team)**: Profil tim pengembang dan pengelola Bookstore.

### 🛡️ 2. Skenario Administrator (Dashboard `/admin`)
* **Kontrol Katalog Buku (CRUD)**: Tambah judul buku baru, edit informasi (harga, stok, cover, genre, penulis), dan hapus buku.
* **Manajemen Master Data**: Pengelolaan kategori/genre dan penulis (*author*) buku.
* **Monitoring Pesanan Masuk**: Pantau daftar transaksi pesanan pelanggan secara transparan lengkap dengan perhitungan total omzet penjualan.
* **Monitoring Pengguna & Ubah Role**:
  * Melihat seluruh daftar pengguna terdaftar di sistem.
  * Fitur **Ubah Role** langsung untuk mempromosikan customer menjadi admin atau sebaliknya.
* **Inbox Pesan Masuk (Contact Inbox)**: Membaca pesan masuk dari pelanggan dengan fitur filter pencarian, balas langsung via email (`mailto:`), dan hapus pesan.
* **Ringkasan Metrik Bisnis**: Kartu statistik *live* untuk total buku, pesanan masuk, total pengguna, pesan masuk, dan total kategori.

---

## 🏗️ Arsitektur Teknologi

```
[ Browser / Client ]
        │
        ├──► [ React 19 SPA (Vite + React Router + Bootstrap 5) ]
        │         │
        │         ├─► Public Routes: Home, About, Book, Cart, Team, Contact, Login, Register
        │         ├─► Customer Protected: Profile (Riwayat Pesanan)
        │         └─► Admin Protected: Admin Panel (Katalog, Pesanan, User, Genre, Author, Inbox)
        │
        ▼ (Axios HTTP / JSON)
[ Laravel 12 Backend API ]
        │
        ├─► routes/web.php (Single-Entry Blade View 'app.blade.php')
        ├─► routes/api.php (RESTful Endpoints)
        ├─► Midtrans Snap Integration (PaymentController)
        │
        ▼ (Eloquent ORM)
[ MySQL / MariaDB Database: db_penjualan_buku ]
  ├── users (id, name, email, password, role)
  ├── books (id, description, price, stock, cover_photo, genre_id, author_id)
  ├── genres (id, name, description)
  ├── authors (id, name, bio, photo)
  ├── transactions (id, order_number, customer_id, book_id, total_amount)
  └── contacts (id, name, email, subject, message, is_read, timestamps)
```

---

## 📋 Prasyarat Sistem

* **PHP**: `>= 8.2` (dengan ekstensi `pdo_mysql`, `mbstring`, `fileinfo`, `curl` aktif)
* **Node.js**: `>= 18.x` & **npm**
* **Composer**: `>= 2.x`
* **Web & Database Server**: XAMPP / Laragon (Apache & MySQL / MariaDB)

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Clone Repositori
```bash
git clone https://github.com/abell56/tugas-laravel.git
cd tugas-laravel
```

### 2. Instalasi Dependensi Backend (PHP / Composer)
```bash
composer install
```

### 3. Instalasi Dependensi Frontend (Node.js / npm)
```bash
npm install
```

### 4. Konfigurasi Lingkungan (`.env`)
Salin file `.env.example` menjadi `.env` dan sesuaikan koneksi database MySQL Anda:
```env
APP_NAME=Bookstore
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_penjualan_buku
DB_USERNAME=root
DB_PASSWORD=

# Kredensial Midtrans Sandbox (Opsional - Fallback Simulator Otomatis Tersedia)
MIDTRANS_SERVER_KEY=SB-Mid-server-test
MIDTRANS_CLIENT_KEY=SB-Mid-client-test
MIDTRANS_IS_PRODUCTION=false
```

Generate application key:
```bash
php artisan key:generate
```

### 5. Migrasi & Seeder Database
Jalankan migrasi tabel database dan masukkan data seeder:
```bash
php artisan migrate --seed
```

> **Akun Default untuk Uji Coba**:
> * **Akun Admin**:
>   * Email: `admin@bookstore.id`
>   * Password: `admin123`
>   * Role: `admin` (Akses penuh ke `/admin`)
> * **Akun Customer**:
>   * Email: `budi.santoso@gmail.com`
>   * Password: `user123`
>   * Role: `customer`

### 6. Build Aset Frontend
Lakukan build aset React dengan Vite:
```bash
npm run build
```
*(Atau jalankan `npm run dev` untuk mode hot-reload pengembangan)*

### 7. Jalankan Server Laravel
```bash
php artisan serve
```
Akses aplikasi melalui browser di: **`http://127.0.0.1:8000`**

---

## 🌐 Daftar Endpoint RESTful API

| Endpoint | Method | Format | Deskripsi & Hak Akses |
| :--- | :---: | :---: | :--- |
| **Autentikasi** | | | |
| `/api/register` | `POST` | `JSON` | Registrasi user baru (default role: `customer`) |
| `/api/login` | `POST` | `JSON` | Login user & verifikasi password bcrypt |
| `/api/logout` | `POST` | `JSON` | Logout & penghapusan session |
| `/api/me` | `GET` | `JSON` | Cek status autentikasi user saat ini |
| **Katalog & Master Data** | | | |
| `/api/books` | `GET` | `JSON` | Mengambil seluruh katalog buku (beserta relasi genre & author) |
| `/api/books/{id}` | `GET` | `JSON` | Detail spesifik buku |
| `/api/books` | `POST` | `JSON` | Tambah buku baru (Admin) |
| `/api/books/{id}` | `PUT/PATCH` | `JSON` | Perbarui data buku (Admin) |
| `/api/books/{id}` | `DELETE` | `JSON` | Hapus buku dari database (Admin) |
| `/api/genres` | `GET` | `JSON` | Daftar seluruh kategori / genre |
| `/api/genres` | `POST` / `PUT` / `DELETE` | `JSON` | CRUD Kategori (Admin) |
| `/api/authors` | `GET` | `JSON` | Daftar seluruh penulis / author |
| `/api/authors` | `POST` / `PUT` / `DELETE` | `JSON` | CRUD Penulis (Admin) |
| **Transaksi & Pembayaran** | | | |
| `/api/transactions` | `GET` | `JSON` | Riwayat transaksi (bisa difilter `customer_id` atau semua untuk admin) |
| `/api/transactions` | `POST` | `JSON` | Checkout pesanan buku & otomatis kurangi stok buku |
| `/api/transactions/{id}` | `DELETE` | `JSON` | Hapus riwayat pesanan (Admin) |
| `/api/payment/snap-token` | `POST` | `JSON` | Generate token transaksi Midtrans Snap |
| **Pengguna & Role** | | | |
| `/api/users` | `GET` | `JSON` | Daftar seluruh user terdaftar (Admin) |
| `/api/users/{id}/role` | `PUT` | `JSON` | Ubah role pengguna (`admin` <-> `customer`) |
| `/api/users/{id}` | `DELETE` | `JSON` | Hapus akun pengguna (Admin) |
| **Kontak & Pesan Masuk** | | | |
| `/api/contacts` | `POST` | `JSON` | Kirim pesan dari formulir kontak pelanggan |
| `/api/contacts` | `GET` | `JSON` | Daftar seluruh pesan masuk pelanggan (Admin Inbox) |
| `/api/contacts/{id}` | `DELETE` | `JSON` | Hapus pesan kontak dari sistem (Admin) |

---

## 📁 Struktur Direktori Penting

```
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php         # Handler autentikasi (Login, Register, Me)
│   │   ├── BookController.php         # Handler CRUD & relasi buku
│   │   ├── GenreController.php        # Handler kategori
│   │   ├── AuthorController.php       # Handler penulis
│   │   ├── TransactionController.php   # Handler order & stok
│   │   ├── PaymentController.php      # Handler Midtrans Snap Token
│   │   ├── UserController.php         # Handler monitoring user & edit role
│   │   └── ContactController.php      # Handler inbox pesan kontak
│   └── Models/                        # Eloquent Models (User, Book, Genre, Author, Transaction, Contact)
├── database/
│   ├── migrations/                    # File migrasi skema database
│   └── seeders/                       # Seeder data awal (User, Book, Genre, Author)
├── resources/
│   ├── views/
│   │   └── app.blade.php              # Blade view utama penyedia root DOM React
│   └── js/
│       ├── main.jsx                   # Entry point React
│       ├── App.jsx                    # Routing & Protected Routes
│       ├── components/                # Navbar, Footer, AdminBooks, AdminUsers, AdminOrders, AdminContacts
│       ├── context/                   # AuthContext & CartContext
│       └── pages/                     # Home, About, Book, Cart, Profile, Contact, Team, Admin, Login, Register
├── routes/
│   ├── web.php                        # SPA fallback router ke Blade app
│   └── api.php                        # Definisi RESTful API endpoints
└── vite.config.js                     # Konfigurasi Laravel Vite Plugin & React Plugin
```

---

## 🔒 Lisensi & Hak Cipta
Dikembangkan untuk pemenuhan tugas akhir program pembelajaran fullstack development. Bebas digunakan dan dikembangkan untuk tujuan edukasi.
