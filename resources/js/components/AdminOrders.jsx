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
        const arr = Array.isArray(data) ? data : []
        setOrderList(arr)
        if (onStatsChange) onStatsChange(arr.length)
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
        headers: {
          'Accept': 'application/json',
          'X-Role': 'admin',
        },
      })
      if (res.ok) {
        triggerAlert(`Faktur pesanan "${orderToDelete.order_number}" berhasil dihapus.`)
        setOrderToDelete(null)
        fetchOrders()
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
      o.order_number?.toLowerCase().includes(q) ||
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

      {/* Ringkasan Statistik Pesanan & Omzet */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="admin-stat-card">
            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              Total Pesanan Masuk
            </span>
            <h4 className="font-serif fw-bold text-dark mb-0 mt-1">{orderList.length} Transaksi</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-stat-card">
            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              Total Omzet Penjualan
            </span>
            <h4 className="book-price-tag mb-0 mt-1 fs-4">{formatRupiah(totalRevenue)}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-stat-card">
            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              Pelanggan Bertransaksi
            </span>
            <h4 className="font-serif fw-bold text-dark mb-0 mt-1">{uniqueCustomers} Pembaca</h4>
          </div>
        </div>
      </div>

      {/* Action Bar Search */}
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
                placeholder="Cari nomor faktur ORD, nama pemesan, atau judul..."
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
          <div className="col-12 col-md-auto text-muted small">
            Menampilkan <strong>{filteredOrders.length}</strong> dari {orderList.length} transaksi
          </div>
        </div>
      </div>

      {/* TABEL LIST PESANAN BUKU */}
      <div className="card overflow-hidden">
        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-receipt" style={{ color: 'var(--accent-primary)' }}></i>
            <h6 className="font-serif fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
              Daftar Faktur Pesanan Masuk ({filteredOrders.length})
            </h6>
          </div>
          <span className="badge rounded-pill" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            Database `transactions`
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '60px' }} className="text-center">#ID</th>
                <th>Nomor Faktur</th>
                <th>Pemesan (Customer)</th>
                <th>Buku Dipesan</th>
                <th>Total Pembayaran</th>
                <th className="text-center">Status</th>
                <th style={{ width: '70px' }} className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <div className="spinner-border text-secondary spinner-border-sm me-2"></div>
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
                        <span className="receipt-order-number">
                          {trx.order_number}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">
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
                            style={{ width: '34px', height: '48px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                            }}
                          />
                          <div>
                            <div className="fw-semibold text-dark text-truncate font-serif" style={{ maxWidth: '200px' }}>
                              {trx.book?.description || 'Buku #' + trx.book_id}
                            </div>
                            <small className="text-muted">
                              {trx.book?.author?.name || 'Penulis'}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="book-price-tag">
                        {formatRupiah(trx.total_amount)}
                      </td>
                      <td className="text-center">
                        <span className="receipt-stamp stamp-paid">
                          <i className="fa-solid fa-check me-1"></i> Lunas (Midtrans)
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn-action-icon btn-action-delete"
                          title="Hapus Arsip Faktur"
                          onClick={() => setOrderToDelete(trx)}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <i className="fa-solid fa-receipt fs-2 mb-2 d-block"></i>
                    Belum ada data transaksi pesanan yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS ORDER */}
      {orderToDelete && (
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
                  Hapus Arsip Pesanan
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOrderToDelete(null)}
                  disabled={isDeleting}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="mb-2" style={{ color: 'var(--text-primary)' }}>
                  Apakah Anda yakin ingin menghapus data transaksi pesanan <strong>{orderToDelete.order_number}</strong>?
                </p>
                <div className="p-3 rounded mb-3 small" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div>Pemesan: <strong>{orderToDelete.customer?.name || 'Pelanggan'}</strong></div>
                  <div>Total Tagihan: <strong>{formatRupiah(orderToDelete.total_amount)}</strong></div>
                </div>
                <small className="text-danger d-block">
                  * Tindakan ini akan menghapus arsip dari database `transactions`.
                </small>
              </div>

              <div className="modal-footer py-3 px-4">
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
                  className="btn btn-danger rounded-pill px-4 fw-semibold"
                  onClick={handleDeleteOrder}
                  disabled={isDeleting}
                  style={{ backgroundColor: '#B93822', borderColor: '#B93822' }}
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus Transaksi'}
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