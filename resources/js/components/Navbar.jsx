import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * Komponen Navbar dengan Navigasi Berbasis Peran (Role-Based Navigation)
 * Menyesuaikan item navigasi, tombol autentikasi, serta status peran aktif (Admin/User).
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
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm custom-navbar py-2 py-md-3">
      <div className="container">
        {/* Brand Logo */}
        <Link
          to="/"
          className="navbar-brand d-inline-flex align-items-center gap-2 brand-logo"
          onClick={closeNavbar}
        >
          <div className="brand-icon-wrapper">
            <i className="fa-solid fa-book-open text-primary fs-3"></i>
          </div>
          <span className="fs-4 fw-bold brand-text">
            book<span className="text-primary">store</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className={`navbar-toggler border-0 shadow-none ${isOpen ? '' : 'collapsed'}`}
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links & Action Buttons */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarMain">
          {/* Menu Navigasi Utama */}
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
                to="/about"
                onClick={closeNavbar}
                className={({ isActive }) =>
                  `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <i className="fa-solid fa-circle-info me-1"></i>
                About
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
                <i className="fa-solid fa-book me-1"></i>
                Book
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
                <i className="fa-solid fa-cart-shopping me-1"></i>
                Keranjang
                {totalItems > 0 && (
                  <span className="badge bg-danger rounded-pill ms-1 px-2 py-1">
                    {totalItems}
                  </span>
                )}
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
                Team
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
                <i className="fa-solid fa-envelope me-1"></i>
                Contact
              </NavLink>
            </li>

            {/* Menu Khusus Administrator */}
            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  onClick={closeNavbar}
                  className={({ isActive }) =>
                    `nav-link custom-nav-link text-danger ${isActive ? 'active bg-danger text-white' : ''}`
                  }
                >
                  <i className="fa-solid fa-shield-halved me-1"></i>
                  Admin Panel
                </NavLink>
              </li>
            )}

            {/* Menu Profil (dapat diakses jika sudah login) */}
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  to="/profile"
                  onClick={closeNavbar}
                  className={({ isActive }) =>
                    `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <i className="fa-solid fa-circle-user me-1"></i>
                  Profil
                </NavLink>
              </li>
            )}
          </ul>

          {/* Area Kanan: Status Autentikasi Pengguna */}
          <div className="d-flex flex-wrap align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <>
                {/* Badge Role Aktif */}
                <span
                  className={`badge ${
                    isAdmin ? 'bg-danger' : 'bg-primary'
                  } rounded-pill px-2 py-1 text-uppercase`}
                >
                  <i
                    className={`fa-solid ${
                      isAdmin ? 'fa-user-shield' : 'fa-user'
                    } me-1`}
                  ></i>
                  {role}
                </span>

                {/* Profil Pengguna & Logout */}
                <div className="d-flex align-items-center gap-2 ps-lg-2">
                  <Link
                    to="/profile"
                    onClick={closeNavbar}
                    className="text-decoration-none d-flex align-items-center gap-2 text-dark"
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.fullName || 'User',
                        )}&background=0d6efd&color=fff&size=64`
                      }
                      alt={user?.fullName}
                      className="rounded-circle border"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    <span className="small fw-semibold d-none d-xl-inline">
                      {user?.fullName?.split(' ')[0]}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm px-2 py-1 rounded-pill"
                    title="Keluar dari akun"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span className="d-none d-sm-inline ms-1">Keluar</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeNavbar}
                  className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold auth-btn text-decoration-none"
                >
                  <i className="fa-solid fa-right-to-bracket me-1"></i>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeNavbar}
                  className="btn btn-primary btn-sm px-3 rounded-pill fw-semibold auth-btn shadow-sm text-decoration-none"
                >
                  <i className="fa-solid fa-user-plus me-1"></i>
                  Register
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
