import { Link } from 'react-router'

function About() {
  return (
    <div className="container my-5">
      {/* Hero / Header Profil Toko Buku */}
      <div className="row align-items-center g-5 py-4 mb-5">
        <div className="col-lg-6">
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-3 fw-semibold">
            Profil Resmi Bookstore
          </span>
          <h1 className="display-5 fw-bold lh-sm text-dark mb-3">
            Membuka Jendela Dunia, <span className="text-primary">Satu Halaman Sekaligus</span>
          </h1>
          <p className="lead text-secondary mb-4">
            Selamat datang di <strong>Bookstore</strong>, gerbang literasi modern yang menghadirkan ribuan koleksi buku original, terkurasi, dan menginspirasi untuk pembaca di seluruh pelosok Indonesia.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/book" className="btn btn-primary btn-lg px-4 gap-3 shadow-sm">
              <i className="fa-solid fa-book-open me-2"></i>Jelajahi Katalog Buku
            </Link>
            <Link to="/contact" className="btn btn-outline-secondary btn-lg px-4">
              <i className="fa-solid fa-envelope me-2"></i>Hubungi Kami
            </Link>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <div className="position-relative">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
              alt="Perpustakaan & Koleksi Bookstore"
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
            />
            <div
              className="position-absolute bottom-0 start-0 m-4 p-3 bg-white rounded-3 shadow-sm text-start d-none d-md-block"
              style={{ maxWidth: '280px' }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="text-bg-warning p-2 rounded-circle text-white">
                  <i className="fa-solid fa-medal fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">100% Original</h6>
                  <small className="text-muted">Penerbit Resmi & Bergaransi</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Pencapaian */}
      <div className="row g-4 text-center my-5 py-4 bg-light rounded-4 border">
        <div className="col-6 col-md-3">
          <h2 className="fw-bold text-primary mb-1">500+</h2>
          <p className="text-secondary small fw-semibold mb-0">Judul Buku Terkurasi</p>
        </div>
        <div className="col-6 col-md-3">
          <h2 className="fw-bold text-primary mb-1">10.000+</h2>
          <p className="text-secondary small fw-semibold mb-0">Eksemplar Terjual</p>
        </div>
        <div className="col-6 col-md-3">
          <h2 className="fw-bold text-primary mb-1">50+</h2>
          <p className="text-secondary small fw-semibold mb-0">Mitra Penulis & Penerbit</p>
        </div>
        <div className="col-6 col-md-3">
          <h2 className="fw-bold text-primary mb-1">99.8%</h2>
          <p className="text-secondary small fw-semibold mb-0">Kepuasan Pelanggan</p>
        </div>
      </div>

      {/* Cerita & Sejarah Bookstore */}
      <div className="row align-items-center g-5 my-5">
        <div className="col-lg-6 order-lg-2">
          <span className="badge bg-secondary-subtle text-secondary px-3 py-1 rounded-pill mb-2">Tentang Kami</span>
          <h2 className="fw-bold text-dark mb-3">Dedikasi untuk Budaya Membaca</h2>
          <p className="text-secondary">
            Didirikan dengan semangat meningkatkan minat baca anak bangsa, <strong>Bookstore</strong> berawal dari inisiatif sederhana untuk memudahkan pecinta buku menemukan karya bermutu tanpa khawatir buku bajakan.
          </p>
          <p className="text-secondary">
            Kini, Bookstore telah berkembang menjadi platform e-commerce buku modern terintegrasi dengan teknologi mutakhir: katalog live search real-time, keranjang belanja praktis, sistem pembayaran digital otomatis melalui <em>Midtrans Gateway</em>, serta pemantauan pesanan yang transparan.
          </p>
          <div className="mt-4">
            <Link to="/team" className="btn btn-outline-primary rounded-pill px-4">
              <i className="fa-solid fa-users me-2"></i>Kenali Tim di Balik Bookstore
            </Link>
          </div>
        </div>
        <div className="col-lg-6 order-lg-1">
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
            alt="Suasana Membaca Nyaman"
            className="img-fluid rounded-4 shadow"
            style={{ maxHeight: '380px', width: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="row g-4 my-5">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4 p-lg-5 bg-primary text-white rounded-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-white text-primary p-3 rounded-circle fs-4">
                <i className="fa-solid fa-eye"></i>
              </div>
              <h3 className="fw-bold mb-0">Visi Kami</h3>
            </div>
            <p className="lead fs-6 mb-0 opacity-90">
              Menjadi platform toko buku digital paling terpercaya, terlengkap, dan paling mudah diakses di Indonesia yang menginspirasi lahirnya generasi literat, berpengetahuan luas, dan berdaya saing global.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4 p-lg-5 bg-white rounded-4 border">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-primary-subtle text-primary p-3 rounded-circle fs-4">
                <i className="fa-solid fa-bullseye"></i>
              </div>
              <h3 className="fw-bold mb-0 text-dark">Misi Kami</h3>
            </div>
            <ul className="text-secondary mb-0 ps-3">
              <li className="mb-2">Menyediakan buku-buku original berkualitas dari berbagai genre: teknologi, sains, sastra, bisnis, dan pengembangan diri.</li>
              <li className="mb-2">Menghadirkan pengalaman belanja online yang ramah pengguna, aman, dan bergaransi dengan teknologi modern.</li>
              <li className="mb-0">Membangun kolaborasi erat bersama penulis lokal dan penerbit nasional untuk memajukan industri perbukuan Indonesia.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 Pilar Keunggulan Bookstore */}
      <div className="my-5 py-4 border-top">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Mengapa Memilih Kami</span>
          <h2 className="fw-bold text-dark">Keunggulan Layanan Bookstore</h2>
        </div>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm p-4 text-center h-100 rounded-3">
              <div className="text-primary fs-1 mb-3">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <h5 className="fw-bold text-dark">100% Original</h5>
              <p className="text-secondary small mb-0">
                Semua buku dikirim langsung dari penerbit resmi dengan jaminan keaslian tanpa kompromi.
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm p-4 text-center h-100 rounded-3">
              <div className="text-success fs-1 mb-3">
                <i className="fa-solid fa-credit-card"></i>
              </div>
              <h5 className="fw-bold text-dark">Pembayaran Digital Midtrans</h5>
              <p className="text-secondary small mb-0">
                Transaksi praktis dan terproteksi lewat QRIS, Virtual Account, kartu kredit, atau bayar di tempat.
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm p-4 text-center h-100 rounded-3">
              <div className="text-warning fs-1 mb-3">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <h5 className="fw-bold text-dark">Pengemasan & Kirim Cepat</h5>
              <p className="text-secondary small mb-0">
                Buku dikemas dengan bubble wrap tebal dan kardus pelindung agar tiba dalam kondisi sempurna.
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm p-4 text-center h-100 rounded-3">
              <div className="text-info fs-1 mb-3">
                <i className="fa-solid fa-headset"></i>
              </div>
              <h5 className="fw-bold text-dark">Bantuan Admin Responsif</h5>
              <p className="text-secondary small mb-0">
                Punya pertanyaan atau kendala? Hubungi tim admin melalui formulir kontak atau WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About