import { useState, useEffect } from 'react'
import axios from 'axios'

function AdminContacts({ onStatsChange }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [alert, setAlert] = useState(null)

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/contacts')
      const data = Array.isArray(res.data) ? res.data : []
      setContacts(data)
      if (typeof onStatsChange === 'function') {
        onStatsChange(data.length)
      }
    } catch (err) {
      console.error('Error fetching contacts:', err)
      setAlert({
        type: 'danger',
        message: 'Gagal memuat pesan masuk dari server.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await axios.delete(`/api/contacts/${deleteTarget.id}`)
      setContacts((prev) => {
        const updated = prev.filter((c) => c.id !== deleteTarget.id)
        if (typeof onStatsChange === 'function') {
          onStatsChange(updated.length)
        }
        return updated
      })
      setAlert({
        type: 'success',
        message: `Pesan dari "${deleteTarget.name}" berhasil dihapus.`,
      })
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting contact:', err)
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Gagal menghapus pesan.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter pencarian
  const filteredContacts = contacts.filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.message && c.message.toLowerCase().includes(q))
    )
  })

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSubjectBadge = (subject) => {
    const s = (subject || '').toLowerCase()
    if (s.includes('ketersediaan') || s.includes('pertanyaan')) {
      return 'bg-primary-subtle text-primary border border-primary-subtle'
    }
    if (s.includes('status') || s.includes('pesanan')) {
      return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
    }
    if (s.includes('rekomendasi')) {
      return 'bg-info-subtle text-info-emphasis border border-info-subtle'
    }
    if (s.includes('kerjasama')) {
      return 'bg-success-subtle text-success border border-success-subtle'
    }
    if (s.includes('kritik') || s.includes('saran')) {
      return 'bg-danger-subtle text-danger border border-danger-subtle'
    }
    return 'bg-secondary-subtle text-secondary border border-secondary-subtle'
  }

  return (
    <div>
      {/* Alert Notifikasi */}
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
          <i
            className={`fa-solid ${
              alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'
            } me-2`}
          ></i>
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Action Bar & Filter */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Cari nama pengirim, email, subjek, atau isi pesan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => setSearch('')}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-auto d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
              onClick={fetchContacts}
              disabled={loading}
              title="Muat ulang pesan"
            >
              <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i>
              <span>Refresh</span>
            </button>
            <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
              Total: {contacts.length} Pesan
            </span>
          </div>
        </div>
      </div>

      {/* Konten Daftar Pesan */}
      {loading ? (
        <div className="card border-0 shadow-sm rounded-3 p-5 text-center bg-white">
          <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
          <p className="text-secondary mb-0">Memuat pesan masuk dari database...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-3 p-5 text-center bg-white">
          <div className="text-muted fs-1 mb-3">
            <i className="fa-regular fa-envelope-open"></i>
          </div>
          <h5 className="fw-bold text-dark">
            {search ? 'Tidak ada pesan yang cocok dengan pencarian' : 'Belum Ada Pesan Masuk'}
          </h5>
          <p className="text-secondary small mb-0">
            {search
              ? `Kata kunci "${search}" tidak ditemukan pada daftar pesan.`
              : 'Pesan yang dikirim oleh pelanggan melalui formulir Contact akan tersimpan dan tampil di sini.'}
          </p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-3 text-center" style={{ width: '60px' }}>#</th>
                  <th scope="col">Pengirim</th>
                  <th scope="col">Kategori / Subjek</th>
                  <th scope="col">Ringkasan Pesan</th>
                  <th scope="col">Waktu Masuk</th>
                  <th scope="col" className="text-end pe-3" style={{ width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((c, index) => (
                  <tr key={c.id}>
                    <td className="ps-3 text-center fw-semibold text-secondary">
                      {index + 1}
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{c.name}</div>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-decoration-none small text-primary d-inline-flex align-items-center gap-1"
                      >
                        <i className="fa-regular fa-envelope"></i>
                        {c.email}
                      </a>
                    </td>
                    <td>
                      <span className={`badge px-2 py-1 rounded-pill ${getSubjectBadge(c.subject)}`}>
                        {c.subject || 'Pertanyaan Umum'}
                      </span>
                    </td>
                    <td>
                      <p
                        className="mb-0 text-secondary small text-truncate"
                        style={{ maxWidth: '320px' }}
                        title={c.message}
                      >
                        {c.message}
                      </p>
                    </td>
                    <td>
                      <small className="text-muted">
                        <i className="fa-regular fa-clock me-1"></i>
                        {formatDate(c.created_at)}
                      </small>
                    </td>
                    <td className="text-end pe-3">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          title="Baca Pesan Lengkap"
                          onClick={() => setSelectedContact(c)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          title="Hapus Pesan"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-white border-top-0 py-3 text-secondary small">
            Menampilkan <strong>{filteredContacts.length}</strong> dari <strong>{contacts.length}</strong> pesan masuk.
          </div>
        </div>
      )}

      {/* Modal Baca Pesan Lengkap */}
      {selectedContact && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="fa-solid fa-envelope-open-text text-primary"></i>
                  Detail Pesan Kontak
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedContact(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-4 pb-3 border-bottom">
                  <div className="col-md-6">
                    <small className="text-muted d-block">Nama Pengirim:</small>
                    <strong className="fs-6 text-dark">{selectedContact.name}</strong>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Alamat Email:</small>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Kategori / Subjek:</small>
                    <span className={`badge px-2 py-1 rounded-pill ${getSubjectBadge(selectedContact.subject)}`}>
                      {selectedContact.subject || 'Pertanyaan Umum'}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Waktu Pengiriman:</small>
                    <span className="text-secondary small">
                      {formatDate(selectedContact.created_at)}
                    </span>
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold text-dark mb-2">Isi Pesan:</h6>
                  <div
                    className="p-3 bg-light rounded-3 text-dark border"
                    style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                  >
                    {selectedContact.message}
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <a
                  href={`mailto:${selectedContact.email}?subject=Balasan: ${encodeURIComponent(selectedContact.subject || 'Pertanyaan Buku')}`}
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                >
                  <i className="fa-solid fa-reply"></i>
                  Balas via Email
                </a>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedContact(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  Konfirmasi Hapus Pesan
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                ></button>
              </div>
              <div className="modal-body py-3">
                <p className="mb-2">
                  Apakah Anda yakin ingin menghapus pesan dari <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
                </p>
                <div className="p-2 bg-light rounded text-muted small fst-italic border">
                  "{deleteTarget.message?.length > 100 ? deleteTarget.message.slice(0, 100) + '...' : deleteTarget.message}"
                </div>
                <small className="text-danger mt-2 d-block">
                  * Tindakan ini tidak dapat dibatalkan.
                </small>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger d-inline-flex align-items-center gap-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-trash-can"></i>
                      <span>Hapus Permanen</span>
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

export default AdminContacts