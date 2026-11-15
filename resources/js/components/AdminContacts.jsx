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
          <div>{alert.message}</div>
          <button type="button" className="btn-close ms-auto" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Action Bar & Filter */}
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
                placeholder="Cari pengirim, email, subjek, atau isi surat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ backgroundColor: 'var(--bg-surface)' }}
              />
              {search && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-auto d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-2"
              onClick={fetchContacts}
              disabled={loading}
              title="Muat ulang pesan"
            >
              <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i>
              <span>Perbarui</span>
            </button>
            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Total: {contacts.length} Surat Masuk
            </span>
          </div>
        </div>
      </div>

      {/* Konten Daftar Pesan */}
      {loading ? (
        <div className="card p-5 text-center">
          <div className="spinner-border text-secondary mx-auto mb-3" role="status"></div>
          <p className="small text-muted mb-0">Mengambil surat masuk pelanggan dari database...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="card p-5 text-center">
          <div className="text-muted fs-1 mb-3">
            <i className="fa-regular fa-envelope-open"></i>
          </div>
          <h5 className="font-serif fw-bold text-dark">
            {search ? 'Tidak ada surat yang cocok dengan pencarian' : 'Kotak Surat Masuk Masih Bersih'}
          </h5>
          <p className="text-secondary small mb-0">
            {search
              ? `Kata kunci "${search}" tidak ditemukan pada arsip pesan.`
              : 'Surat dan masukan yang dikirim oleh pembaca melalui formulir kontak akan tercatat di sini.'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col" className="ps-4 text-center" style={{ width: '60px' }}>#</th>
                  <th scope="col">Nama & Email Pengirim</th>
                  <th scope="col">Subjek / Topik</th>
                  <th scope="col">Ringkasan Surat</th>
                  <th scope="col">Waktu</th>
                  <th scope="col" className="text-center" style={{ width: '100px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((c, index) => (
                  <tr key={c.id}>
                    <td className="ps-4 text-center fw-semibold text-muted small">
                      {index + 1}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{c.name}</div>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-decoration-none small d-inline-flex align-items-center gap-1"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <i className="fa-regular fa-envelope" style={{ fontSize: '0.78rem' }}></i>
                        {c.email}
                      </a>
                    </td>
                    <td>
                      <span className="book-card-genre">
                        {c.subject || 'Pertanyaan Umum'}
                      </span>
                    </td>
                    <td>
                      <p
                        className="mb-0 small text-secondary text-truncate"
                        style={{ maxWidth: '280px' }}
                        title={c.message}
                      >
                        {c.message}
                      </p>
                    </td>
                    <td>
                      <small className="text-muted">
                        {formatDate(c.created_at)}
                      </small>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <button
                          type="button"
                          className="btn-action-icon btn-action-edit"
                          title="Buka Surat Lengkap"
                          onClick={() => setSelectedContact(c)}
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon btn-action-delete"
                          title="Hapus Surat"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer py-3 text-secondary small">
            Menampilkan <strong>{filteredContacts.length}</strong> dari <strong>{contacts.length}</strong> surat masuk.
          </div>
        </div>
      )}

      {/* Modal Baca Pesan Lengkap */}
      {selectedContact && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(35, 31, 32, 0.65)', zIndex: 1050 }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content overflow-hidden">
              <div className="modal-header py-3 px-4">
                <h5 className="modal-title font-serif fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="fa-solid fa-envelope-open-text" style={{ color: 'var(--accent-primary)' }}></i>
                  Detail Surat Pembaca
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedContact(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Pengirim:</small>
                    <strong className="fs-6 text-dark font-serif">{selectedContact.name}</strong>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Alamat Email:</small>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-decoration-none fw-semibold"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Topik / Subjek:</small>
                    <span className="book-card-genre mt-1">
                      {selectedContact.subject || 'Pertanyaan Umum'}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Diterima Pada:</small>
                    <span className="text-secondary small">
                      {formatDate(selectedContact.created_at)}
                    </span>
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                    Isi Pesan Surat:
                  </h6>
                  <div
                    className="p-4 rounded-3"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.7',
                    }}
                  >
                    {selectedContact.message}
                  </div>
                </div>
              </div>
              <div className="modal-footer py-3 px-4">
                <a
                  href={`mailto:${selectedContact.email}?subject=Balasan Bookstore: ${encodeURIComponent(selectedContact.subject || 'Pertanyaan')}`}
                  className="btn btn-primary rounded-pill px-4 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  <i className="fa-solid fa-reply"></i>
                  Balas via Email
                </a>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
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
          style={{ backgroundColor: 'rgba(35, 31, 32, 0.65)', zIndex: 1050 }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content overflow-hidden">
              <div className="modal-header py-3 px-4">
                <h5 className="modal-title font-serif fw-bold" style={{ color: '#B93822' }}>
                  <i className="fa-solid fa-triangle-exclamation me-2"></i>
                  Hapus Surat Masuk
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                ></button>
              </div>
              <div className="modal-body p-4">
                <p className="mb-2" style={{ color: 'var(--text-primary)' }}>
                  Apakah Anda yakin ingin menghapus surat dari <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
                </p>
                <div className="p-3 rounded small text-muted fst-italic" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  &ldquo;{deleteTarget.message?.length > 120 ? deleteTarget.message.slice(0, 120) + '...' : deleteTarget.message}&rdquo;
                </div>
                <small className="text-danger mt-2 d-block">
                  * Tindakan ini tidak dapat dibatalkan.
                </small>
              </div>
              <div className="modal-footer py-3 px-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-4 fw-semibold"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ backgroundColor: '#B93822', borderColor: '#B93822' }}
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus Surat'}
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