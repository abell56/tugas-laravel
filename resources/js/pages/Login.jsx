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
      setAuthError(err.message || 'Gagal masuk. Periksa kembali username dan kata sandi Anda.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page-wrapper py-5 bg-body-tertiary">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                <i className="fa-solid fa-house me-1"></i>
                Home
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Login Pengguna
            </li>
          </ol>
        </nav>

        {/* Pesan Redirect dari Protected Route (jika ada) */}
        {redirectMessage && (
          <div className="alert alert-warning alert-dismissible fade show border-warning-subtle shadow-sm mb-4" role="alert">
            <i className="fa-solid fa-triangle-exclamation me-2 text-warning"></i>
            {redirectMessage}
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="row g-0 align-items-stretch">
                {/* Kolom Kiri: Formulir Login */}
                <div className="col-12 col-md-7 p-4 p-md-5">
                  <div className="mb-4">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
                      <i className="fa-solid fa-right-to-bracket me-1"></i>
                      Autentikasi Akun
                    </span>
                    <h2 className="h3 fw-bold text-dark mb-1">Masuk ke Bookstore</h2>
                    <p className="text-secondary small mb-0">
                      Silakan masukkan username/email dan kata sandi Anda untuk melanjutkan.
                    </p>
                  </div>

                  {authError && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small rounded-3 mb-4 animate-fadeIn" role="alert">
                      <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                      <div>{authError}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <FormInput
                      id="identifier"
                      name="identifier"
                      label="Username atau Email"
                      placeholder="Masukkan username atau email"
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
                      label="Kata Sandi"
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
                      className="btn btn-primary w-100 py-2 rounded-pill fw-semibold shadow-sm mb-3 auth-btn"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sedang Memproses...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-right-to-bracket me-2"></i>
                          Masuk Sekarang
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-secondary small mb-0">
                      Belum memiliki akun?{' '}
                      <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                        Daftar di Sini
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Kolom Kanan: Informasi & Keuntungan */}
                <div className="col-12 col-md-5 d-none d-md-flex flex-column justify-content-between p-4 p-md-5 text-white bg-primary bg-gradient position-relative overflow-hidden">
                  <div className="position-relative" style={{ zIndex: 2 }}>
                    <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-25 px-3 py-1 rounded-pill small mb-4">
                      <i className="fa-solid fa-shield-halved text-warning"></i>
                      <span>Akses Akun Aman</span>
                    </div>

                    <h4 className="fw-bold mb-3">Selamat Datang Kembali</h4>
                    <p className="opacity-75 small mb-4">
                      Masuk untuk mengelola katalog, menjelajahi ribuan buku terlaris, dan mengakses fitur sesuai peran akun Anda.
                    </p>

                    <div className="d-flex flex-column gap-3 mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-white text-primary p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
                          <i className="fa-solid fa-user-shield"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 small">Peran Administrator</h6>
                          <small className="opacity-75">Akses penuh ke dashboard manajemen data</small>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-white text-primary p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 small">Peran Pengguna Biasa</h6>
                          <small className="opacity-75">Akses katalog buku dan profil akun</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="position-relative border-top border-white border-opacity-25 pt-3 small opacity-75" style={{ zIndex: 2 }}>
                    <i className="fa-solid fa-info-circle me-1"></i>
                    Gunakan kredensial yang telah didaftarkan untuk masuk.
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
