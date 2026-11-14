import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute Component
 * Bertanggung jawab membatasi akses rute berdasarkan status login dan peran (role) pengguna.
 *
 * @param {string[]} allowedRoles - Daftar role yang diizinkan mengakses rute ini, misalnya ['admin'] atau ['user', 'admin']
 * @param {string} redirectPath - Alamat tujuan redirect jika pengguna belum login (default: '/login')
 */
function ProtectedRoute({ allowedRoles = [], redirectPath = '/login', children }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Tampilkan loading spinner saat sesi sedang dibaca dari storage
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Memuat sesi...</span>
        </div>
      </div>
    )
  }

  // 1. Jika belum login, arahkan ke halaman login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectPath}
        state={{
          from: location,
          message: 'Halaman ini memerlukan autentikasi. Silakan masuk terlebih dahulu.',
        }}
        replace
      />
    )
  }

  // 2. Jika sudah login tetapi role tidak memenuhi kriteria akses
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          requiredRoles: allowedRoles,
          currentRole: user?.role,
        }}
        replace
      />
    )
  }

  // 3. Jika otorisasi berhasil, render child component atau Outlet
  return children ? children : <Outlet />
}

export default ProtectedRoute
