import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import FormInput from '../components/FormInput'
import { useAuth } from '../context/AuthContext'

/**
 * Halaman Masuk / Login Pengguna
 * Menangani proses autentikasi akun pengguna (User) dan Administrator (Admin).
 */
function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Target rute redirect setelah login berhasil (default: /profile)
  const fromLocation = location.state?.from?.pathname || '/profile'
  const redirectMessage = location.state?.message

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setAuthError('')

    if (touched[name]) {
      let errorMsg = ''
      if (!value.trim()) {
        errorMsg = name === 'identifier' ? 'Username atau email wajib diisi.' : 'Kata sandi wajib diisi.'
      }
      setErrors((prev) => ({ ...prev, [name]: errorMsg }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (!value.trim()) {
      const errorMsg = name === 'identifier' ? 'Username atau email wajib diisi.' : 'Kata sandi wajib diisi.'
      setErrors((prev) => ({ ...prev, [name]: errorMsg }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Username atau email wajib diisi.'
    }
    if (!formData.password) {
      newErrors.password = 'Kata sandi wajib diisi.'
    }

    setTouched({ identifier: true, password: true })
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsLoading(true)
    setAuthError('')

    try {
      const loggedUser = await login(formData.identifier, formData.password)
      const targetDestination =
        fromLocation !== '/login'
          ? fromLocation
          : loggedUser.role === 'admin'
          ? '/admin'
          : '/profile'
      navigate(targetDestination, { replace: true })
    } catch (err) {
      const serverMessage = err.message || 'Kombinasi kredensial tidak sesuai.'
      setAuthError(serverMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-5" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            {redirectMessage && (
              <div
                className="alert alert-warning alert-dismissible fade show shadow-sm mb-4 d-flex align-items-center"
                role="alert"
                style={{
                  backgroundColor: '#FAF4E5',
                  borderColor: 'rgba(184, 134, 11, 0.3)',
                  color: '#8C6D1F',
                  borderRadius: '10px',
                }}
              >
                <i className="fa-solid fa-circle-exclamation me-2 fs-5"></i>
                <div className="small fw-semibold">{redirectMessage}</div>
                <button type="button" className="btn-close ms-auto" data-bs-dismiss="alert"></button>
              </div>
            )}

            <div className="card overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="row g-0">
                {/* Kolom Kiri: Form Login */}
                <div className="col-12 col-md-7 p-4 p-md-5">
                  <div className="mb-4">
                    <span
                      className="badge rounded-pill px-3 py-1 mb-2"
                      style={{
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent-primary)',
                        border: '1px solid rgba(200, 90, 50, 0.25)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <i className="fa-solid fa-arrow-right-to-bracket me-1"></i> Masuk Akun
                    </span>
                    <h2 className="editorial-heading fw-bold mb-1" style={{ fontSize: '1.75rem' }}>
                      Selamat Datang Kembali
                    </h2>
                    <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                      Masukkan nama pengguna atau email serta kata sandi Anda.
                    </p>
                  </div>

                  {authError && (
                    <div
                      className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small rounded-3 mb-4 animate-fadeIn"
                      role="alert"
                      style={{
                        backgroundColor: '#FDF0EE',
                        borderColor: 'rgba(185, 56, 34, 0.3)',
                        color: '#B93822',
                      }}
                    >
                      <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                      <div>{authError}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <FormInput
                      id="identifier"
                      name="identifier"
                      label="Username atau Alamat Email"
                      placeholder="Masukkan nama pengguna atau email"
                      icon="fa-user"
                      value={formData.identifier}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.identifier}
                      touched={touched.identifier}
                      autoComplete="username"
                    />

                    <FormInput
                      id="password"
                      name="password"
                      label="Kata Sandi Akun"
                      type="password"
                      placeholder="Masukkan kata sandi Anda"
                      icon="fa-lock"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.password}
                      touched={touched.password}
                      autoComplete="current-password"
                    />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary w-100 py-2 rounded-pill fw-semibold shadow-sm mb-3 mt-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sedang Memverifikasi...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-arrow-right-to-bracket me-2"></i>
                          Masuk Sekarang
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                      Belum menjadi anggota pembaca?{' '}
                      <Link to="/register" className="fw-semibold" style={{ color: 'var(--accent-primary)' }}>
                        Daftar Akun Baru
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Kolom Kanan: Informasi Editorial & Suasana Toko */}
                <div
                  className="col-12 col-md-5 d-none d-md-flex flex-column justify-content-center p-4 p-md-5"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderLeft: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small mb-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <i className="fa-solid fa-feather" style={{ color: 'var(--accent-primary)' }}></i>
                      <span className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>Ekosistem Literasi</span>
                    </div>

                    <h4 className="editorial-heading fw-bold mb-3" style={{ fontSize: '1.4rem' }}>
                      Ruang Baca Pribadi Anda
                    </h4>
                    <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                      Masuk untuk meninjau status pesanan faktur, menyimpan koleksi buku impian, dan berbelanja naskah bermutu.
                    </p>
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

export default Login