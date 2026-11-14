import { useLocation, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

/**
 * Halaman Unauthorized (403 Forbidden)
 * Ditampilkan saat pengguna yang sudah login mencoba mengakses rute yang tidak sesuai hak akses/perannya.
 */
function Unauthorized() {
  const { user } = useAuth()
  const location = useLocation()

  const requiredRoles = location.state?.requiredRoles || ['admin']
  const targetPath = location.state?.from?.pathname || '/admin'

  return (
    <div className="unauthorized-page py-5 bg-body-tertiary">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-danger bg-gradient text-white text-center py-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-25 rounded-circle p-3 mb-2">
                  <i className="fa-solid fa-shield-halved fs-1 text-white"></i>
                </div>
                <h1 className="h3 fw-bold mb-1">403 - Akses Ditolak</h1>
                <p className="mb-0 opacity-75 small">
                  Otorisasi Gagal: Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
              </div>

              <div className="card-body p-4 p-md-5">
                <div className="alert alert-warning border-warning-subtle d-flex align-items-start gap-3 mb-4">
                  <i className="fa-solid fa-triangle-exclamation fs-4 text-warning flex-shrink-0 mt-1"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Batasan Hak Akses</h6>
                    <p className="mb-0 small text-secondary">
                      Halaman yang Anda tuju (<code>{targetPath}</code>) hanya dapat diakses oleh akun dengan peran{' '}
                      <strong>{requiredRoles.map((r) => r.toUpperCase()).join(', ')}</strong>.
                      Akun Anda saat ini tidak memiliki hak akses tersebut.
                    </p>
                  </div>
                </div>

                {/* Status Pengguna Saat Ini */}
                <div className="bg-light rounded-3 p-3 mb-4 border">
                  <h6 className="fw-semibold text-muted text-uppercase fs-7 mb-3">
                    <i className="fa-solid fa-id-badge me-2 text-primary"></i>
                    Informasi Akun Saat Ini
                  </h6>
                  <div className="row g-2 small">
                    <div className="col-sm-4 text-secondary">Nama Pengguna:</div>
                    <div className="col-sm-8 fw-semibold">{user?.fullName || 'Tamu'}</div>

                    <div className="col-sm-4 text-secondary">Username:</div>
                    <div className="col-sm-8">@{user?.username || '-'}</div>

                    <div className="col-sm-4 text-secondary">Peran Aktif:</div>
                    <div className="col-sm-8">
                      <span
                        className={`badge ${
                          user?.role === 'admin' ? 'bg-danger' : 'bg-primary'
                        } px-2 py-1 text-uppercase`}
                      >
                        <i
                          className={`fa-solid ${
                            user?.role === 'admin' ? 'fa-user-shield' : 'fa-user'
                          } me-1`}
                        ></i>
                        {user?.role || 'Guest'}
                      </span>
                    </div>

                    <div className="col-sm-4 text-secondary">Peran Dibutuhkan:</div>
                    <div className="col-sm-8">
                      {requiredRoles.map((role) => (
                        <span key={role} className="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle px-2 py-1 text-uppercase me-1">
                          <i className="fa-solid fa-lock me-1"></i>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="d-flex justify-content-center">
                  <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm">
                    <i className="fa-solid fa-house me-2"></i>
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>

              <div className="card-footer bg-light text-center py-3 border-top small text-muted">
                <i className="fa-solid fa-circle-info me-1 text-primary"></i>
                Halaman ini dilindungi oleh sistem otorisasi rute (Role-Based Access Control).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
