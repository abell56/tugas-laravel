import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

/**
 * Halaman Profil Pengguna (Profile)
 * Menampilkan rincian identitas akun, status peran, dan Riwayat Pesanan Buku dari database MySQL.
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
        // Ambil transaksi user berdasarkan user.id atau ambil semua jika admin
        const endpoint = user?.id
          ? `/api/transactions?customer_id=${user.id}`
          : '/api/transactions'
        const res = await fetch(endpoint)
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
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
    <div className="profile-page py-5 bg-body-tertiary">
      <div className="container">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item">
                  <Link to="/" className="text-decoration-none">
                    <i className="fa-solid fa-house me-1"></i>
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Profil Akun
                </li>
              </ol>
            </nav>
            <h1 className="h3 fw-bold text-dark mb-1">
              <i className="fa-solid fa-circle-user text-primary me-2"></i>
              Profil Saya
            </h1>
            <p className="text-secondary small mb-0">
              Kelola informasi profil, riwayat pesanan, dan kredensial akun Anda.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Kolom Kiri: Kartu Identitas Pengguna */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 text-center p-4">
              <div className="position-relative d-inline-block mx-auto mb-3">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.fullName || user?.name || 'User',
                    )}&background=0d6efd&color=fff&size=128`
                  }
                  alt={user?.fullName || user?.name}
                  className="rounded-circle img-thumbnail shadow-sm"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <span
                  className={`position-absolute bottom-0 end-0 badge rounded-pill ${
                    isAdmin ? 'bg-danger' : 'bg-primary'
                  } p-2 border border-2 border-white`}
                  title={`Peran: ${user?.role}`}
                >
                  <i className={`fa-solid ${isAdmin ? 'fa-shield-halved' : 'fa-user'}`}></i>
                </span>
              </div>

              <h4 className="fw-bold mb-1 text-dark">{user?.fullName || user?.name}</h4>
              <p className="text-muted small mb-2">@{user?.username || 'user'}</p>

              <div className="mb-3">
                <span
                  className={`badge px-3 py-2 text-uppercase fs-7 rounded-pill ${
                    isAdmin
                      ? 'bg-danger bg-opacity-10 text-danger border border-danger-subtle'
                      : 'bg-primary bg-opacity-10 text-primary border border-primary-subtle'
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      isAdmin ? 'fa-user-shield' : 'fa-circle-check'
                    } me-1`}
                  ></i>
                  {isAdmin ? 'Administrator' : 'Pengguna Biasa (Customer)'}
                </span>
              </div>

              <p className="small text-secondary px-2 mb-4">
                {user?.bio || 'Pengguna resmi Bookstore.'}
              </p>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                {isAdmin && (
                  <Link to="/admin" className="btn btn-danger rounded-pill fw-semibold shadow-sm">
                    <i className="fa-solid fa-gauge-high me-2"></i>
                    Buka Dashboard Admin
                  </Link>
                )}

                <Link to="/cart" className="btn btn-outline-primary rounded-pill fw-semibold">
                  <i className="fa-solid fa-cart-shopping me-2"></i>
                  Keranjang Belanja
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill fw-semibold"
                  onClick={logout}
                >
                  <i className="fa-solid fa-right-from-bracket me-2"></i>
                  Keluar (Logout)
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Rincian Akun & Riwayat Pesanan */}
          <div className="col-12 col-lg-8">
            {/* RIWAYAT PESANAN BUKU DARI DATABASE */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="fa-solid fa-receipt text-primary me-2"></i>
                  Riwayat Pesanan Buku
                </h5>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                  {orders.length} Transaksi
                </span>
              </div>

              <div className="card-body p-4">
                {loadingOrders ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Memuat riwayat transaksi dari database...
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
                        <div
                          key={trx.id}
                          className="card border rounded-3 p-3 shadow-none bg-body-tertiary"
                        >
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3 flex-wrap gap-2">
                            <div>
                              <span className="badge bg-primary font-monospace me-2">
                                {trx.order_number}
                              </span>
                              <span className="badge bg-success">
                                <i className="fa-solid fa-circle-check me-1"></i>
                                Lunas (Midtrans Paid)
                              </span>
                            </div>
                            <small className="text-muted">
                              ID Transaksi: #{trx.id}
                            </small>
                          </div>

                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={coverImg}
                              alt={trx.book?.description || 'Buku'}
                              className="rounded shadow-sm"
                              style={{ width: '56px', height: '76px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src =
                                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                              }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1 text-dark">
                                {trx.book?.description || trx.book?.title || 'Judul Buku'}
                              </h6>
                              <div className="small text-secondary mb-1">
                                <i className="fa-solid fa-user-pen me-1"></i>
                                {trx.book?.author?.name || 'Penulis Bookstore'}
                                <span className="mx-2">•</span>
                                <span className="badge bg-light text-secondary border">
                                  {trx.book?.genre?.name || 'Umum'}
                                </span>
                              </div>
                              <div className="fw-bold text-primary">
                                Total: {formatRupiah(trx.total_amount)}
                              </div>
                            </div>

                            <Link
                              to="/book"
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            >
                              Beli Lagi
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="fa-solid fa-bag-shopping fs-1 text-secondary mb-2 d-block"></i>
                    <h6 className="fw-semibold text-dark">Belum Ada Riwayat Pesanan</h6>
                    <p className="small mb-3">
                      Anda belum pernah melakukan pemesanan buku. Mulai belanja sekarang!
                    </p>
                    <Link to="/book" className="btn btn-primary btn-sm rounded-pill px-4">
                      <i className="fa-solid fa-book-open me-1"></i> Jelajahi Katalog Buku
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Rincian Akun */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-bottom py-3 px-4">
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="fa-solid fa-address-card text-primary me-2"></i>
                  Informasi Akun
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">Nama Lengkap</label>
                    <p className="fw-semibold text-dark mb-0 fs-6">{user?.fullName || user?.name || '-'}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">Username</label>
                    <p className="fw-semibold text-dark mb-0 fs-6">@{user?.username || '-'}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">Alamat Email</label>
                    <p className="fw-semibold text-dark mb-0 fs-6">{user?.email || '-'}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">Peran / Role</label>
                    <p className="mb-0">
                      <span
                        className={`badge ${
                          isAdmin ? 'bg-danger' : 'bg-primary'
                        } text-uppercase px-2 py-1`}
                      >
                        {user?.role || 'customer'}
                      </span>
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">ID Pengguna</label>
                    <p className="fw-semibold text-dark mb-0 font-monospace">#{user?.id || '-'}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">Tanggal Terdaftar</label>
                    <p className="fw-semibold text-dark mb-0">{user?.registeredAt || 'Terdaftar Resmi'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
