import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import RootLayout from './layouts/RootLayout'

// Halaman-halaman Aplikasi
import Home from './pages/Home'
import About from './pages/About'
import Book from './pages/Book'
import Cart from './pages/Cart'
import Team from './pages/Team'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'

/**
 * Konfigurasi Routing & Proteksi Akses (Role-Based Access Control)
 *
 * Struktur Otorisasi:
 * 1. Rute Publik:
 *    - Home ("/")
 *    - Book ("book")
 *    - Team ("team")
 *    - Contact ("contact")
 *    - Login ("login")
 *    - Register ("register")
 *    - Unauthorized ("unauthorized")
 *
 * 2. Rute Terproteksi Pengguna (Role: 'user' & 'admin'):
 *    - Profile ("profile"): Halaman profil akun yang dapat diakses oleh semua pengguna terdaftar.
 *
 * 3. Rute Terproteksi Administrator (Role: 'admin' saja):
 *    - Admin ("admin", "admin/genre", "admin/author"): Halaman manajemen data (Genre & Penulis)
 *      yang khusus dibatasi hanya untuk Administrator.
 *
 * 4. Fallback:
 *    - NotFound ("*"): Menangani alamat URL yang tidak ditemukan (404).
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              {/* ============================================================
                  1. RUTE PUBLIK (Dapat diakses oleh siapa saja tanpa login)
                  ============================================================ */}
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="book" element={<Book />} />
              <Route path="books" element={<Navigate to="/book" replace />} />
              <Route path="cart" element={<Cart />} />
              <Route path="team" element={<Team />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="unauthorized" element={<Unauthorized />} />

              {/* ============================================================
                  2. RUTE TERPROTEKSI PENGGUNA (User & Admin)
                  Dapat diakses oleh semua pengguna yang sudah login
                  ============================================================ */}
              <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* ============================================================
                  3. RUTE TERPROTEKSI ADMINISTRATOR (Khusus Admin)
                  Hanya dapat diakses oleh pengguna dengan role 'admin'
                  Jika diakses oleh user biasa, sistem me-redirect ke /unauthorized
                  ============================================================ */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="admin" element={<Admin />} />
                <Route path="admin/genre" element={<Admin defaultTab="genre" />} />
                <Route path="admin/author" element={<Admin defaultTab="author" />} />
              </Route>

              {/* ============================================================
                  4. CATCH-ALL ROUTE (404 Not Found)
                  ============================================================ */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
