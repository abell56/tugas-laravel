import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

/**
 * Halaman Profil Pengguna & Riwayat Transaksi (Profile)
 * Menampilkan kartu profil dan riwayat pesanan bergaya tanda terima fisik (receipt-style).
 */
function Profile() {
  const { user, isAdmin, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0)
  }

  // =========================================================================
  // FETCH RIWAYAT PESANAN DARI DATABASE
  // =========================================================================
  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoadingOrders(true)
      try {
        const endpoint = user?.id
          ? `/api/transactions?customer_id=${user.id}`
          : '/api/transactions'
        const res = await fetch(endpoint)
        if (res.ok) {
          const data = await res.json()
          setOrders(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Gagal mengambil riwayat transaksi:', err)
      } finally {
        setLoadingOrders(false)
      }
    }

    if (user) {
      fetchUserOrders()
    } else {
      setLoadingOrders(false)
    }
  }, [user])

  return (
    <div className="py-5">
      <div className="container">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 pb-3 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
            <span
              className="badge rounded-pill px-3 py-1 mb-2"
              style={{
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(200, 90, 50, 0.25)',
              }}
            >
              <i className="fa-regular fa-id-badge me-1"></i> Akun Anggota
            </span>
            <h1 className="editorial-heading fw-bold mb-1">
              Profil & Riwayat Transaksi
            </h1>
            <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
              Kelola informasi akun pembaca dan pantau status penerbitan serta pengiriman pesanan Anda.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Kolom Kiri: Kartu Identitas Pengguna */}
          <div className="col-12 col-lg-4">
            <div
              className="card p-4 text-center sticky-top"
              style={{
                top: '90px',
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="position-relative d-inline-block mx-auto mb-3">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.fullName || user?.name || 'User',
                    )}&background=FAF7F2&color=C85A32&size=128&bold=true`
                  }
                  alt={user?.fullName || user?.name}
                  className="rounded-circle shadow-sm"
                  style={{
                    width: '110px',
                    height: '110px',
                    objectFit: 'cover',
                    border: '3px solid var(--border-subtle)',
                  }}
                />
                <span
                  className="position-absolute bottom-0 end-0 badge rounded-pill px-2 py-1 text-uppercase"
                  style={{
                    backgroundColor: isAdmin ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    color: '#FFFDF9',
                    fontSize: '0.68rem',
                    border: '2px solid var(--bg-surface)',
                  }}
                >
                  {user?.role || 'customer'}
                </span>
              </div>

              <h4 className="font-serif fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {user?.fullName || user?.name || 'Pembaca Bookstore'}
              </h4>
              <p className="small text-muted mb-3">
                {user?.email || 'pembaca@bookstore.id'}
              </p>

              <div
                className="p-3 rounded-3 text-start mb-4 small"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Peran Akun:</span>
                  <span className="fw-semibold text-uppercase" style={{ color: 'var(--text-primary)' }}>
                    {user?.role || 'customer'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Total Pesanan:</span>
                  <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                    {orders.length} Transaksi
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary">Status Anggota:</span>
                  <span className="fw-semibold" style={{ color: 'var(--accent-secondary)' }}>
                    <i className="fa-solid fa-circle-check me-1"></i> Aktif Terverifikasi
                  </span>
                </div>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="btn btn-outline-primary w-100 rounded-pill mb-2 fw-semibold btn-sm"
                >
                  <i className="fa-solid fa-sliders me-1"></i> Buka Dashboard Admin
                </Link>
              )}

              <button
                type="button"
                className="btn btn-outline-secondary w-100 rounded-pill btn-sm"
                onClick={logout}
              >
                <i className="fa-solid fa-arrow-right-from-bracket me-1"></i> Keluar dari Akun
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Riwayat Pesanan Bergaya Receipt Card */}
          <div className="col-12 col-lg-8">
            <div className="card overflow-hidden">
              <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-receipt" style={{ color: 'var(--accent-primary)' }}></i>
                  <h5 className="font-serif fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>
                    Daftar Tanda Terima Pesanan
                  </h5>
                </div>
                <span
                  className="badge rounded-pill px-3 py-1"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {orders.length} Transaksi
                </span>
              </div>

              <div className="p-4">
                {loadingOrders ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-secondary spinner-border-sm me-2"></div>
                    <span className="small text-muted">Memuat arsip faktur transaksi...</span>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {orders.map((trx) => {
                      let coverImg = trx.book?.cover_photo
                      if (
                        !coverImg ||
                        (!coverImg.startsWith('http://') &&
                          !coverImg.startsWith('https://') &&
                          !coverImg.startsWith('/'))
                      ) {
                        coverImg =
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                      }

                      return (
                        <div key={trx.id} className="receipt-order-card">
                          {/* Receipt Top Header */}
                          <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom flex-wrap gap-2" style={{ borderColor: 'var(--border-subtle) !important' }}>
                            <div className="d-flex align-items-center gap-2">
                              <span className="receipt-order-number">
                                {trx.order_number}
                              </span>
                              <span className="receipt-stamp stamp-paid">
                                <i className="fa-solid fa-stamp me-1"></i> Lunas
                              </span>
                            </div>
                            <small className="text-muted">
                              Ref: #{trx.id} • Pembayaran Midtrans
                            </small>
                          </div>

                          {/* Receipt Body Item */}
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded overflow-hidden shadow-sm flex-shrink-0"
                              style={{
                                width: '54px',
                                height: '76px',
                                backgroundColor: 'var(--bg-secondary)',
                              }}
                            >
                              <img
                                src={coverImg}
                                alt={trx.book?.description || 'Buku'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.currentTarget.onerror = null
                                  e.currentTarget.src =
                                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                                }}
                              />
                            </div>

                            <div className="flex-grow-1">
                              <h6 className="font-serif fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                                {trx.book?.description || trx.book?.title || 'Karya Buku Terpilih'}
                              </h6>
                              <div className="small text-secondary mb-1">
                                Karya {trx.book?.author?.name || 'Penulis Bookstore'}
                                <span className="mx-2">•</span>
                                <span className="book-card-genre">
                                  {trx.book?.genre?.name || 'Katalog Resmi'}
                                </span>
                              </div>
                              <div className="book-price-tag fs-6">
                                Total: {formatRupiah(trx.total_amount)}
                              </div>
                            </div>

                            <Link
                              to="/book"
                              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                            >
                              Beli Lagi
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fa-solid fa-receipt text-muted fs-1 mb-3"></i>
                    <h5 className="font-serif fw-bold mb-1">Belum Ada Riwayat Pesanan</h5>
                    <p className="small text-muted mb-3">
                      Buku yang Anda beli akan langsung tercatat sebagai faktur resmi di halaman ini.
                    </p>
                    <Link to="/book" className="btn btn-primary btn-sm rounded-pill px-4">
                      <i className="fa-solid fa-book-open me-1"></i> Mulai Memilih Buku
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile