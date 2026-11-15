import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Contact() {
  const { user } = useAuth()
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Pertanyaan Buku',
    message: '',
  })

  // Prefill formulir jika user sudah login
  useEffect(() => {
    if (user) {
      setContactForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }))
    }
  }, [user])

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    try {
      await axios.post('/api/contacts', contactForm)
      setContactSubmitted(true)
      // Kosongkan pesan setelah berhasil kirim, simpan nama & email
      setContactForm((prev) => ({
        ...prev,
        subject: 'Pertanyaan Buku',
        message: '',
      }))
      setTimeout(() => {
        setContactSubmitted(false)
      }, 7000)
    } catch (err) {
      console.error('Error saat mengirim pesan kontak:', err)
      const msg = err.response?.data?.message || 'Gagal mengirim pesan ke server. Silakan periksa koneksi Anda dan coba lagi.'
      setErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-5">
      {/* Header Contact */}
      <div className="text-center mb-5">
        <span
          className="badge rounded-pill px-3 py-1 mb-2 fw-semibold"
          style={{
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            border: '1px solid rgba(200, 90, 50, 0.25)',
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <i className="fa-regular fa-paper-plane me-1"></i> Hubungi Kami
        </span>
        <h1 className="editorial-heading display-6 fw-bold mb-2">
          Kami Siap Membantu Anda
        </h1>
        <p className="lead mx-auto col-lg-7" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
          Punya pertanyaan seputar ketersediaan naskah, status pengiriman faktur, atau ingin merekomendasikan judul baru? Kirimkan surat pesan Anda kepada tim kurator Bookstore.
        </p>
      </div>

      <div className="row g-5">
        {/* Kolom Kiri: Informasi Kontak */}
        <div className="col-lg-5">
          <div
            className="card p-4 p-md-5 h-100"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
            }}
          >
            <h4 className="editorial-heading fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Ruang Kontak
            </h4>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--accent-primary)',
                  fontSize: '1rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Alamat Toko & Kantor</h6>
                <p className="mb-0 small" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Jl. Lenteng Agung Raya No. 20, Jagakarsa, Jakarta Selatan, DKI Jakarta 12610
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--accent-primary)',
                  fontSize: '1rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Surel Resmi</h6>
                <p className="mb-0 small" style={{ color: 'var(--text-secondary)' }}>
                  support@bookstore.id<br />
                  kerjasama@bookstore.id
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--accent-secondary)',
                  fontSize: '1rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Telepon & WhatsApp</h6>
                <p className="mb-0 small" style={{ color: 'var(--text-secondary)' }}>
                  +62 (021) 7890-1234<br />
                  +62 812-3456-7890 (Layanan CS)
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--accent-gold)',
                  fontSize: '1rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <i className="fa-regular fa-clock"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Jam Kerja Kurator</h6>
                <p className="mb-0 small" style={{ color: 'var(--text-secondary)' }}>
                  Senin - Jumat: 08.00 - 20.00 WIB<br />
                  Sabtu - Minggu: 09.00 - 17.00 WIB
                </p>
              </div>
            </div>

            <div className="pt-3 border-top mt-auto" style={{ borderColor: 'var(--border-subtle) !important' }}>
              <h6 className="fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                Media Sosial Kami
              </h6>
              <div className="d-flex gap-2">
                <a href="#instagram" className="btn btn-outline-secondary btn-sm rounded-circle p-2" style={{ width: '36px', height: '36px' }}>
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#twitter" className="btn btn-outline-secondary btn-sm rounded-circle p-2" style={{ width: '36px', height: '36px' }}>
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#youtube" className="btn btn-outline-secondary btn-sm rounded-circle p-2" style={{ width: '36px', height: '36px' }}>
                  <i className="fa-brands fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Kontak */}
        <div className="col-lg-7">
          <div className="card p-4 p-md-5" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <h4 className="editorial-heading fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Kirim Surat / Pertanyaan
            </h4>
            <p className="small mb-4" style={{ color: 'var(--text-secondary)' }}>
              Pesan Anda akan langsung tercatat di kotak surat admin Bookstore dan direspon dalam kurun waktu 1x24 jam kerja.
            </p>

            {contactSubmitted && (
              <div
                className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4"
                role="alert"
                style={{
                  backgroundColor: 'var(--accent-secondary-light)',
                  borderColor: 'rgba(61, 90, 69, 0.3)',
                  color: 'var(--accent-secondary)',
                  borderRadius: '10px',
                }}
              >
                <i className="fa-solid fa-circle-check fs-5 me-3"></i>
                <div className="small">
                  <strong>Surat Berhasil Terkirim!</strong> Terima kasih telah menghubungi Bookstore. Tim kurator akan segera membalas ke alamat surel Anda.
                </div>
                <button type="button" className="btn-close ms-auto" onClick={() => setContactSubmitted(false)}></button>
              </div>
            )}

            {errorMsg && (
              <div
                className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-4"
                role="alert"
                style={{
                  backgroundColor: '#FDF0EE',
                  borderColor: 'rgba(185, 56, 34, 0.3)',
                  color: '#B93822',
                  borderRadius: '10px',
                }}
              >
                <i className="fa-solid fa-triangle-exclamation fs-5 me-3"></i>
                <div className="small">
                  <strong>Terjadi Kesalahan:</strong> {errorMsg}
                </div>
                <button type="button" className="btn-close ms-auto" onClick={() => setErrorMsg(null)}></button>
              </div>
            )}

            <form onSubmit={handleContactSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Nama Lengkap <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Budi Santoso"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Alamat Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="alamat@email.com"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">
                    Topik / Kategori Pesan
                  </label>
                  <select
                    className="form-select"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  >
                    <option value="Pertanyaan Buku">Pertanyaan Ketersediaan Naskah</option>
                    <option value="Status Pesanan">Status Pemesanan & Pengiriman</option>
                    <option value="Rekomendasi Judul">Rekomendasi Judul / Request Naskah</option>
                    <option value="Kerjasama">Kerjasama Penerbit & Penulis</option>
                    <option value="Kritik & Saran">Kritik & Masukan Pelayanan</option>
                    <option value="Lainnya">Pertanyaan Lainnya</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">
                    Isi Pesan Surat <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Tuliskan pertanyaan, masukan, atau pesan Anda secara lengkap..."
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  ></textarea>
                </div>

                <div className="col-12 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Mengirimkan Surat...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        <span>Kirim Surat Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact