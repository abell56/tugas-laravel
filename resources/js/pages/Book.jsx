import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import defaultBooksFallback from '../Utils/books'

function Book() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [bookList, setBookList] = useState([])
  const [genreList, setGenreList] = useState([])
  const [authorList, setAuthorList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  // State untuk Modal Editorial Book Detail
  const [detailBook, setDetailBook] = useState(null)
  const [detailQuantity, setDetailQuantity] = useState(1)

  // State untuk form tambah buku cepat (khusus admin)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formInput, setFormInput] = useState({
    title: '',
    author_id: '',
    genre_id: '',
    year: new Date().getFullYear(),
    price: 85000,
    stock: 10,
    description: '',
    cover_photo: '',
  })
  const [alertMessage, setAlertMessage] = useState(null)
  const [addedCardId, setAddedCardId] = useState(null)

  // =========================================================================
  // FETCH DATA BUKU, GENRE, & AUTHOR DARI DATABASE
  // =========================================================================
  const loadData = async () => {
    setLoading(true)
    try {
      const [resBooks, resGenres, resAuthors] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/genres'),
        fetch('/api/authors'),
      ])

      let booksData = []
      let genresData = []
      let authorsData = []

      if (resBooks.ok) {
        booksData = await resBooks.json()
      }
      if (resGenres.ok) {
        genresData = await resGenres.json()
      }
      if (resAuthors.ok) {
        authorsData = await resAuthors.json()
      }

      setGenreList(genresData)
      setAuthorList(authorsData)

      if (booksData && booksData.length > 0) {
        const formatted = booksData.map((b) => {
          let img = b.cover_photo
          if (!img || (!img.startsWith('http://') && !img.startsWith('https://') && !img.startsWith('/'))) {
            img = ''
          }

          return {
            id: b.id,
            title: b.title || b.description || 'Karya Pilihan',
            author: b.author?.name || 'Penulis Bookstore',
            category: b.genre?.name || 'Umum',
            price: Number(b.price) || 85000,
            stock: b.stock ?? 10,
            description: b.description || 'Deskripsi naskah dan ulasan kurator mengenai karya ini.',
            image: img,
            year: b.year || 2024,
            rating: 4.9,
          }
        })
        setBookList(formatted)
      } else {
        setBookList(defaultBooksFallback)
      }
    } catch (err) {
      console.warn('Gagal memuat data dari API, beralih ke dataset lokal:', err)
      setBookList(defaultBooksFallback)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle submit form penambahan buku ke database
  const handleAddBookSubmit = async (e) => {
    e.preventDefault()
    if (!formInput.title.trim()) {
      alert('Judul / Deskripsi buku wajib diisi!')
      return
    }

    const defaultGenreId = genreList[0]?.id || 1
    const defaultAuthorId = authorList[0]?.id || 1

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Role': 'admin',
        },
        body: JSON.stringify({
          description: formInput.title.trim(),
          price: Number(formInput.price) || 85000,
          stock: Number(formInput.stock) || 10,
          cover_photo: formInput.cover_photo.trim(),
          genre_id: Number(formInput.genre_id) || defaultGenreId,
          author_id: Number(formInput.author_id) || defaultAuthorId,
        }),
      })

      if (response.ok) {
        setAlertMessage(`Buku "${formInput.title}" berhasil ditambahkan ke katalog resmi!`)
        setShowForm(false)
        setFormInput({
          title: '',
          author_id: '',
          genre_id: '',
          year: new Date().getFullYear(),
          price: 85000,
          stock: 10,
          description: '',
          cover_photo: '',
        })
        loadData()
      } else {
        const errData = await response.json().catch(() => ({}))
        alert(errData.message || 'Gagal menyimpan buku ke database.')
      }
    } catch (err) {
      console.error('Error adding book:', err)
      alert('Terjadi kesalahan koneksi saat menambah buku.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setAlertMessage(null), 4000)
    }
  }

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

  // Ambil daftar kategori unik
  const categories = [
    'Semua',
    ...Array.from(new Set(bookList.map((b) => b.category).filter(Boolean))),
  ]

  // Filter buku untuk pencarian dan kategori
  const filteredBooks = bookList.filter((book) => {
    const matchesCategory =
      selectedCategory === 'Semua' || book.category === selectedCategory
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch =
      query === '' ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      (book.category && book.category.toLowerCase().includes(query)) ||
      String(book.year).includes(query)
    return matchesCategory && matchesSearch
  })

  const handleCardAddToCart = (book) => {
    addToCart(book)
    setAddedCardId(book.id)
    setTimeout(() => setAddedCardId(null), 1800)
  }

  const handleOpenDetail = (book) => {
    setDetailBook(book)
    setDetailQuantity(1)
  }

  const handleDetailAddToCart = () => {
    if (!detailBook) return
    for (let i = 0; i < detailQuantity; i++) {
      addToCart(detailBook)
    }
    setDetailBook(null)
  }

  return (
    <div className="container py-4 py-lg-5">
      {/* =====================================================================
          HEADER SECTION (EDITORIAL & HUMAN CRAFTED)
          ===================================================================== */}
      <div className="text-center mb-5">
        <span
          className="badge rounded-pill px-3 py-1 mb-2"
          style={{
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            border: '1px solid rgba(200, 90, 50, 0.25)',
          }}
        >
          <i className="fa-solid fa-book-bookmark me-1"></i> Rak Buku Terkurasi
        </span>
        <h1 className="editorial-heading display-6 fw-bold mb-2">
          Koleksi Buku & Naskah Pilihan
        </h1>
        <p className="lead mx-auto col-lg-7" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
          Ditelusuri berdasarkan tema, penulis, atau genre. Setiap buku dicetak dengan kertas berkualitas dan siap melengkapi koleksi bacaan Anda.
        </p>

        {/* Tombol Tambah Buku (Khusus Admin) */}
        {user?.role === 'admin' && (
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button
              type="button"
              className={`btn ${
                showForm ? 'btn-outline-secondary' : 'btn-primary'
              } px-4 py-2 rounded-pill fw-semibold shadow-sm`}
              onClick={() => setShowForm(!showForm)}
            >
              <i className={`fa-solid ${showForm ? 'fa-xmark' : 'fa-plus'} me-2`}></i>
              {showForm ? 'Tutup Formulir' : 'Tambah Buku Baru'}
            </button>
            <Link
              to="/admin"
              className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold shadow-sm"
            >
              <i className="fa-solid fa-sliders me-2"></i>
              Buka Dashboard Admin
            </Link>
          </div>
        )}
      </div>

      {/* Alert Notifikasi Sukses */}
      {alertMessage && (
        <div
          className="alert alert-success alert-dismissible fade show shadow-sm my-3 d-flex align-items-center"
          role="alert"
          style={{
            backgroundColor: 'var(--accent-secondary-light)',
            borderColor: 'rgba(61, 90, 69, 0.3)',
            color: 'var(--accent-secondary)',
            borderRadius: '10px',
          }}
        >
          <i className="fa-solid fa-circle-check me-2 fs-5"></i>
          <div>{alertMessage}</div>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={() => setAlertMessage(null)}
          ></button>
        </div>
      )}

      {/* =====================================================================
          FORM TAMBAH BUKU (ADMIN QUICK ACTION)
          ===================================================================== */}
      {showForm && (
        <div className="card mb-5 p-3 p-md-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
            <div>
              <h5 className="font-serif fw-bold mb-1">
                <i className="fa-solid fa-pen-nib me-2" style={{ color: 'var(--accent-primary)' }}></i>
                Registrasi Buku Baru ke Katalog
              </h5>
              <p className="small mb-0 text-muted">
                Entri baru akan langsung tersimpan di database MySQL dan dapat dipesan pelanggan.
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowForm(false)}
            ></button>
          </div>

          <form onSubmit={handleAddBookSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small text-secondary">
                  Judul Buku / Deskripsi Utama <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Contoh: Filosofi Teras"
                  value={formInput.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold small text-secondary">
                  Penulis (Author)
                </label>
                <select
                  name="author_id"
                  className="form-select"
                  value={formInput.author_id}
                  onChange={handleInputChange}
                >
                  <option value="">-- Pilih Penulis --</option>
                  {authorList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold small text-secondary">
                  Kategori (Genre)
                </label>
                <select
                  name="genre_id"
                  className="form-select"
                  value={formInput.genre_id}
                  onChange={handleInputChange}
                >
                  <option value="">-- Pilih Kategori --</option>
                  {genreList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold small text-secondary">
                  Harga Satuan (IDR)
                </label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="85000"
                  value={formInput.price}
                  onChange={handleInputChange}
                  min="1000"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold small text-secondary">
                  Ketersediaan Stok
                </label>
                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  placeholder="10"
                  value={formInput.stock}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-secondary">
                  URL Sampul Buku (Opsional)
                </label>
                <input
                  type="text"
                  name="cover_photo"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formInput.cover_photo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 rounded-pill"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 rounded-pill fw-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-save me-1"></i> Simpan ke Katalog
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          FILTERING & SEARCH CONTROLS (WARM SAND BORDERS & TERRACOTTA ACTIVE)
          ===================================================================== */}
      <div className="row g-3 align-items-center justify-content-between mb-4 pb-2">
        {/* Search Bar */}
        <div className="col-lg-5">
          <div className="input-group">
            <span
              className="input-group-text border-end-0"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Cari judul naskah, nama penulis, atau tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ backgroundColor: 'var(--bg-surface)' }}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="col-lg-7 text-lg-end">
          <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Metrics */}
      <div className="d-flex justify-content-between align-items-center mb-4 text-muted small">
        <span>
          Menampilkan <strong>{filteredBooks.length}</strong> judul buku
          {selectedCategory !== 'Semua' && ` di kategori "${selectedCategory}"`}
        </span>
        {searchQuery && (
          <span>Kata kunci: &ldquo;{searchQuery}&rdquo;</span>
        )}
      </div>

      {/* =====================================================================
          BOOK CATALOG GRID (STRICT 2:3 ASPECT RATIO & REALISTIC SPINE ELEVATION)
          ===================================================================== */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary mb-3" role="status"></div>
          <p className="text-muted small">Mengambil koleksi dari database...</p>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredBooks.map((book) => {
            const hasCover = Boolean(book.image && (book.image.startsWith('http://') || book.image.startsWith('https://') || book.image.startsWith('/')))

            return (
              <div className="col" key={book.id}>
                <div className="editorial-book-card">
                  {/* Physical Book Cover Stage */}
                  <div
                    className="book-cover-stage"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenDetail(book)}
                    title="Klik untuk melihat detail lengkap"
                  >
                    <div className="book-cover-frame">
                      {hasCover ? (
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
                            <i className="fa-solid fa-book"></i>
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
                          backgroundColor:
                            book.stock > 0
                              ? 'var(--accent-secondary-light)'
                              : '#FDF0EE',
                          color:
                            book.stock > 0
                              ? 'var(--accent-secondary)'
                              : '#B93822',
                          border:
                            book.stock > 0
                              ? '1px solid rgba(61, 90, 69, 0.25)'
                              : '1px solid rgba(185, 56, 34, 0.25)',
                          fontSize: '0.72rem',
                        }}
                      >
                        {book.stock > 0 ? `Stok: ${book.stock}` : 'Habis'}
                      </span>
                    </div>

                    <h3
                      className="book-card-title"
                      title={book.title}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleOpenDetail(book)}
                    >
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
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary px-2"
                          title="Lihat Sinopsis Lengkap"
                          onClick={() => handleOpenDetail(book)}
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary px-3 rounded-end-pill"
                          title="Masukkan ke Keranjang"
                          onClick={() => handleCardAddToCart(book)}
                          disabled={book.stock <= 0}
                        >
                          <i className={`fa-solid ${addedCardId === book.id ? 'fa-check' : 'fa-basket-shopping'} me-1`}></i>
                          {addedCardId === book.id ? 'Tersimpan' : '+ Keranjang'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-5 card p-5" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <i className="fa-solid fa-book-open text-muted fs-1 mb-3"></i>
          <h5 className="font-serif fw-bold text-dark mb-1">
            Belum Menemukan Buku yang Dicari
          </h5>
          <p className="small text-muted mb-3">
            Tidak ada buku yang sesuai dengan pencarian &ldquo;{searchQuery}&rdquo;.
          </p>
          <div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('Semua')
              }}
            >
              Reset Filter Pencarian
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          TWO-COLUMN EDITORIAL BOOK DETAIL MODAL
          ===================================================================== */}
      {detailBook && (
        <div
          className="modal fade show d-block editorial-detail-modal"
          style={{ backgroundColor: 'rgba(35, 31, 32, 0.65)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg">
              <div className="modal-header d-flex justify-content-between align-items-center py-3 px-4">
                <span className="badge rounded-pill" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--accent-primary)' }}>
                  <i className="fa-solid fa-bookmark me-1"></i> Detail Naskah & Buku
                </span>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDetailBook(null)}
                ></button>
              </div>

              <div className="modal-body p-0">
                <div className="row g-0">
                  {/* Left Column: Sticky Book Cover Showcase with Physical Elevation */}
                  <div className="col-md-5 editorial-detail-stage">
                    <div className="editorial-detail-cover">
                      {detailBook.image ? (
                        <img
                          src={detailBook.image}
                          alt={detailBook.title}
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
                            {detailBook.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Full Title, Author Link, Genre Tag, Stock Indicator & Order Actions */}
                  <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="book-card-genre">
                          {detailBook.category}
                        </span>
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor:
                              detailBook.stock > 0
                                ? 'var(--accent-secondary-light)'
                                : '#FDF0EE',
                            color:
                              detailBook.stock > 0
                                ? 'var(--accent-secondary)'
                                : '#B93822',
                            border:
                              detailBook.stock > 0
                                ? '1px solid rgba(61, 90, 69, 0.25)'
                                : '1px solid rgba(185, 56, 34, 0.25)',
                            fontSize: '0.75rem',
                          }}
                        >
                          <i className={`fa-solid ${detailBook.stock > 0 ? 'fa-check' : 'fa-xmark'} me-1`}></i>
                          {detailBook.stock > 0
                            ? `Tersedia: ${detailBook.stock} eksemplar`
                            : 'Stok Habis'}
                        </span>
                      </div>

                      <h2 className="editorial-heading fw-bold mb-1" style={{ fontSize: '1.65rem' }}>
                        {detailBook.title}
                      </h2>

                      <p className="small mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Ditulis oleh <strong style={{ color: 'var(--text-primary)' }}>{detailBook.author}</strong> • Edisi Penerbit Resmi
                      </p>

                      <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">Harga Resmi:</span>
                          <span className="book-price-tag fs-4">
                            {formatRupiah(detailBook.price)}
                          </span>
                        </div>
                      </div>

                      <h6 className="fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                        Sinopsis & Catatan Kurator
                      </h6>
                      <p className="small text-secondary mb-4" style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                        {detailBook.description}
                      </p>
                    </div>

                    {/* Order & Quantity Flow */}
                    <div className="pt-3 border-top" style={{ borderColor: 'var(--border-subtle) !important' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center border rounded-pill px-2 py-1" style={{ borderColor: 'var(--border-subtle) !important', backgroundColor: 'var(--bg-surface)' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-decoration-none text-dark p-1"
                            onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}
                            disabled={detailQuantity <= 1}
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <span className="px-3 fw-bold small">
                            {detailQuantity}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-decoration-none text-dark p-1"
                            onClick={() => setDetailQuantity((q) => Math.min(detailBook.stock || 10, q + 1))}
                            disabled={detailQuantity >= (detailBook.stock || 10)}
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary flex-grow-1 rounded-pill fw-semibold py-2 d-inline-flex align-items-center justify-content-center gap-2"
                          onClick={handleDetailAddToCart}
                          disabled={detailBook.stock <= 0}
                        >
                          <i className="fa-solid fa-basket-shopping"></i>
                          <span>
                            {detailBook.stock <= 0
                              ? 'Stok Sedang Habis'
                              : `+ Tambah (${formatRupiah(detailBook.price * detailQuantity)})`}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Book