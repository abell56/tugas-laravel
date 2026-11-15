import { useState, useEffect } from 'react'

function AdminUsers({ onStatsChange }) {
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // State Modal Hapus & Edit Role
  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userToEditRole, setUserToEditRole] = useState(null)
  const [selectedRole, setSelectedRole] = useState('customer')
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)

  const [alert, setAlert] = useState(null)

  const triggerAlert = (text, type = 'success') => {
    setAlert({ text, type })
    setTimeout(() => setAlert(null), 4000)
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        const arr = Array.isArray(data) ? data : []
        setUserList(arr)
        if (onStatsChange) onStatsChange(arr.length)
      }
    } catch (err) {
      console.error('Gagal mengambil data user:', err)
      triggerAlert('Gagal memuat data pengguna dari server.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle Update Role Pengguna (Admin <-> Customer)
  const handleUpdateRole = async (e) => {
    e.preventDefault()
    if (!userToEditRole) return

    setIsUpdatingRole(true)
    try {
      const res = await fetch(`/api/users/${userToEditRole.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Role': 'admin',
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      const data = await res.json()

      if (res.ok) {
        triggerAlert(
          `Peran untuk "${userToEditRole.name}" berhasil diubah menjadi ${selectedRole.toUpperCase()}!`,
          'success'
        )
        setUserList((prev) =>
          prev.map((u) =>
            u.id === userToEditRole.id
              ? {
                  ...u,
                  role: selectedRole,
                }
              : u
          )
        )
        setUserToEditRole(null)
      } else {
        triggerAlert(data.message || 'Gagal memperbarui peran pengguna.', 'danger')
      }
    } catch (err) {
      console.error('Error updating role:', err)
      triggerAlert('Terjadi kesalahan koneksi saat mengubah peran pengguna.', 'danger')
    } finally {
      setIsUpdatingRole(false)
    }
  }

  // Handle Hapus Pengguna
  const handleDeleteUser = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'X-Role': 'admin',
        },
      })
      if (res.ok) {
        triggerAlert(`Akun pengguna "${userToDelete.name}" berhasil dihapus.`)
        setUserList((prev) => prev.filter((u) => u.id !== userToDelete.id))
        setUserToDelete(null)
      } else {
        triggerAlert('Gagal menghapus pengguna.', 'danger')
      }
    } catch {
      triggerAlert('Terjadi kesalahan saat menghapus pengguna.', 'danger')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredUsers = userList.filter((u) => {
    const q = searchQuery.toLowerCase().trim()
    return (
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      String(u.id).includes(q)
    )
  })

  const adminCount = userList.filter((u) => u.role === 'admin').length
  const customerCount = userList.filter((u) => u.role === 'customer' || u.role === 'user').length

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

      {/* Ringkasan Sub-Statistik User */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="admin-stat-card">
            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              Total Anggota Terdaftar
            </span>
            <h4 className="font-serif fw-bold text-dark mb-0 mt-1">{userList.length} Akun</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-stat-card">
            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              Tim Administrator
            </span>
            <h4 className="font-serif fw-bold mb-0 mt-1" style={{ color: 'var(--accent-primary)' }}>{adminCount} Pengelola</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-stat-card">
            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              Pembaca & Pelanggan
            </span>
            <h4 className="font-serif fw-bold mb-0 mt-1" style={{ color: 'var(--accent-secondary)' }}>{customerCount} Pembaca</h4>
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
                placeholder="Cari nama pengguna, alamat email, atau peran..."
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
            Menampilkan <strong>{filteredUsers.length}</strong> dari {userList.length} anggota
          </div>
        </div>
      </div>

      {/* TABEL PENGGUNA TERDAFTAR */}
      <div className="card overflow-hidden">
        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-users" style={{ color: 'var(--accent-primary)' }}></i>
            <h6 className="font-serif fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
              Daftar Anggota Pembaca & Administrator ({filteredUsers.length})
            </h6>
          </div>
          <span className="badge rounded-pill" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            Database `users`
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '60px' }} className="text-center">#ID</th>
                <th>Nama Anggota</th>
                <th>Alamat Email</th>
                <th>Hak Akses / Peran</th>
                <th className="text-center">Status</th>
                <th style={{ width: '130px' }} className="text-center">Aksi & Peran</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div className="spinner-border text-secondary spinner-border-sm me-2"></div>
                    Memuat daftar anggota pengguna dari database...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isAdminUser = u.role === 'admin'

                  return (
                    <tr key={u.id}>
                      <td className="text-center fw-bold text-muted small">#{u.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={
                              u.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                u.name || 'User',
                              )}&background=FAF7F2&color=C85A32&size=64&bold=true`
                            }
                            alt={u.name}
                            className="rounded-circle shadow-sm"
                            style={{
                              width: '38px',
                              height: '38px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-subtle)',
                            }}
                          />
                          <div>
                            <div className="fw-semibold text-dark">{u.name}</div>
                            <small className="text-muted">ID: #{u.id}</small>
                          </div>
                        </div>
                      </td>
                      <td className="small text-secondary">
                        <i className="fa-regular fa-envelope me-1 text-muted"></i>
                        {u.email}
                      </td>
                      <td>
                        <span
                          className="badge rounded-pill px-3 py-1 text-uppercase"
                          style={{
                            backgroundColor: isAdminUser ? 'var(--accent-light)' : 'var(--accent-secondary-light)',
                            color: isAdminUser ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                            border: isAdminUser ? '1px solid rgba(200, 90, 50, 0.25)' : '1px solid rgba(61, 90, 69, 0.25)',
                            fontSize: '0.72rem',
                            letterSpacing: '0.04em',
                          }}
                        >
                          <i className={`fa-solid ${isAdminUser ? 'fa-shield-halved' : 'fa-user'} me-1`}></i>
                          {u.role}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="small fw-semibold" style={{ color: 'var(--accent-secondary)' }}>
                          <i className="fa-solid fa-circle-check me-1"></i> Aktif
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            type="button"
                            className="btn-action-icon btn-action-edit"
                            title="Ubah Hak Akses / Peran"
                            onClick={() => {
                              setUserToEditRole(u)
                              setSelectedRole(u.role || 'customer')
                            }}
                          >
                            <i className="fa-solid fa-user-pen"></i>
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon btn-action-delete"
                            title="Hapus Akun Pengguna"
                            onClick={() => setUserToDelete(u)}
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="fa-solid fa-users fs-2 mb-2 d-block"></i>
                    Belum ada anggota yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL UBAH ROLE USER */}
      {userToEditRole && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(35, 31, 32, 0.65)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content overflow-hidden">
              <div className="modal-header py-3 px-4">
                <h5 className="modal-title font-serif fw-bold" style={{ color: 'var(--text-primary)' }}>
                  <i className="fa-solid fa-user-gear me-2" style={{ color: 'var(--accent-primary)' }}></i>
                  Ubah Hak Akses Pengguna
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUserToEditRole(null)}
                  disabled={isUpdatingRole}
                ></button>
              </div>

              <form onSubmit={handleUpdateRole}>
                <div className="modal-body p-4">
                  <div className="p-3 rounded mb-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="fw-semibold text-dark">{userToEditRole.name}</div>
                    <small className="text-muted">{userToEditRole.email}</small>
                  </div>

                  <label className="form-label small fw-semibold text-secondary mb-2">
                    Tentukan Tingkat Akses Akun:
                  </label>

                  <div className="d-flex flex-column gap-2 mb-3">
                    <label
                      className="card p-3 d-flex flex-row align-items-center justify-content-between"
                      style={{
                        cursor: 'pointer',
                        borderColor: selectedRole === 'admin' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        backgroundColor: selectedRole === 'admin' ? 'var(--accent-light)' : 'var(--bg-surface)',
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="roleChoice"
                          value="admin"
                          checked={selectedRole === 'admin'}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="form-check-input"
                        />
                        <div>
                          <div className="fw-bold small text-dark">Administrator</div>
                          <small className="text-muted">Akses penuh ke dashboard admin, katalog, transaksi, & pengguna</small>
                        </div>
                      </div>
                      <i className="fa-solid fa-shield-halved fs-4" style={{ color: 'var(--accent-primary)' }}></i>
                    </label>

                    <label
                      className="card p-3 d-flex flex-row align-items-center justify-content-between"
                      style={{
                        cursor: 'pointer',
                        borderColor: selectedRole === 'customer' ? 'var(--accent-secondary)' : 'var(--border-subtle)',
                        backgroundColor: selectedRole === 'customer' ? 'var(--accent-secondary-light)' : 'var(--bg-surface)',
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="roleChoice"
                          value="customer"
                          checked={selectedRole === 'customer'}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="form-check-input"
                        />
                        <div>
                          <div className="fw-bold small text-dark">Pelanggan / Pembaca</div>
                          <small className="text-muted">Akses belanja buku, checkout pesanan, & profil pribadi</small>
                        </div>
                      </div>
                      <i className="fa-solid fa-user fs-4" style={{ color: 'var(--accent-secondary)' }}></i>
                    </label>
                  </div>
                </div>

                <div className="modal-footer py-3 px-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setUserToEditRole(null)}
                    disabled={isUpdatingRole}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={isUpdatingRole}
                  >
                    {isUpdatingRole ? 'Menyimpan...' : 'Perbarui Peran'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS USER */}
      {userToDelete && (
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
                  Konfirmasi Hapus Akun
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="mb-2" style={{ color: 'var(--text-primary)' }}>
                  Apakah Anda yakin ingin menghapus akun pengguna <strong>{userToDelete.name}</strong> ({userToDelete.email})?
                </p>
                <small className="text-danger d-block">
                  * Tindakan ini permanen dan akan menghapus data autentikasi dari tabel `users`.
                </small>
              </div>

              <div className="modal-footer py-3 px-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-4 fw-semibold"
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  style={{ backgroundColor: '#B93822', borderColor: '#B93822' }}
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers