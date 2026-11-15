import { useState, useRef } from 'react'
import { Link } from 'react-router'
import FormInput from '../components/FormInput'
import PasswordStrengthBar from '../components/PasswordStrengthBar'
import { validateField, validateRegistrationForm } from '../Utils/authValidation'
import { useAuth } from '../context/AuthContext'

/**
 * Nilai default formulir registrasi
 */
const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
}

/**
 * Halaman Registrasi Pengguna (Register)
 * Mengimplementasikan form registrasi responsif dengan validasi real-time,
 * visual feedback, penanganan state komprehensif, dan persistensi data ke localStorage.
 */
function Register() {
  const { register: registerUser } = useAuth()
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredUser, setRegisteredUser] = useState(null)

  // Referensi untuk auto-focus field pertama yang error saat submit gagal
  const formRef = useRef(null)

  /**
   * Menangani perubahan nilai input
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    const updatedFormData = {
      ...formData,
      [name]: fieldValue,
    }
    setFormData(updatedFormData)

    // Jika field sudah pernah disentuh, lakukan validasi langsung saat mengetik
    if (touched[name]) {
      const errorMsg = validateField(name, fieldValue, updatedFormData)
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }))
    }

    // Jika password diubah dan konfirmasi sudah pernah disentuh, validasi ulang konfirmasi password
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', updatedFormData.confirmPassword, updatedFormData)
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }))
    }
  }

  /**
   * Menangani event onBlur untuk validasi real-time saat pengguna berpindah input
   */
  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setTouched((prev) => ({ ...prev, [name]: true }))

    const errorMsg = validateField(name, fieldValue, formData)
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }))
  }

  /**
   * Menangani pengiriman formulir (Submit)
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    // Tandai semua field sebagai touched agar seluruh error muncul
    const allTouched = {
      fullName: true,
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    }
    setTouched(allTouched)

    // Validasi seluruh data form
    const { isValid, errors: validationErrors } = validateRegistrationForm(formData)
    setErrors(validationErrors)

    if (!isValid) {
      // Cari field pertama yang bermasalah dan fokuskan ke sana
      const firstErrorField = Object.keys(validationErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.focus()
      }
      return
    }

    // Simpan pendaftaran ke database MySQL via Laravel API (/api/register)
    setIsSubmitting(true)

    ;(async () => {
      try {
        const newUser = await registerUser({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: 'customer',
        })

        setRegisteredUser(newUser)
        setRegistrationSuccess(true)
        setFormData(INITIAL_FORM_STATE)
        setTouched({})
        setErrors({})
      } catch (err) {
        const errorMessage = err.message || 'Pendaftaran gagal disimpan.'
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors((prev) => ({ ...prev, email: errorMessage }))
        } else if (errorMessage.toLowerCase().includes('username')) {
          setErrors((prev) => ({ ...prev, username: errorMessage }))
        } else {
          setErrors((prev) => ({ ...prev, form: errorMessage }))
        }
      } finally {
        setIsSubmitting(false)
      }
    })()
  }

  /**
   * Mengatur ulang formulir ke kondisi semula
   */
  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE)
    setErrors({})
    setTouched({})
  }

  return (
    <div className="register-page-wrapper py-5 bg-body-tertiary">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                <i className="fa-solid fa-house me-1"></i>Home
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Registrasi Pengguna
            </li>
          </ol>
        </nav>

        {/* Kondisi Jika Registrasi Berhasil */}
        {registrationSuccess && registeredUser ? (
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-9">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden text-center p-4 p-md-5 bg-white">
                <div className="mb-4">
                  <div
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center bg-success-subtle text-success shadow-sm"
                    style={{ width: '88px', height: '88px', fontSize: '2.5rem' }}
                  >
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                </div>

                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill mb-2 mx-auto fw-semibold">
                  Akun Berhasil Dibuat!
                </span>
                <h2 className="fw-bold text-dark mb-2">Selamat Datang di Bookstore!</h2>
                <p className="text-secondary mb-4">
                  Hai <strong className="text-dark">{registeredUser.fullName}</strong>, akun Anda telah berhasil terdaftar dan aktif. Nikmati kemudahan memesan dan membaca buku favorit Anda.
                </p>

                {/* Ringkasan Data Akun */}
                <div className="card bg-light border-0 rounded-3 p-3 text-start mb-4">
                  <h6 className="fw-bold text-primary mb-3">
                    <i className="fa-solid fa-id-card me-2"></i>Rincian Akun Terdaftar
                  </h6>
                  <div className="row g-2 small">
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Nama Lengkap:</span>
                      <strong className="text-dark">{registeredUser.fullName}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Username:</span>
                      <strong className="text-dark">@{registeredUser.username}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Alamat Email:</span>
                      <strong className="text-dark">{registeredUser.email}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Waktu Pendaftaran:</span>
                      <span className="text-secondary">{registeredUser.registeredAt}</span>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Peran Pengguna (Role):</span>
                      <span className="badge bg-primary text-uppercase px-2 py-1">
                        <i className="fa-solid fa-user me-1"></i>
                        {registeredUser.role || 'user'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                  <Link to="/profile" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm">
                    <i className="fa-solid fa-user-circle me-2"></i>Lihat Profil Saya
                  </Link>
                  <Link to="/book" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold">
                    <i className="fa-solid fa-book-open me-2"></i>Jelajahi Buku
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationSuccess(false)
                      setRegisteredUser(null)
                    }}
                    className="btn btn-outline-secondary px-3 py-2 rounded-pill fw-semibold"
                  >
                    <i className="fa-solid fa-user-plus me-1"></i>Daftar Lagi
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Formulir Registrasi */
          <div className="row g-4 align-items-stretch">
            {/* Kolom Kiri: Kurasi & Keuntungan Bergabung */}
            <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between">
              <div
                className="card p-4 p-xl-5 h-100 position-relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                }}
              >
                <div className="position-relative" style={{ zIndex: 2 }}>
                  <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small mb-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <i className="fa-solid fa-feather" style={{ color: 'var(--accent-primary)' }}></i>
                    <span className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>Keanggotaan Pembaca</span>
                  </div>

                  <h1 className="editorial-heading fw-bold mb-3 display-6" style={{ fontSize: '1.85rem', lineHeight: '1.3' }}>
                    Mulai petualangan literasi bersama ruang baca kami.
                  </h1>
                  <p className="small mb-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    Daftarkan akun sekarang untuk mendapatkan kurasi naskah bermutu, menyimpan riwayat faktur pesanan, dan menikmati layanan pengemasan buku terlindungi.
                  </p>

                  <div className="d-flex flex-column gap-3 my-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--accent-primary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <i className="fa-solid fa-book-open"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 small" style={{ color: 'var(--text-primary)' }}>Koleksi Kurasi Berkualitas</h6>
                        <small className="text-muted">Karya berbobot dari penulis nasional & dunia</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--accent-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <i className="fa-solid fa-stamp"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 small" style={{ color: 'var(--text-primary)' }}>100% Eksemplar Resmi</h6>
                        <small className="text-muted">Langsung dari penerbit dengan jaminan keaslian</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--accent-gold)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 small" style={{ color: 'var(--text-primary)' }}>Transaksi Aman & Terpercaya</h6>
                        <small className="text-muted">Didukung gateway pembayaran Midtrans Snap</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Social Proof */}
                <div className="mt-4 pt-3 border-top position-relative" style={{ borderColor: 'var(--border-subtle) !important', zIndex: 2 }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div style={{ color: 'var(--accent-gold)' }}>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <span className="fw-bold small" style={{ color: 'var(--text-primary)' }}>4.9 / 5.0</span>
                  </div>
                  <small className="text-muted d-block">
                    Dipercaya oleh ribuan pembaca setia di seluruh penjuru Indonesia.
                  </small>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Card Formulir Registrasi */}
            <div className="col-lg-7">
              <div className="card p-4 p-md-5" style={{ backgroundColor: 'var(--bg-surface)' }}>
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
                    <i className="fa-solid fa-user-plus me-1"></i> Registrasi Anggota
                  </span>
                  <h2 className="editorial-heading fw-bold mb-1" style={{ fontSize: '1.75rem' }}>
                    Daftar Akun Pembaca
                  </h2>
                  <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                    Lengkapi informasi di bawah ini untuk membuat akun di database Bookstore.
                  </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  {/* Field 1: Nama Lengkap */}
                  <FormInput
                    id="fullName"
                    name="fullName"
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap Anda"
                    icon="fa-user"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.fullName}
                    touched={touched.fullName}
                    required
                    autoComplete="name"
                    helpText="Gunakan nama asli untuk mempermudah verifikasi dan pengiriman buku."
                  />

                  {/* Baris Dua Kolom: Email & Username */}
                  <div className="row g-2 g-md-3">
                    <div className="col-md-6">
                      <FormInput
                        id="email"
                        name="email"
                        type="email"
                        label="Alamat Email"
                        placeholder="contoh: nama@email.com"
                        icon="fa-envelope"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        id="username"
                        name="username"
                        label="Username"
                        placeholder="contoh: budi_21"
                        icon="fa-at"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.username}
                        touched={touched.username}
                        required
                        autoComplete="username"
                        helpText="4-20 karakter alfanumerik & underscore"
                      />
                    </div>
                  </div>

                  {/* Field 4: Password */}
                  <FormInput
                    id="password"
                    name="password"
                    type="password"
                    label="Kata Sandi (Password)"
                    placeholder="Minimal 6 karakter"
                    icon="fa-lock"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    required
                    autoComplete="new-password"
                  />

                  {/* Indikator Kekuatan Password */}
                  <PasswordStrengthBar password={formData.password} />

                  {/* Field 5: Konfirmasi Password */}
                  <FormInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Konfirmasi Kata Sandi"
                    placeholder="Masukkan ulang kata sandi Anda"
                    icon="fa-shield-halved"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    required
                    autoComplete="new-password"
                  />

                  {/* Field 6: Checkbox Persetujuan Syarat & Ketentuan */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-check-input ${
                          touched.agreeTerms && errors.agreeTerms ? 'is-invalid' : ''
                        }`}
                      />
                      <label htmlFor="agreeTerms" className="form-check-label small text-secondary">
                        Saya menyetujui{' '}
                        <a
                          href="#terms"
                          onClick={(e) => {
                            e.preventDefault()
                            alert('Syarat & Ketentuan: Akun ini digunakan secara wajar untuk pembelian dan interaksi pada aplikasi bookstore.')
                          }}
                          className="text-primary text-decoration-none fw-semibold"
                        >
                          Syarat & Ketentuan
                        </a>{' '}
                        serta{' '}
                        <a
                          href="#privacy"
                          onClick={(e) => {
                            e.preventDefault()
                            alert('Kebijakan Privasi: Kami menjaga privasi data Anda dengan aman dan tidak pernah membagikannya ke pihak ketiga.')
                          }}
                          className="text-primary text-decoration-none fw-semibold"
                        >
                          Kebijakan Privasi
                        </a>
                        . <span className="text-danger">*</span>
                      </label>
                      {touched.agreeTerms && errors.agreeTerms && (
                        <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <span>{errors.agreeTerms}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi: Submit & Reset */}
                  <div className="d-flex flex-column flex-sm-row gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Memproses Pendaftaran...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-user-plus"></i>
                          <span>Daftar Sekarang</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="btn btn-outline-secondary px-3 py-2 rounded-pill fw-semibold"
                      title="Kosongkan semua isian form"
                    >
                      <i className="fa-solid fa-rotate-left me-1"></i>Reset
                    </button>
                  </div>
                </form>

                {/* Footer Card: Link ke Login */}
                <div className="mt-4 pt-3 border-top text-center text-secondary small">
                  Sudah memiliki akun bookstore?{' '}
                  <Link
                    to="/login"
                    className="text-primary text-decoration-none fw-bold"
                  >
                    Masuk di sini
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
