import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useCart } from '../context/CartContext'
import defaultBooksFallback from '../Utils/books'

function Home() {
  const { addToCart } = useCart()
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)

  // Format Rupiah
  const formatRupiah = (val) => {
    if (typeof val === 'string' && val.startsWith('Rp')) return val
    const num = Number(val) || 0
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
  }

  // Load books from Laravel API (with graceful fallback)
  useEffect(() => {
    const fetchHomeBooks = async () => {
      try {
        const res = await fetch('/api/books')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((b) => ({
              id: b.id,
              title: b.title || b.description || 'Karya Terpilih',
              author: b.author?.name || 'Penulis Buku',
              category: b.genre?.name || 'Sastra & Esai',
              price: Number(b.price) || 85000,
              stock: b.stock ?? 10,
              description: b.description || 'Sebuah karya bermutu yang memperkaya cara pandang pembaca.',
              image: b.cover_photo || '',
              rating: 4.9,
            }))
            setFeaturedBooks(formatted)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Menggunakan fallback data lokal untuk Home:', err)
      }
      setFeaturedBooks(defaultBooksFallback)
      setLoading(false)
    }

    fetchHomeBooks()
  }, [])

  const handleAddToCart = (book) => {
    addToCart(book)
    setAddedId(book.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  const spotlightBook = featuredBooks[0] || defaultBooksFallback[0]

  return (
    <div className="py-4 py-lg-5">
      {/* =====================================================================
          1. ASYMMETRIC "CURATED READING ROOM" HERO
          ===================================================================== */}
      <section className="container mb-5">
        <div className="editorial-hero-wrapper p-4 p-md-5">
          <div className="row g-5 align-items-center">
            {/* Left Column: Literary Introduction */}
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge rounded-circle p-1" style={{ backgroundColor: 'var(--accent-primary)', width: '8px', height: '8px' }}></span>
                <span className="small fw-semibold" style={{ color: 'var(--accent-primary)', letterSpacing: '0.04em', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  Ruang Kurasi Independen
                </span>
              </div>

              <h1 className="display-5 fw-bold mb-3" style={{ lineHeight: '1.25' }}>
                Kisah & pemikiran yang mengendap lama setelah halaman terakhir ditutup.
              </h1>

              <p className="lead mb-4" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.75' }}>
                Selamat datang di <strong>Bookstore</strong>. Kami mengurasi setiap judul dengan kesabaran—menjembatani rasa penasaran Anda dengan karya-karya sastra, teknologi, dan humaniora yang bermakna bagi rak buku pribadi Anda.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link
                  to="/book"
                  className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                >
                  <i className="fa-solid fa-book-open"></i>
                  <span>Jelajahi Koleksi Rak</span>
                </Link>
                <Link
                  to="/about"
                  className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2"
                >
                  <i className="fa-regular fa-compass"></i>
                  <span>Tentang Kurasi Kami</span>
                </Link>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top small" style={{ borderColor: 'var(--border-subtle) !important', color: 'var(--text-secondary)' }}>
                <span className="d-flex align-items-center gap-1">
                  <i className="fa-solid fa-certificate" style={{ color: 'var(--accent-secondary)' }}></i>
                  100% Eksemplar Resmi
                </span>
                <span>•</span>
                <span className="d-flex align-items-center gap-1">
                  <i className="fa-solid fa-box" style={{ color: 'var(--accent-primary)' }}></i>
                  Pengemasan Berlapis Kardus
                </span>
                <span>•</span>
                <span className="d-flex align-items-center gap-1">
                  <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-secondary)' }}></i>
                  Midtrans Verified
                </span>
              </div>
            </div>

            {/* Right Column: Physical Spotlight Book with Realistic Elevation */}
            <div className="col-lg-5">
              {spotlightBook && (
                <div
                  className="card p-4 mx-auto"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    maxWidth: '380px',
                    borderRadius: '14px',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className="badge rounded-pill px-3 py-1"
                      style={{
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent-primary)',
                        border: '1px solid rgba(200, 90, 50, 0.25)',
                        fontSize: '0.75rem',
                      }}
                    >
                      <i className="fa-solid fa-bookmark me-1"></i> Pilihan Kurator Bulan Ini
                    </span>
                    <span className="small text-muted">
                      Stok: {spotlightBook.stock}
                    </span>
                  </div>

                  {/* Physical 2:3 Book Showcase */}
                  <div className="book-cover-stage rounded-3 mb-3">
                    <div className="book-cover-frame">
                      {spotlightBook.image ? (
                        <img
                          src={spotlightBook.image}
                          alt={spotlightBook.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                          }}
                        />
                      ) : (
                        <div className="book-cover-fallback">
                          <div className="book-cover-fallback-icon">
                            <i className="fa-solid fa-book"></i>
                          </div>
                          <span className="book-cover-fallback-title">
                            {spotlightBook.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="book-card-genre mb-2">
                      {spotlightBook.category}
                    </span>
                    <h5 className="font-serif fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {spotlightBook.title}
                    </h5>
                    <p className="book-card-author mb-3">
                      Karya {spotlightBook.author}
                    </p>
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'var(--border-subtle) !important' }}>
                      <span className="book-price-tag fs-5">
                        {formatRupiah(spotlightBook.price)}
                      </span>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm px-3 rounded-pill fw-semibold"
                        onClick={() => handleAddToCart(spotlightBook)}
                      >
                        <i className={`fa-solid ${addedId === spotlightBook.id ? 'fa-check' : 'fa-cart-plus'} me-1`}></i>
                        {addedId === spotlightBook.id ? 'Ditambahkan' : '+ Keranjang'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CURATED SHELF GRID (TACTILE 2:3 BOOK CARDS)
          ===================================================================== */}
      <section className="container mb-5 py-4">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
          <div>
            <span className="badge rounded-pill px-3 py-1 mb-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              Rak Pilihan Pembaca
            </span>
            <h2 className="editorial-heading h3 fw-bold mb-0">
              Koleksi Unggulan Toko Buku
            </h2>
          </div>
          <Link to="/book" className="btn btn-outline-secondary btn-sm px-3 rounded-pill mt-3 mt-sm-0">
            Lihat Semua Koleksi ({featuredBooks.length}) <i className="fa-solid fa-arrow-right ms-1"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary mb-3" role="status"></div>
            <p className="text-muted small">Menata buku-buku di rak perpustakaan...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {featuredBooks.slice(0, 8).map((book) => {
              const hasImage = Boolean(book.image && (book.image.startsWith('http://') || book.image.startsWith('https://') || book.image.startsWith('/')))

              return (
                <div className="col" key={book.id}>
                  <div className="editorial-book-card">
                    {/* Physical Cover Stage with 2:3 Frame */}
                    <div className="book-cover-stage">
                      <div className="book-cover-frame">
                        {hasImage ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                            }}
                          />
                        ) : (
                          <div className="book-cover-fallback">
                            <div className="book-cover-fallback-icon">
                              <i className="fa-solid fa-book-open"></i>
                            </div>
                            <span className="book-cover-fallback-title">
                              {book.title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Book Metadata & Actions */}
                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="book-card-genre">
                          {book.category}
                        </span>
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor: 'var(--accent-secondary-light)',
                            color: 'var(--accent-secondary)',
                            fontSize: '0.72rem',
                          }}
                        >
                          Tersedia
                        </span>
                      </div>

                      <h3 className="book-card-title" title={book.title}>
                        {book.title}
                      </h3>

                      <p className="book-card-author mb-2">
                        {book.author}
                      </p>

                      <p
                        className="small text-muted flex-grow-1 mb-3"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.5',
                        }}
                      >
                        {book.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto" style={{ borderColor: 'var(--border-subtle) !important' }}>
                        <span className="book-price-tag fs-6">
                          {formatRupiah(book.price)}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm px-3 rounded-pill"
                          onClick={() => handleAddToCart(book)}
                          disabled={book.stock <= 0}
                        >
                          <i className={`fa-solid ${addedId === book.id ? 'fa-check' : 'fa-basket-shopping'} me-1`}></i>
                          {addedId === book.id ? 'Tersimpan' : '+ Keranjang'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* =====================================================================
          3. EDITORIAL MANIFESTO (ANTI-AI HUMAN CRAFTED)
          ===================================================================== */}
      <section className="container my-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card p-4 h-100">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--accent-primary)',
                  fontSize: '1.1rem',
                }}
              >
                <i className="fa-solid fa-feather-pointed"></i>
              </div>
              <h5 className="font-serif fw-bold mb-2">Kurasi Berbobot</h5>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                Kami tidak mengumpulkan ribuan judul acak. Setiap buku di rak kami telah melalui telaah atas kebaruan pemikiran dan kualitas penulisan.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 h-100">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--accent-secondary)',
                  fontSize: '1.1rem',
                }}
              >
                <i className="fa-solid fa-stamp"></i>
              </div>
              <h5 className="font-serif fw-bold mb-2">Integritas Penerbit Resmi</h5>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                Hanya mendistribusikan karya asli langsung dari penerbit terpercaya. Menghargai hak cipta dan keringat para penulis Indonesia dan dunia.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 h-100">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--accent-gold)',
                  fontSize: '1.1rem',
                }}
              >
                <i className="fa-solid fa-handshake-angle"></i>
              </div>
              <h5 className="font-serif fw-bold mb-2">Layanan yang Bersahabat</h5>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                Butuh rekomendasi bacaan atau kendala pengiriman? Tim kami siap berdiskusi langsung melalui pesan kontak atau surel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. INVITATION BANNER (WARM NATURAL TONES)
          ===================================================================== */}
      <section className="container mt-5 pt-3">
        <div
          className="p-4 p-md-5 rounded-4"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-lg-8">
              <span className="badge rounded-pill px-3 py-1 mb-2" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', border: '1px solid rgba(200, 90, 50, 0.2)' }}>
                Komunitas Pembaca
              </span>
              <h3 className="editorial-heading fw-bold mb-2">
                Mulai bangun perpustakaan pribadi Anda hari ini.
              </h3>
              <p className="mb-0" style={{ color: 'var(--text-secondary)', maxWidth: '580px' }}>
                Daftarkan akun untuk menyimpan riwayat pesanan buku, memantau pengiriman, dan mendapatkan catatan rekomendasi edisi terbatas dari kurator kami.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/register" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm">
                <i className="fa-solid fa-user-plus me-2"></i>Daftar Anggota Pembaca
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home