import { useState, useEffect } from 'react'

function AdminOrders({ onStatsChange }) {
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [alert, setAlert] = useState(null)

  const triggerAlert = (text, type = 'success') => {
    setAlert({ text, type })
    setTimeout(() => setAlert(null), 4000)
  }

  const formatRupiah = (val) => {
    const num = Number(val) || 0
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/transactions')
      if (res.ok) {
        const data = await res.json()
        setOrderList(data)
        if (onStatsChange) onStatsChange(data.length)
      }
    } catch (err) {
      console.error('Gagal mengambil data transaksi:', err)
      triggerAlert('Gagal memuat data transaksi dari server.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/transactions/${orderToDelete.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        triggerAlert(`Pesanan "${orderToDelete.order_number}" berhasil dihapus.`)
        setOrderList((prev) => prev.filter((o) => o.id !== orderToDelete.id))
        setOrderToDelete(null)
      } else {
        triggerAlert('Gagal menghapus pesanan.', 'danger')
      }
    } catch {
      triggerAlert('Terjadi kesalahan saat menghapus pesanan.', 'danger')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredOrders = orderList.filter((o) => {
    const q = searchQuery.toLowerCase().trim()
    return (
      !q ||
      o.order_number.toLowerCase().includes(q) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
      (o.customer?.email && o.customer.email.toLowerCase().includes(q)) ||
      (o.book?.description && o.book.description.toLowerCase().includes(q)) ||
      String(o.id).includes(q)
    )
  })

  // Perhitungan statistik omzet
  const totalRevenue = orderList.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0)
  const uniqueCustomers = new Set(orderList.map((o) => o.customer_id)).size

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

      {/* Ringkasan Statistik Pesanan & Omzet */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
            <span className="text-muted small fw-semibold text-uppercase">Total Pesanan Masuk</span>
            <h4 className="fw-bold text-dark mb-0">{orderList.length} Transaksi</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
            <span className="text-muted small fw-semibold text-uppercase">Total Pendapatan (Omzet)</span>
            <h4 className="fw-bold text-success mb-0">{formatRupiah(totalRevenue)}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
            <span className="text-muted small fw-semibold text-uppercase">Pelanggan Aktif Belanja</span>
            <h4 className="fw-bold text-primary mb-0">{uniqueCustomers} Pelanggan</h4>
          </div>
        </div>
      </div>

      {/* Action Bar Search */}
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
                placeholder="Cari nomor pesanan, nama pembeli, atau buku..."
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
          <div className="col-12 col-md-auto text-muted small">
            Menampilkan <strong>{filteredOrders.length}</strong> dari {orderList.length} transaksi
          </div>
        </div>
      </div>

      {/* TABEL LIST PESANAN BUKU */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold text-dark">
            <i className="fa-solid fa-receipt text-primary me-2"></i>
            Daftar Pesanan Buku Masuk ({filteredOrders.length})
          </h6>
          <span className="badge bg-light text-secondary border">Tabel `transactions` MariaDB</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th style={{ width: '60px' }} className="text-center">#ID</th>
                <th>Nomor Pesanan</th>
                <th>Pemesan (Customer)</th>
                <th>Buku yang Dipesan</th>
                <th>Total Tagihan</th>
                <th className="text-center">Status Pembayaran</th>
                <th style={{ width: '80px' }} className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Memuat daftar transaksi pesanan dari database...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((trx) => {
                  let cover = trx.book?.cover_photo
                  if (
                    !cover ||
                    (!cover.startsWith('http://') &&
                      !cover.startsWith('https://') &&
                      !cover.startsWith('/'))
                  ) {
                    cover =
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                  }

                  return (
                    <tr key={trx.id}>
                      <td className="text-center fw-bold text-muted small">#{trx.id}</td>
                      <td>
                        <span className="badge bg-primary font-monospace fs-7 px-2 py-1">
                          {trx.order_number}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">
                          {trx.customer?.name || 'Pelanggan #' + trx.customer_id}
                        </div>
                        <small className="text-muted">{trx.customer?.email || '-'}</small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={cover}
                            alt="cover"
                            className="rounded shadow-sm"
                            style={{ width: '38px', height: '52px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                            }}
                          />
                          <div>
                            <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '220px' }}>
                              {trx.book?.description || 'Buku #' + trx.book_id}
                            </div>
                            <small className="text-muted">
                              {trx.book?.author?.name || 'Penulis'} • {trx.book?.genre?.name || 'Kategori'}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold text-success">
                        {formatRupiah(trx.total_amount)}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
                          <i className="fa-solid fa-circle-check me-1"></i> Lunas (Midtrans)
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          title="Hapus Transaksi"
                          onClick={() => setOrderToDelete(trx)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Tidak ada transaksi pesanan yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS PESANAN */}
      {orderToDelete && (
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
                  Hapus Data Pesanan
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOrderToDelete(null)}
                ></button>
              </div>

              <div className="modal-body p-4 text-center">
                <div
                  className="rounded-circle bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.8rem' }}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Hapus Pesanan Ini?</h5>
                <p className="text-secondary mb-0">
                  Apakah Anda yakin ingin menghapus transaksi{' '}
                  <strong>&quot;{orderToDelete.order_number}&quot;</strong> senilai{' '}
                  <strong>{formatRupiah(orderToDelete.total_amount)}</strong>?
                </p>
              </div>

              <div className="modal-footer bg-light border-top py-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setOrderToDelete(null)}
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm"
                  onClick={handleDeleteOrder}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Menghapus...' : 'Ya, Hapus Pesanan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
