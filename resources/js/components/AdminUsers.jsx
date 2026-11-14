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
        setUserList(data)
        if (onStatsChange) onStatsChange(data.length)
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
                  avatar:
                    selectedRole === 'admin'
                      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
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
        triggerAlert(`Pengguna "${userToDelete.name}" berhasil dihapus.`)
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
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
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
          className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mb-4`}
          role="alert"
        >
          <i
            className={`fa-solid ${
              alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'
            } me-2`}
          ></i>
          {alert.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
        </div>
      )}

      {/* Ringkasan Sub-Statistik User */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
            <span className="text-muted small fw-semibold text-uppercase">Total Pengguna</span>
            <h4 className="fw-bold text-dark mb-0">{userList.length} Akun</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
            <span className="text-muted small fw-semibold text-uppercase">Administrator</span>
            <h4 className="fw-bold text-danger mb-0">{adminCount} Akun</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
            <span className="text-muted small fw-semibold text-uppercase">Pelanggan (Customer)</span>
            <h4 className="fw-bold text-primary mb-0">{customerCount} Akun</h4>
          </div>
        </div>
      </div>

      {/* Action Bar Search */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 shadow-none"
                placeholder="Cari nama pengguna, email, atau role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-auto text-muted small">
            Menampilkan <strong>{filteredUsers.length}</strong> dari {userList.length} pengguna
          </div>
        </div>
      </div>

      {/* TABEL PENGGUNA TERDAFTAR */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold text-dark">
            <i className="fa-solid fa-users text-primary me-2"></i>
            Daftar Pengguna Terdaftar ({filteredUsers.length})
          </h6>
          <span className="badge bg-light text-secondary border">Tabel `users` MariaDB</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th style={{ width: '60px' }} className="text-center">#ID</th>
                <th>Pengguna</th>
                <th>Alamat Email</th>
                <th>Peran / Role</th>
                <th className="text-center">Status Akun</th>
                <th style={{ width: '130px' }} className="text-center">Aksi & Peran</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Memuat daftar pengguna dari database...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="text-center fw-bold text-muted small">#{u.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{u.name}</div>
                          <small className="text-muted">Terdaftar di sistem</small>
                        </div>
                      </div>
                    </td>
                    <td className="fw-medium text-secondary">{u.email}</td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          u.role === 'admin'
                            ? 'bg-danger-subtle text-danger border border-danger-subtle'
                            : 'bg-primary-subtle text-primary border border-primary-subtle'
                        }`}
                      >
                        <i
                          className={`fa-solid ${
                            u.role === 'admin' ? 'fa-shield-halved' : 'fa-user'
                          } me-1`}
                        ></i>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success-subtle text-success px-2 py-1 rounded-pill">
                        <i className="fa-solid fa-check me-1"></i> Aktif
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          title="Ubah Peran / Role Pengguna"
                          onClick={() => {
                            setUserToEditRole(u)
                            setSelectedRole(u.role === 'admin' ? 'admin' : 'customer')
                          }}
                        >
                          <i className="fa-solid fa-user-gear me-1"></i>
                          Ubah Role
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          title="Hapus Akun Pengguna"
                          onClick={() => setUserToDelete(u)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Tidak ada pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL UBAH ROLE / PERAN PENGGUNA (TAMBAH / UBAH ADMIN)
          ===================================================================== */}
      {userToEditRole && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-bottom py-3">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-user-shield me-2"></i>
                  Ubah Hak Akses / Role Pengguna
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setUserToEditRole(null)}
                  disabled={isUpdatingRole}
                ></button>
              </div>

              <form onSubmit={handleUpdateRole}>
                <div className="modal-body p-4">
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3 border">
                    <img
                      src={userToEditRole.avatar}
                      alt={userToEditRole.name}
                      className="rounded-circle"
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{userToEditRole.name}</h6>
                      <small className="text-muted">{userToEditRole.email}</small>
                    </div>
                  </div>

                  <label className="form-label fw-bold text-dark mb-2">
                    Pilih Peran Baru:
                  </label>

                  <div className="d-flex flex-column gap-2 mb-3">
                    {/* Option 1: Admin */}
                    <label
                      className={`card border p-3 rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                        selectedRole === 'admin' ? 'border-danger bg-danger-subtle' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
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
                          <div className="fw-bold text-danger">Administrator (Admin)</div>
                          <small className="text-secondary">
                            Akses penuh kontrol toko: Buku, Genre, Author, Transaksi, dan User.
                          </small>
                        </div>
                      </div>
                      <i className="fa-solid fa-shield-halved fs-3 text-danger"></i>
                    </label>

                    {/* Option 2: Customer */}
                    <label
                      className={`card border p-3 rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                        selectedRole === 'customer' ? 'border-primary bg-primary-subtle' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
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
                          <div className="fw-bold text-primary">Pelanggan (Customer)</div>
                          <small className="text-secondary">
                            Akses belanja pembeli reguler: Katalog, Keranjang, dan Profil.
                          </small>
                        </div>
                      </div>
                      <i className="fa-solid fa-user fs-3 text-primary"></i>
                    </label>
                  </div>
                </div>

                <div className="modal-footer bg-light border-top py-3">
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
                    className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
                    disabled={isUpdatingRole}
                  >
                    {isUpdatingRole ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-save me-1"></i> Simpan Perubahan Role
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PENGGUNA */}
      {userToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-danger-subtle text-danger border-bottom py-3">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-triangle-exclamation me-2"></i>
                  Hapus Akun Pengguna
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUserToDelete(null)}
                ></button>
              </div>

              <div className="modal-body p-4 text-center">
                <div
                  className="rounded-circle bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.8rem' }}
                >
                  <i className="fa-solid fa-user-xmark"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Hapus Pengguna Ini?</h5>
                <p className="text-secondary mb-0">
                  Apakah Anda yakin ingin menghapus akun <strong>&quot;{userToDelete.name}&quot;</strong> ({userToDelete.email})?
                  Tindakan ini akan menghapus data akun dari database.
                </p>
              </div>

              <div className="modal-footer bg-light border-top py-3">
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
                  className="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm"
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Menghapus...' : 'Ya, Hapus Pengguna'}
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
