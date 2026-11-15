import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * Navbar - Warm Tactile Editorial Navigation Header
 * Preserves all role-based auth, cart badge counter, and routing logic.
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, role, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const toggleNavbar = () => {
    setIsOpen(!isOpen)
  }

  const closeNavbar = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeNavbar()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top custom-navbar py-2 py-lg-3">
      <div className="container">
        {/* Brand Wordmark with Editorial Serif */}
        <Link
          to="/"
          className="brand-logo me-lg-4"
          onClick={closeNavbar}
        >
          <div className="brand-mark">
            <i className="fa-solid fa-book-bookmark"></i>
          </div>
          <span className="brand-wordmark">
            book<span>store</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className={`navbar-toggler border-0 shadow-none p-2 ${isOpen ? '' : 'collapsed'}`}
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
          style={{ color: 'var(--text-primary)' }}
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} fs-5`}></i>
        </button>

        {/* Nav Links & Action Buttons */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarMain">
          {/* Main Navigation Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-2">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <i className="fa-solid fa-house me-1"></i>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/book"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <i className="fa-solid fa-book-open me-1"></i>
                Katalog Buku
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/cart"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link custom-nav-link position-relative ${isActive ? 'active' : ''}`
                }
              >
                <i className="fa-solid fa-basket-shopping me-1"></i>
                Keranjang
                {totalItems > 0 && (
                  <span
                    className="badge rounded-pill ms-1 px-2 py-1"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: '#FFFDF9',
                      fontSize: '0.72rem',
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <i className="fa-solid fa-feather me-1"></i>
                Tentang Kami
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/team"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <i className="fa-solid fa-users me-1"></i>
                Tim Kami
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <i className="fa-regular fa-envelope me-1"></i>
                Kontak
              </NavLink>
            </li>

            {/* Menu Khusus Administrator */}
            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  onClick={closeNavbar}
                  className={({ isActive }) =>
                    `nav-link custom-nav-link ${
                      isActive
                        ? 'active'
                        : ''
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {}
                      : {
                          backgroundColor: 'var(--accent-light)',
                          color: 'var(--accent-primary) !important',
                        }
                  }
                >
                  <i className="fa-solid fa-sliders me-1"></i>
                  Dashboard Admin
                </NavLink>
              </li>
            )}

            {/* Menu Profil / Riwayat Pesanan */}
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  to="/profile"
                  onClick={closeNavbar}
                  className={({ isActive }) =>
                    `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <i className="fa-regular fa-id-badge me-1"></i>
                  Riwayat & Profil
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Area */}
          <div className="d-flex flex-wrap align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <>
                {/* Active Role Pill */}
                <span
                  className="badge px-2 py-1 rounded-pill text-uppercase"
                  style={{
                    backgroundColor: isAdmin ? 'var(--accent-light)' : 'var(--accent-secondary-light)',
                    color: isAdmin ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    border: isAdmin ? '1px solid rgba(200, 90, 50, 0.25)' : '1px solid rgba(61, 90, 69, 0.25)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  <i
                    className={`fa-solid ${
                      isAdmin ? 'fa-shield-halved' : 'fa-user'
                    } me-1`}
                  ></i>
                  {role}
                </span>

                {/* User Avatar & Logout */}
                <div className="d-flex align-items-center gap-2 ps-lg-1">
                  <Link
                    to="/profile"
                    onClick={closeNavbar}
                    className="text-decoration-none d-flex align-items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.fullName || user?.name || 'User',
                        )}&background=FAF7F2&color=C85A32&size=64&bold=true`
                      }
                      alt={user?.fullName || user?.name}
                      className="rounded-circle"
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'cover',
                        border: '1px solid var(--border-subtle)',
                      }}
                    />
                    <span className="small fw-semibold d-none d-xl-inline">
                      {(user?.fullName || user?.name)?.split(' ')[0]}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-outline-secondary btn-sm px-2 py-1 rounded-pill"
                    title="Keluar dari akun"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span className="d-none d-sm-inline ms-1">Keluar</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeNavbar}
                  className="btn btn-outline-secondary btn-sm px-3 rounded-pill fw-semibold text-decoration-none"
                >
                  <i className="fa-solid fa-arrow-right-to-bracket me-1"></i>
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={closeNavbar}
                  className="btn btn-primary btn-sm px-3 rounded-pill fw-semibold text-decoration-none"
                >
                  <i className="fa-solid fa-user-plus me-1"></i>
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar