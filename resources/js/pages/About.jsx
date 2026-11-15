import { Link } from 'react-router'

function About() {
  return (
    <div className="container py-5">
      {/* Hero / Header Profil Toko Buku */}
      <div className="row align-items-center g-5 py-4 mb-5">
        <div className="col-lg-6">
          <span
            className="badge rounded-pill px-3 py-1 mb-3 fw-semibold"
            style={{
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(200, 90, 50, 0.25)',
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <i className="fa-solid fa-feather me-1"></i> Profil Kurasi Bookstore
          </span>
          <h1 className="editorial-heading display-5 fw-bold mb-3" style={{ lineHeight: '1.25' }}>
            Membuka jendela dunia, <span style={{ color: 'var(--accent-primary)', fontStyle: 'italic', fontWeight: 400 }}>satu halaman sekaligus</span>.
          </h1>
          <p className="lead mb-4" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.75' }}>
            Selamat datang di <strong>Bookstore</strong>, sebuah ruang literasi independen yang mendedikasikan diri untuk merawat kecintaan membaca melalui koleksi naskah bermutu, terbitan resmi, dan kurasi berbobot bagi pembaca di seluruh Indonesia.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/book" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2">
              <i className="fa-solid fa-book-open"></i>
              <span>Jelajahi Katalog Buku</span>
            </Link>
            <Link to="/contact" className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2">
              <i className="fa-regular fa-envelope"></i>
              <span>Hubungi Kurator</span>
            </Link>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <div className="position-relative">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
              alt="Perpustakaan & Koleksi Bookstore"
              className="img-fluid rounded-4 shadow-sm"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
            />
            <div
              className="position-absolute bottom-0 start-0 m-4 p-3 rounded-3 text-start d-none d-md-block shadow-sm"
              style={{
                maxWidth: '280px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '38px',
                    height: '38px',
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <i className="fa-solid fa-stamp"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-0 small" style={{ color: 'var(--text-primary)' }}>100% Eksemplar Asli</h6>
                  <small className="text-muted">Penerbit Resmi & Bergaransi</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Pencapaian */}
      <div
        className="row g-4 text-center my-5 py-4 rounded-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="col-6 col-md-3">
          <h2 className="font-serif fw-bold mb-1" style={{ color: 'var(--accent-primary)' }}>500+</h2>
          <p className="small fw-semibold mb-0" style={{ color: 'var(--text-secondary)' }}>Judul Terkurasi</p>
        </div>
        <div className="col-6 col-md-3">
          <h2 className="font-serif fw-bold mb-1" style={{ color: 'var(--accent-primary)' }}>10.000+</h2>
          <p className="small fw-semibold mb-0" style={{ color: 'var(--text-secondary)' }}>Eksemplar Sampai ke Pembaca</p>
        </div>
        <div className="col-6 col-md-3">
          <h2 className="font-serif fw-bold mb-1" style={{ color: 'var(--accent-primary)' }}>50+</h2>
          <p className="small fw-semibold mb-0" style={{ color: 'var(--text-secondary)' }}>Mitra Penulis & Penerbit</p>
        </div>
        <div className="col-6 col-md-3">
          <h2 className="font-serif fw-bold mb-1" style={{ color: 'var(--accent-primary)' }}>99.8%</h2>
          <p className="small fw-semibold mb-0" style={{ color: 'var(--text-secondary)' }}>Kepuasan Pelanggan</p>
        </div>
      </div>

      {/* Cerita & Sejarah Bookstore */}
      <div className="row align-items-center g-5 my-5">
        <div className="col-lg-6 order-lg-2">
          <span className="badge rounded-pill px-3 py-1 mb-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
            Catatan Perjalanan
          </span>
          <h2 className="editorial-heading fw-bold mb-3">Dedikasi untuk Budaya Membaca</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
            Didirikan dengan semangat menghidupkan kembali tradisi membaca mendalam, <strong>Bookstore</strong> berawal dari inisiatif sederhana untuk memudahkan pecinta buku menemukan karya bermutu tanpa khawatir terjebak buku bajakan.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
            Kini, Bookstore telah berkembang menjadi platform toko buku daring terintegrasi dengan teknologi modern: katalog pencarian naskah <em>real-time</em>, keranjang belanja praktis, transaksi resmi otomatis melalui <em>Midtrans Gateway</em>, serta arsip faktur pesanan yang transparan.
          </p>
          <div className="mt-4">
            <Link to="/team" className="btn btn-outline-secondary rounded-pill px-4">
              <i className="fa-solid fa-users me-2"></i>Kenali Tim di Balik Bookstore
            </Link>
          </div>
        </div>
        <div className="col-lg-6 order-lg-1">
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
            alt="Suasana Membaca Nyaman"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: '380px', width: '100%', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
          />
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="row g-4 my-5">
        <div className="col-md-6">
          <div
            className="card h-100 p-4 p-lg-5"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--accent-primary)',
                  fontSize: '1.25rem',
                }}
              >
                <i className="fa-solid fa-eye"></i>
              </div>
              <h3 className="editorial-heading fw-bold mb-0">Visi Kami</h3>
            </div>
            <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '0.98rem' }}>
              Menjadi rumah buku digital paling terpercaya, terlengkap, dan bersahabat di Indonesia yang menginspirasi lahirnya generasi literat, berpengetahuan mendalam, dan berdaya saing global.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 p-4 p-lg-5" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--accent-secondary)',
                  fontSize: '1.25rem',
                }}
              >
                <i className="fa-solid fa-bullseye"></i>
              </div>
              <h3 className="editorial-heading fw-bold mb-0">Misi Kami</h3>
            </div>
            <ul className="mb-0 ps-3 small" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <li className="mb-2">Menyediakan naskah-naskah asli berkualitas dari berbagai disiplin ilmu: teknologi, sastra, bisnis, dan filsafat.</li>
              <li className="mb-2">Menghadirkan pengalaman belanja daring yang hangat, tanpa distraksi, dan terproteksi keamanan transaksi.</li>
              <li className="mb-0">Membangun kolaborasi erat bersama penulis lokal dan penerbit nasional untuk memajukan perbukuan Indonesia.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 Pilar Keunggulan Bookstore */}
      <div className="my-5 py-4 border-top" style={{ borderColor: 'var(--border-subtle) !important' }}>
        <div className="text-center mb-5">
          <span className="badge rounded-pill px-3 py-1 mb-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
            Komitmen Kami
          </span>
          <h2 className="editorial-heading fw-bold">Nilai Layanan Toko Buku</h2>
        </div>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card p-4 text-center h-100">
              <div className="fs-2 mb-3" style={{ color: 'var(--accent-primary)' }}>
                <i className="fa-solid fa-stamp"></i>
              </div>
              <h5 className="font-serif fw-bold">100% Eksemplar Asli</h5>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                Semua naskah dikirim langsung dari penerbit resmi dengan jaminan orisinalitas tanpa kompromi.
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card p-4 text-center h-100">
              <div className="fs-2 mb-3" style={{ color: 'var(--accent-secondary)' }}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h5 className="font-serif fw-bold">Pembayaran Midtrans</h5>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                Transaksi terlindungi melalui QRIS, Virtual Account bank, dan pembayaran di tempat (COD).
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card p-4 text-center h-100">
              <div className="fs-2 mb-3" style={{ color: 'var(--accent-gold)' }}>
                <i className="fa-solid fa-box-open"></i>
              </div>
              <h5 className="font-serif fw-bold">Kemasan Aman Berlapis</h5>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                Buku dikemas dengan bubble wrap tebal dan kardus pelindung agar tiba di tangan Anda tanpa cacat.
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card p-4 text-center h-100">
              <div className="fs-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
                <i className="fa-regular fa-comment-dots"></i>
              </div>
              <h5 className="font-serif fw-bold">Layanan Kurator Responsif</h5>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                Punya pertanyaan ketersediaan atau butuh rekomendasi? Kami siap merespon pertanyaan Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About