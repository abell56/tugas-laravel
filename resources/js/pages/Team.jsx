import { teamMembers } from '../data/team'

function Team() {
  return (
    <div className="container py-5">
      {/* Header Team */}
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
          <i className="fa-solid fa-users me-1"></i> Tim Kurator & Pengembang
        </span>
        <h1 className="editorial-heading display-6 fw-bold mb-2">
          Kenali Sosok di Balik Bookstore
        </h1>
        <p className="lead mx-auto col-lg-7" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
          Dedikasi kami adalah menghadirkan bacaan berkualitas, merawat rasa ingin tahu, dan mempermudah akses buku bermutu bagi seluruh masyarakat Indonesia.
        </p>
      </div>

      {/* Grid Anggota Tim */}
      <div className="row g-4 mb-5">
        {teamMembers.map((member) => (
          <div className="col-lg-3 col-md-6" key={member.id}>
            <div className="card h-100 text-center p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <img
                src={member.image}
                alt={member.name}
                className="rounded-circle mb-3 shadow-sm"
                style={{
                  width: '110px',
                  height: '110px',
                  objectFit: 'cover',
                  margin: '0 auto',
                  border: '3px solid var(--border-subtle)',
                }}
              />
              <h5 className="font-serif fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{member.name}</h5>
              <p className="small fw-semibold mb-3" style={{ color: 'var(--accent-primary)' }}>{member.role}</p>
              <p className="small mb-4 text-muted" style={{ lineHeight: '1.6' }}>{member.bio}</p>
              <div className="d-flex justify-content-center gap-2 mt-auto">
                <a
                  href="#linkedin"
                  className="btn btn-outline-secondary btn-sm rounded-circle p-2"
                  style={{ width: '34px', height: '34px' }}
                  title="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a
                  href="#twitter"
                  className="btn btn-outline-secondary btn-sm rounded-circle p-2"
                  style={{ width: '34px', height: '34px' }}
                  title="Twitter / X"
                >
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a
                  href="#instagram"
                  className="btn btn-outline-secondary btn-sm rounded-circle p-2"
                  style={{ width: '34px', height: '34px' }}
                  title="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a
                  href="#github"
                  className="btn btn-outline-secondary btn-sm rounded-circle p-2"
                  style={{ width: '34px', height: '34px' }}
                  title="GitHub"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nilai / Values Section (Warm Tactile Features) */}
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3 border-top mt-4" style={{ borderColor: 'var(--border-subtle) !important' }}>
        <div className="feature col text-center p-3">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle fs-3 mb-3 shadow-sm"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(200, 90, 50, 0.25)',
            }}
          >
            <i className="fa-solid fa-book-open-reader"></i>
          </div>
          <h3 className="font-serif fs-4 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Kurasi Pilihan</h3>
          <p className="small text-secondary mb-0" style={{ lineHeight: '1.65' }}>
            Setiap judul buku yang hadir di rak katalog kami telah melewati kurasi ketat agar memberikan wawasan berbobot dan memperluas cakrawala berpikir Anda.
          </p>
        </div>
        <div className="feature col text-center p-3">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle fs-3 mb-3 shadow-sm"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--accent-secondary-light)',
              color: 'var(--accent-secondary)',
              border: '1px solid rgba(61, 90, 69, 0.25)',
            }}
          >
            <i className="fa-solid fa-stamp"></i>
          </div>
          <h3 className="font-serif fs-4 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>100% Asli & Bergaransi</h3>
          <p className="small text-secondary mb-0" style={{ lineHeight: '1.65' }}>
            Bekerjasama langsung dengan penerbit terkemuka untuk memastikan setiap eksemplar buku resmi, bebas bajakan, dan bermutu tinggi.
          </p>
        </div>
        <div className="feature col text-center p-3">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle fs-3 mb-3 shadow-sm"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#FAF4E5',
              color: '#8C6D1F',
              border: '1px solid rgba(184, 134, 11, 0.25)',
            }}
          >
            <i className="fa-solid fa-comments"></i>
          </div>
          <h3 className="font-serif fs-4 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Layanan Bersahabat</h3>
          <p className="small text-secondary mb-0" style={{ lineHeight: '1.65' }}>
            Tim kurator dan dukungan pelanggan kami selalu siap mendengarkan kebutuhan, memberikan rekomendasi buku, serta membantu proses pemesanan Anda.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Team