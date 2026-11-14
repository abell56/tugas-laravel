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
        setBookList(data)
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
          cover_photo:
            formData.cover_photo.trim() ||
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop',
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
        triggerAlert(result.message || 'Gagal menambahkan buku.', 'danger')
      }
    } catch {
      triggerAlert('Terjadi kesalahan koneksi saat menambahkan buku.', 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Submit Update Buku
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!bookToEdit || !bookToEdit.description.trim()) {
      alert('Judul / Deskripsi buku wajib diisi!')
      return
    }

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
          description: bookToEdit.description.trim(),
          price: Number(bookToEdit.price) || 0,
          stock: Number(bookToEdit.stock) || 0,
          cover_photo: bookToEdit.cover_photo || '',
          genre_id: Number(bookToEdit.genre_id) || (genreList[0]?.id || 1),
          author_id: Number(bookToEdit.author_id) || (authorList[0]?.id || 1),
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (response.ok) {
        triggerAlert(`Buku "${bookToEdit.description.trim()}" berhasil diperbarui!`)
        setBookToEdit(null)
        fetchBooks()
      } else {
        triggerAlert(result.message || 'Gagal memperbarui buku.', 'danger')
      }
    } catch {
      triggerAlert('Terjadi kesalahan saat memperbarui buku.', 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Confirm Delete Buku
  const confirmDelete = async () => {
    if (!bookToDelete) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/books/${bookToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Role': 'admin',
        },
      })

      const result = await response.json().catch(() => ({}))
      if (response.ok) {
        triggerAlert(`Buku "${bookToDelete.description}" berhasil dihapus dari database!`)
        setBookList((prev) => prev.filter((b) => b.id !== bookToDelete.id))
        setBookToDelete(null)
      } else {
        triggerAlert(result.message || 'Gagal menghapus buku.', 'danger')
      }
    } catch {
      triggerAlert('Terjadi kesalahan saat menghapus buku.', 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format Rupiah
  const formatRupiah = (val) => {
    const num = Number(val) || 0
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
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
          className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mb-4`}
          role="alert"
        >
          <i
            className={`fa-solid ${
              alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'
            } me-2`}
          ></i>
          {alert.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
        </div>
      )}

      {/* Action Bar: Search & Tombol Tambah */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 shadow-none"
                placeholder="Cari judul, penulis, kategori, atau ID..."
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
              {showCreateForm ? 'Tutup Formulir' : 'Tambah Buku Baru'}
            </button>
          </div>
        </div>
      </div>

      {/* FORMULIR CREATE BUKU */}
      {showCreateForm && (
        <div className="card border-0 shadow-sm rounded-3 bg-white mb-4 p-2">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
              <div>
                <h5 className="mb-1 fw-bold text-dark">
                  <i className="fa-solid fa-square-plus text-primary me-2"></i>
                  Formulir Tambah Buku (Database MySQL)
                </h5>
                <p className="text-secondary small mb-0">
                  Data buku baru akan langsung tersimpan ke tabel <code>books</code>.
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
                <div className="col-md-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Judul Buku / Deskripsi Lengkap <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    placeholder="Contoh: Bumi Manusia - Novel Sejarah"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Penulis (Author) <span className="text-danger">*</span>
                  </label>
                  <select
                    name="author_id"
                    className="form-select"
                    value={formData.author_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Pilih Penulis dari DB --</option>
                    {authorList.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Kategori (Genre) <span className="text-danger">*</span>
                  </label>
                  <select
                    name="genre_id"
                    className="form-select"
                    value={formData.genre_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Pilih Kategori dari DB --</option>
                    {genreList.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Harga (Rp) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="Contoh: 95000"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Stok Buku <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    placeholder="Contoh: 20"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label fw-semibold small text-secondary">
                    URL Foto Sampul (Cover Photo)
                  </label>
                  <input
                    type="text"
                    name="cover_photo"
                    className="form-control"
                    placeholder="Contoh: https://... atau biarkan kosong untuk sampul default"
                    value={formData.cover_photo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setShowCreateForm(false)}
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
                        <i className="fa-solid fa-save me-1"></i> Simpan Buku ke DB
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABEL DAFTAR BUKU */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold text-dark">
            <i className="fa-solid fa-book text-primary me-2"></i>
            Daftar Seluruh Buku ({filteredBooks.length})
          </h6>
          <span className="badge bg-light text-secondary border">
            Tersinkronisasi MySQL
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th style={{ width: '60px' }} className="text-center">#ID</th>
                <th style={{ width: '80px' }}>Sampul</th>
                <th>Judul & Deskripsi</th>
                <th>Kategori (Genre)</th>
                <th>Penulis (Author)</th>
                <th>Harga</th>
                <th className="text-center">Stok</th>
                <th style={{ width: '130px' }} className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
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
                        <img
                          src={img}
                          alt={book.description}
                          className="rounded shadow-sm"
                          style={{ width: '48px', height: '64px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{book.description}</div>
                        <small className="text-muted">
                          ID: {book.id} | Ditambahkan ke sistem
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">
                          {book.genre?.name || 'Tanpa Kategori'}
                        </span>
                      </td>
                      <td>
                        <div className="fw-medium text-dark">
                          <i className="fa-solid fa-user-pen text-secondary me-1 small"></i>
                          {book.author?.name || 'Penulis Tidak Diketahui'}
                        </div>
                      </td>
                      <td className="fw-bold text-primary">
                        {formatRupiah(book.price)}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            book.stock > 5 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                          } px-2 py-1 rounded-pill`}
                        >
                          {book.stock} pcs
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-warning"
                            title="Edit Buku"
                            onClick={() =>
                              setBookToEdit({
                                ...book,
                                genre_id: book.genre_id || book.genre?.id || 1,
                                author_id: book.author_id || book.author?.id || 1,
                              })
                            }
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Hapus Buku"
                            onClick={() => setBookToDelete(book)}
                          >
                            <i className="fa-solid fa-trash-can"></i>
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
                    Belum ada data buku yang sesuai dengan pencarian.
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
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-warning-subtle border-bottom py-3">
                <h5 className="modal-title fw-bold text-dark">
                  <i className="fa-solid fa-pen-to-square text-warning me-2"></i>
                  Edit Data Buku (#{bookToEdit.id})
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
                        Harga (Rp)
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
                        Stok Buku
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
                        URL Foto Sampul (Cover Photo)
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

                <div className="modal-footer bg-light border-top py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setBookToEdit(null)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning rounded-pill px-4 fw-semibold text-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-save me-1"></i> Simpan Perubahan
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
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-danger-subtle text-danger border-bottom py-3">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-triangle-exclamation me-2"></i>
                  Konfirmasi Hapus Buku
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setBookToDelete(null)}
                ></button>
              </div>

              <div className="modal-body p-4 text-center">
                <div
                  className="rounded-circle bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.8rem' }}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Hapus Buku Ini?</h5>
                <p className="text-secondary mb-0">
                  Apakah Anda yakin ingin menghapus buku <strong>&quot;{bookToDelete.description}&quot;</strong>?
                  Data akan dihapus permanen dari database.
                </p>
              </div>

              <div className="modal-footer bg-light border-top py-3">
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
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-trash-can me-1"></i> Ya, Hapus Buku
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
