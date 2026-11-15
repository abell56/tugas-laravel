import { Link } from 'react-router'

function Footer() {
  return (
    <footer className="custom-footer mt-auto pt-5 pb-4">
      <div className="container">
        <div className="row g-4 justify-content-between align-items-start pb-4 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
          <div className="col-lg-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-mark" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                <i className="fa-solid fa-book-bookmark"></i>
              </div>
              <span className="brand-wordmark fs-4">
                book<span>store</span>
              </span>
            </div>
            <p className="small mb-3" style={{ color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: '1.7' }}>
              Kurasi karya literasi pilihan, menghubungkan pembaca dengan pemikiran mendalam dari penulis terkemuka. Setiap eksemplar dijamin keasliannya dan dikemas dengan penuh perhatian.
            </p>
            <div className="d-flex align-items-center gap-2 text-muted small">
              <span className="badge rounded-pill" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--accent-secondary)' }}>
                <i className="fa-solid fa-seedling me-1"></i> Independen & Bergaransi
              </span>
              <span>•</span>
              <span>Jakarta Selatan, Indonesia</span>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.88rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Navigasi
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/book" className="footer-link">Katalog Buku</Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">Keranjang Belanja</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">Tentang Kami</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.88rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Bantuan & Tim
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
              <li>
                <Link to="/team" className="footer-link">Tim Pengelola</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Hubungi Kami</Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">Status Pesanan</Link>
              </li>
              <li>
                <a href="#faq" className="footer-link">Panduan Pemesanan</a>
              </li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-3">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.88rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Pembayaran Terpercaya
            </h6>
            <p className="small mb-3" style={{ color: 'var(--text-secondary)' }}>
              Transaksi aman melalui gateway Midtrans Snap: QRIS, Transfer Bank, dan Bayar di Tempat.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                QRIS
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                BCA Virtual
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                Mandiri
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                COD
              </span>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center pt-4 small" style={{ color: 'var(--text-secondary)' }}>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Bookstore — Rumah Literasi Digital. Hak cipta dilindungi.
          </p>
          <div className="d-flex gap-3">
            <Link to="/about" className="footer-link">Tentang</Link>
            <span>•</span>
            <Link to="/contact" className="footer-link">Bantuan</Link>
            <span>•</span>
            <span style={{ color: 'var(--text-muted)' }}>Jakarta, ID</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer