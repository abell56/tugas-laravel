# Book Sales API (booksales-api)

Dokumentasi pembuatan dan konfigurasi RESTful API untuk sistem penjualan buku menggunakan Laravel.

---

## 📋 Prasyarat Sistem

Sebelum menjalankan proyek ini, pastikan sistem Anda telah terinstal software berikut:
* **PHP**: `>= 8.2` (dengan ekstensi `zip`, `pdo`, `mbstring`, `fileinfo` aktif di `php.ini`)
* **Composer**: `>= 2.x`
* **Git**: versi terbaru
* **Database**: MySQL / MariaDB (XAMPP / Laragon)

---

## 🚀 Langkah-Langkah Pengerjaan

### 1. Membuat Proyek Laravel Baru

Buka terminal/Command Prompt di direktori penyimpanan pilihan Anda, lalu jalankan perintah berikut:

```bash
composer create-project laravel/laravel booksales-api
```

Masuk ke direktori proyek:
```bash
cd booksales-api
```

---

### 2. Konfigurasi Lingkungan (.env)

Salin file `.env.example` menjadi `.env` (jika belum otomatis terbuat) dan sesuaikan pengaturan database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=booksales_db
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan perintah berikut untuk menghasilkan kunci aplikasi:
```bash
php artisan key:generate
```

---

### 3. Inisialisasi Git dan Commit Pertama

Inisialisasi repositori Git lokal dan lakukan commit awal:

```bash
git init
git add .
git commit -m "Initial commit - Laravel project setup"
```

---

### 4. Menghubungkan ke GitHub

1. Buka [GitHub](https://github.com) dan buat repositori baru bernama **`booksales-api-laravel`** (jangan centang README, .gitignore, atau lisensi).
2. Hubungkan repositori lokal Anda ke GitHub dan unggah (*push*) kode:

```bash
git branch -M main
git remote add origin https://github.com/USERNAME/booksales-api-laravel.git
git push -u origin main
```
> **Catatan:** Ganti `USERNAME` dengan nama pengguna GitHub Anda.

---

## 🛠️ Cara Menjalankan Proyek Lokal

1. Pastikan server MySQL di XAMPP/Laragon sudah dalam kondisi *Start*.
2. Jalankan perintah migrasi database (jika ada):
   ```bash
   php artisan migrate
   ```
3. Jalankan server lokal Laravel:
   ```bash
   php artisan serve
   ```
4. Akses API melalui browser atau Postman di:
   `http://127.0.0.1:8000`

---

## 📄 Struktur Proyek Utama
* `app/Http/Controllers/` - Menampung logika API/Controller.
* `routes/api.php` - Definisi rute endpoint RESTful API.
* `database/migrations/` - Struktur skema tabel database.