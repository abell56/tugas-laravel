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

  // State untuk form tambah buku cepat
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
        // Format buku dari database
        const formatted = booksData.map((b) => {
          let img = b.cover_photo
          if (!img || (!img.startsWith('http://') && !img.startsWith('https://') && !img.startsWith('/'))) {
            img = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
          }

          return {
            id: b.id,
            title: b.title || b.description || 'Buku Pilihan',
            author: b.author?.name || 'Penulis Bookstore',
            category: b.genre?.name || 'Umum',
            price: Number(b.price) || 85000,
            stock: b.stock ?? 10,
            description: b.description || 'Deskripsi buku pilihan bermutu.',
            image: img,
            year: b.year || 2024,
            rating: 4.9,
            reviews: '500+',
          }
        })
        setBookList(formatted)
      } else {
        // Fallback jika database masih kosong
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

  // Handle perubahan nilai input form
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
          cover_photo:
            formInput.cover_photo.trim() ||
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop',
          genre_id: Number(formInput.genre_id) || defaultGenreId,
          author_id: Number(formInput.author_id) || defaultAuthorId,
        }),
      })

      if (response.ok) {
        setAlertMessage(`Buku "${formInput.title}" berhasil ditambahkan ke database!`)
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

  return (
    <div className="container my-5">
      {/* Header Halaman */}
      <div className="text-center mb-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2 fw-semibold">
          <i className="fa-solid fa-book-open me-1"></i> Katalog Real-Time Database
        </span>
        <h1 className="fw-bold">Koleksi Buku Bookstore</h1>
        <p className="lead text-secondary col-lg-7 mx-auto">
          Temukan berbagai buku pilihan dari database resmi Bookstore untuk memenuhi kebutuhan bacaan Anda.
        </p>

        {/* Tombol Tambah Buku (Khusus Admin atau untuk Quick Action) */}
        {user?.role === 'admin' ? (
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
              className="btn btn-outline-danger px-4 py-2 rounded-pill fw-semibold shadow-sm"
            >
              <i className="fa-solid fa-gear me-2"></i>
              Buka Panel Admin
            </Link>
          </div>
        ) : null}
      </div>

      {/* Alert Notifikasi Sukses */}
      {alertMessage && (
        <div
          className="alert alert-success alert-dismissible fade show shadow-sm my-3"
          role="alert"
        >
          <i className="fa-solid fa-circle-check me-2"></i>
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlertMessage(null)}
          ></button>
        </div>
      )}

      {/* Formulir Tambah Buku */}
      {showForm && (
        <div className="card shadow-sm border-0 bg-white rounded-3 mb-5 p-2">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="fa-solid fa-square-plus text-primary me-2"></i>
                Formulir Tambah Buku (Database MySQL)
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowForm(false)}
              ></button>
            </div>

            <form onSubmit={handleAddBookSubmit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label fw-semibold text-secondary small">
                    Judul Buku / Deskripsi <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Contoh: Belajar Laravel & React Modern"
                    value={formInput.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-secondary small">
                    Tahun Terbit
                  </label>
                  <input
                    type="number"
                    name="year"
                    className="form-control"
                    placeholder="2024"
                    value={formInput.year}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    Penulis (Author) <span className="text-danger">*</span>
                  </label>
                  <select
                    name="author_id"
                    className="form-select"
                    value={formInput.author_id}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Pilih Penulis dari Database --</option>
                    {authorList.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Kategori (Genre) <span className="text-danger">*</span>
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
                  <label className="form-label fw-semibold text-secondary small">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="Contoh: 85000"
                    value={formInput.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Stok Buku
                  </label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    placeholder="Contoh: 15"
                    value={formInput.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-9">
                  <label className="form-label fw-semibold text-secondary small">
                    URL Sampul Gambar (Cover Photo)
                  </label>
                  <input
                    type="text"
                    name="cover_photo"
                    className="form-control"
                    placeholder="https://... (opsional, biarkan kosong untuk gambar default)"
                    value={formInput.cover_photo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => setShowForm(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Menyimpan ke DB...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-save me-1"></i> Simpan Buku
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kontrol Pencarian dan Kategori */}
      <div className="row g-3 align-items-center justify-content-between mb-4">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fa-solid fa-magnifying-glass text-secondary"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Cari judul, penulis, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => setSearchQuery('')}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        <div className="col-md-7 text-md-end">
          <div className="btn-group flex-wrap" role="group">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${
                  selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-secondary">Memuat koleksi buku dari database...</p>
        </div>
      ) : (
        /* Book Catalog Grid */
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div className="col" key={book.id}>
                <div className="card h-100 shadow-sm border-0 book-card">
                  <div className="position-relative overflow-hidden">
                    <img
                      src={book.image}
                      className="card-img-top book-cover-img"
                      alt={book.title}
                      style={{ height: '260px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                      }}
                    />
                    {book.category && (
                      <span className="position-absolute top-0 end-0 m-2 badge bg-primary shadow-sm">
                        {book.category}
                      </span>
                    )}
                    <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 shadow-sm">
                      <i className="fa-solid fa-box me-1"></i>
                      Stok: {book.stock}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted fw-medium text-truncate col-7">
                        <i className="fa-solid fa-user-pen me-1"></i>
                        {book.author}
                      </small>
                      <small className="text-warning fw-semibold">
                        <i className="fa-solid fa-star me-1"></i>
                        {book.rating}
                      </small>
                    </div>
                    <h5
                      className="card-title fw-bold text-dark mb-2 text-truncate"
                      title={book.title}
                    >
                      {book.title}
                    </h5>
                    <p className="card-text text-secondary small flex-grow-1">
                      {book.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
                      <span className="text-primary fw-bold fs-5">
                        {formatRupiah(book.price)}
                      </span>
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          title="Lihat Detail Buku"
                          onClick={() =>
                            alert(
                              `Detail Buku:\nJudul: ${book.title}\nPenulis: ${book.author}\nKategori: ${book.category}\nHarga: ${formatRupiah(book.price)}\nStok: ${book.stock}\nSinopsis: ${book.description}`
                            )
                          }
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary fw-semibold px-2"
                          title="Masukkan ke Keranjang"
                          onClick={() => addToCart(book)}
                          disabled={book.stock <= 0}
                        >
                          <i className="fa-solid fa-cart-plus me-1"></i>
                          {book.stock <= 0 ? 'Habis' : '+ Keranjang'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <i className="fa-solid fa-book-open text-muted fs-1 mb-3"></i>
              <h5 className="text-secondary fw-semibold">Buku Tidak Ditemukan</h5>
              <p className="text-muted small">
                Tidak ada buku yang sesuai dengan kriteria pencarian &quot;{searchQuery}&quot;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Book
