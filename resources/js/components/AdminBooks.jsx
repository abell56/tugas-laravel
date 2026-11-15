import { useState, useEffect } from 'react'

function AdminBooks({ genreList = [], authorList = [], onStatsChange }) {
  const [bookList, setBookList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)

  // State Modal Edit & Hapus
  const [bookToEdit, setBookToEdit] = useState(null)
  const [bookToDelete, setBookToDelete] = useState(null)

  // State Form Tambah Buku
  const [formData, setFormData] = useState({
    description: '',
    genre_id: '',
    author_id: '',
    price: 85000,
    stock: 10,
    cover_photo: '',
  })

  const triggerAlert = (text, type = 'success') => {
    setAlert({ text, type })
    setTimeout(() => setAlert(null), 4000)
  }

  // =========================================================================
  // FETCH BUKU DARI DATABASE
  // =========================================================================
  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/books')
      if (res.ok) {
        const data = await res.json()
        setBookList(Array.isArray(data) ? data : [])
        if (onStatsChange) onStatsChange(data.length)
      }
    } catch (err) {
      console.error('Gagal mengambil data buku:', err)
      triggerAlert('Gagal memuat data buku dari server.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Handle Input Form Tambah
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle Submit Tambah Buku
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      alert('Judul / Deskripsi buku wajib diisi!')
      return
    }

    const defaultGenre = genreList[0]?.id || 1
    const defaultAuthor = authorList[0]?.id || 1

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
          description: formData.description.trim(),
          price: Number(formData.price) || 85000,
          stock: Number(formData.stock) || 10,
          cover_photo: formData.cover_photo.trim(),
          genre_id: Number(formData.genre_id) || defaultGenre,
          author_id: Number(formData.author_id) || defaultAuthor,
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (response.ok) {
        triggerAlert(`Buku "${formData.description.trim()}" berhasil ditambahkan ke database!`)
        setFormData({
          description: '',
          genre_id: '',
          author_id: '',
          price: 85000,
          stock: 10,
          cover_photo: '',
        })
        setShowCreateForm(false)
        fetchBooks()
      } else {
        alert(result.message || 'Gagal menyimpan buku ke database.')
      }
    } catch (err) {
      console.error('Error create book:', err)
      alert('Terjadi kesalahan jaringan saat menyimpan data buku.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Submit Update Buku
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!bookToEdit) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/books/${bookToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Role': 'admin',
        },
        body: JSON.stringify({
          description: bookToEdit.description,
          price: Number(bookToEdit.price),
          stock: Number(bookToEdit.stock),
          cover_photo: bookToEdit.cover_photo || '',
          genre_id: Number(bookToEdit.genre_id),
          author_id: Number(bookToEdit.author_id),
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (response.ok) {
        triggerAlert(`Perubahan pada buku #${bookToEdit.id} berhasil disimpan!`)
        setBookToEdit(null)
        fetchBooks()
      } else {
        alert(result.message || 'Gagal memperbarui data buku.')
      }
    } catch (err) {
      console.error('Error update book:', err)
      alert('Terjadi kesalahan jaringan saat update buku.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Hapus Buku
  const handleDeleteBook = async () => {
    if (!bookToDelete) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/books/${bookToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Role': 'admin',
        },
      })

      if (response.ok) {
        triggerAlert(`Buku #${bookToDelete.id} berhasil dihapus dari sistem!`)
        setBookToDelete(null)
        fetchBooks()
      } else {
        const result = await response.json().catch(() => ({}))
        alert(result.message || 'Gagal menghapus buku.')
      }
    } catch (err) {
      console.error('Error delete book:', err)
      alert('Terjadi kesalahan jaringan saat menghapus data buku.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(val) || 0)
  }

  // Filter Buku
  const filteredBooks = bookList.filter((b) => {
    const q = searchQuery.toLowerCase().trim()
    return (
      !q ||
      (b.description && b.description.toLowerCase().includes(q)) ||
      (b.author?.name && b.author.name.toLowerCase().includes(q)) ||
      (b.genre?.name && b.genre.name.toLowerCase().includes(q)) ||
      String(b.id).includes(q)
    )
  })

  return (
    <div>
      {/* Alert Notifikasi */}
      {alert && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mb-4 d-flex align-items-center`}
          role="alert"
          style={{
            backgroundColor: alert.type === 'success' ? 'var(--accent-secondary-light)' : '#FDF0EE',
            borderColor: alert.type === 'success' ? 'rgba(61, 90, 69, 0.3)' : 'rgba(185, 56, 34, 0.3)',
            color: alert.type === 'success' ? 'var(--accent-secondary)' : '#B93822',
            borderRadius: '10px',
          }}
        >
          <i
            className={`fa-solid ${
              alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'
            } me-2 fs-5`}
          ></i>
          <div>{alert.text}</div>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={() => setAlert(null)}
          ></button>
        </div>
      )}

      {/* Action Bar: Search & Tombol Tambah */}
      <div className="card p-3 mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-12 col-md-6 col-lg-5">
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
                className="form-control border-start-0 ps-0 shadow-none"
                placeholder="Cari judul naskah, nama penulis, genre, atau #ID..."
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

          <div className="col-12 col-md-auto text-end">
            <button
              type="button"
              className={`btn ${
                showCreateForm ? 'btn-outline-secondary' : 'btn-primary'
              } rounded-pill px-4 fw-semibold shadow-sm`}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <i
                className={`fa-solid ${
                  showCreateForm ? 'fa-xmark' : 'fa-plus'
                } me-2`}
              ></i>
              {showCreateForm ? 'Tutup Formulir' : 'Tambah Judul Buku'}
            </button>
          </div>
        </div>
      </div>

      {/* FORMULIR CREATE BUKU */}
      {showCreateForm && (
        <div className="card mb-4 p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
            <div>
              <h5 className="font-serif fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                <i className="fa-solid fa-square-plus me-2" style={{ color: 'var(--accent-primary)' }}></i>
                Registrasi Naskah / Buku Baru
              </h5>
              <p className="small mb-0 text-muted">
                Data buku baru akan langsung tersimpan ke tabel <code>books</code> di database MySQL.
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowCreateForm(false)}
            ></button>
          </div>

          <form onSubmit={handleCreateSubmit}>
            <div className="row g-3">
              <div className="col-md-8">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold small text-secondary">
                      Judul Buku / Deskripsi Naskah <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      placeholder="Contoh: Laut Bercerita"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-secondary">
                      Kategori (Genre)
                    </label>
                    <select
                      name="genre_id"
                      className="form-select"
                      value={formData.genre_id}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Pilih Genre --</option>
                      {genreList.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-secondary">
                      Penulis (Author)
                    </label>
                    <select
                      name="author_id"
                      className="form-select"
                      value={formData.author_id}
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

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-secondary">
                      Harga Jual Satuan (IDR)
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="85000"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="1000"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-secondary">
                      Jumlah Stok Gudang
                    </label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      placeholder="10"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small text-secondary">
                      URL Foto Sampul (Cover Photo)
                    </label>
                    <input
                      type="text"
                      name="cover_photo"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.cover_photo}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Cover Preview Box */}
              <div className="col-md-4 d-flex flex-column align-items-center justify-content-center p-3 rounded" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <span className="small text-muted fw-semibold mb-2">Pratinjau Sampul</span>
                <div className="image-preview-frame">
                  {formData.cover_photo ? (
                    <img
                      src={formData.cover_photo}
                      alt="Pratinjau"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                      }}
                    />
                  ) : (
                    <i className="fa-solid fa-book-open text-muted fs-3"></i>
                  )}
                </div>
                <small className="text-muted mt-2 text-center" style={{ fontSize: '0.75rem' }}>
                  Proporsi fisik buku 2:3
                </small>
              </div>

              <div className="col-12 d-flex justify-content-end gap-2 pt-3 border-top" style={{ borderColor: 'var(--border-subtle) !important' }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 rounded-pill"
                  onClick={() => setShowCreateForm(false)}
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

      {/* TABEL DAFTAR BUKU */}
      <div className="card overflow-hidden">
        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-book" style={{ color: 'var(--accent-primary)' }}></i>
            <h6 className="font-serif fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
              Daftar Seluruh Naskah Buku ({filteredBooks.length})
            </h6>
          </div>
          <span className="badge rounded-pill" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            MySQL Database
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '60px' }} className="text-center">#ID</th>
                <th style={{ width: '70px' }}>Sampul</th>
                <th>Judul & Naskah</th>
                <th>Kategori (Genre)</th>
                <th>Penulis (Author)</th>
                <th>Harga</th>
                <th className="text-center">Stok</th>
                <th style={{ width: '110px' }} className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <div className="spinner-border text-secondary spinner-border-sm me-2"></div>
                    Memuat data buku dari database...
                  </td>
                </tr>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book) => {
                  let img = book.cover_photo
                  if (!img || (!img.startsWith('http://') && !img.startsWith('https://') && !img.startsWith('/'))) {
                    img = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                  }

                  return (
                    <tr key={book.id}>
                      <td className="text-center fw-bold text-muted small">
                        #{book.id}
                      </td>
                      <td>
                        <div
                          className="rounded overflow-hidden shadow-sm flex-shrink-0"
                          style={{
                            width: '42px',
                            height: '60px',
                            backgroundColor: 'var(--bg-secondary)',
                          }}
                        >
                          <img
                            src={img}
                            alt={book.description}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="font-serif fw-bold text-dark" style={{ fontSize: '0.98rem' }}>
                          {book.description}
                        </div>
                        <small className="text-muted">
                          Entri Sistem ID #{book.id}
                        </small>
                      </td>
                      <td>
                        <span className="book-card-genre">
                          {book.genre?.name || 'Tanpa Kategori'}
                        </span>
                      </td>
                      <td>
                        <div className="small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                          <i className="fa-regular fa-user me-1 text-muted"></i>
                          {book.author?.name || 'Penulis Tidak Diketahui'}
                        </div>
                      </td>
                      <td className="book-price-tag">
                        {formatRupiah(book.price)}
                      </td>
                      <td className="text-center">
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor:
                              book.stock > 5
                                ? 'var(--accent-secondary-light)'
                                : '#FAF4E5',
                            color:
                              book.stock > 5
                                ? 'var(--accent-secondary)'
                                : '#8C6D1F',
                            border:
                              book.stock > 5
                                ? '1px solid rgba(61, 90, 69, 0.25)'
                                : '1px solid rgba(184, 134, 11, 0.25)',
                            fontSize: '0.75rem',
                          }}
                        >
                          {book.stock} pcs
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            type="button"
                            className="btn-action-icon btn-action-edit"
                            title="Edit Naskah Buku"
                            onClick={() =>
                              setBookToEdit({
                                ...book,
                                genre_id: book.genre_id || book.genre?.id || 1,
                                author_id: book.author_id || book.author?.id || 1,
                              })
                            }
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon btn-action-delete"
                            title="Hapus Buku"
                            onClick={() => setBookToDelete(book)}
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <i className="fa-solid fa-book-open fs-2 mb-2 d-block"></i>
                    Belum ada data buku yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT BUKU */}
      {bookToEdit && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(35, 31, 32, 0.65)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content overflow-hidden">
              <div className="modal-header py-3 px-4">
                <h5 className="modal-title font-serif fw-bold" style={{ color: 'var(--text-primary)' }}>
                  <i className="fa-regular fa-pen-to-square me-2" style={{ color: 'var(--accent-primary)' }}></i>
                  Perbarui Naskah Buku (#{bookToEdit.id})
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setBookToEdit(null)}
                ></button>
              </div>

              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold small text-secondary">
                            Judul / Deskripsi Buku <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={bookToEdit.description}
                            onChange={(e) =>
                              setBookToEdit({ ...bookToEdit, description: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small text-secondary">
                            Penulis (Author)
                          </label>
                          <select
                            className="form-select"
                            value={bookToEdit.author_id}
                            onChange={(e) =>
                              setBookToEdit({ ...bookToEdit, author_id: e.target.value })
                            }
                          >
                            {authorList.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small text-secondary">
                            Kategori (Genre)
                          </label>
                          <select
                            className="form-select"
                            value={bookToEdit.genre_id}
                            onChange={(e) =>
                              setBookToEdit({ ...bookToEdit, genre_id: e.target.value })
                            }
                          >
                            {genreList.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small text-secondary">
                            Harga Satuan (IDR)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={bookToEdit.price}
                            onChange={(e) =>
                              setBookToEdit({ ...bookToEdit, price: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small text-secondary">
                            Stok Gudang
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={bookToEdit.stock}
                            onChange={(e) =>
                              setBookToEdit({ ...bookToEdit, stock: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold small text-secondary">
                            URL Sampul Buku
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={bookToEdit.cover_photo || ''}
                            onChange={(e) =>
                              setBookToEdit({ ...bookToEdit, cover_photo: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    <div className="col-md-4 d-flex flex-column align-items-center justify-content-center p-3 rounded" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                      <span className="small text-muted fw-semibold mb-2">Pratinjau Sampul</span>
                      <div className="image-preview-frame">
                        {bookToEdit.cover_photo ? (
                          <img
                            src={bookToEdit.cover_photo}
                            alt="Pratinjau"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                            }}
                          />
                        ) : (
                          <i className="fa-solid fa-book-open text-muted fs-3"></i>
                        )}
                      </div>
                      <small className="text-muted mt-2 text-center" style={{ fontSize: '0.75rem' }}>
                        Proporsi fisik 2:3
                      </small>
                    </div>
                  </div>
                </div>

                <div className="modal-footer py-3 px-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setBookToEdit(null)}
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check me-2"></i>
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS BUKU */}
      {bookToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(35, 31, 32, 0.65)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content overflow-hidden">
              <div className="modal-header py-3 px-4">
                <h5 className="modal-title font-serif fw-bold" style={{ color: '#B93822' }}>
                  <i className="fa-solid fa-triangle-exclamation me-2"></i>
                  Konfirmasi Penghapusan Buku
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setBookToDelete(null)}
                  disabled={isSubmitting}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="mb-2" style={{ color: 'var(--text-primary)' }}>
                  Apakah Anda yakin ingin menghapus buku berikut dari sistem?
                </p>
                <div className="p-3 rounded mb-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <h6 className="font-serif fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {bookToDelete.description}
                  </h6>
                  <small className="text-muted d-block">
                    ID: #{bookToDelete.id} | Penulis: {bookToDelete.author?.name || '-'} | Genre: {bookToDelete.genre?.name || '-'}
                  </small>
                </div>
                <small className="text-danger d-block">
                  * Data yang dihapus tidak dapat dipulihkan kembali dari database.
                </small>
              </div>

              <div className="modal-footer py-3 px-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setBookToDelete(null)}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-4 fw-semibold"
                  onClick={handleDeleteBook}
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#B93822', borderColor: '#B93822' }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-trash-can me-2"></i>
                      Hapus Permanen
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBooks