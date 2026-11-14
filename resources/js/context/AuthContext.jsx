import { createContext, useContext, useState } from 'react'
import {
  getCurrentUser,
  authenticateUser,
  loginWithDemoRole,
  logoutUser,
  registerNewUser,
  checkRoleAccess,
  initAuthStorage,
} from '../services/authService'

// Membuat Context Autentikasi & Otorisasi
const AuthContext = createContext(null)

/**
 * AuthProvider Component
 * Membungkus seluruh aplikasi untuk menyediakan state autentikasi dan fungsi otorisasi peran (Role-Based Access Control)
 */
export function AuthProvider({ children }) {
  // Inisialisasi state pengguna dari localStorage dengan lazy initializer
  const [user, setUser] = useState(() => {
    initAuthStorage()
    return getCurrentUser()
  })
  const [loading] = useState(false)

  /**
   * Fungsi Login dengan kredensial (username/email dan password)
   */
  const login = async (identifier, password) => {
    const loggedUser = await authenticateUser(identifier, password)
    setUser(loggedUser)
    return loggedUser
  }

  /**
   * Fungsi Login Cepat dengan Akun Demo (admin atau user)
   * Memudahkan dosen/penilai memeriksa perbedaan hak akses dalam satu klik
   */
  const loginAsDemo = (role = 'user') => {
    const demoUser = loginWithDemoRole(role)
    setUser(demoUser)
    return demoUser
  }

  /**
   * Fungsi Logout
   */
  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  /**
   * Fungsi Registrasi Pengguna Baru
   */
  const register = async (userData) => {
    const newUser = await registerNewUser(userData)
    setUser(newUser)
    return newUser
  }

  /**
   * Mengganti peran aktif (Quick Toggle Role antara admin <-> user)
   */
  const switchRole = (targetRole) => {
    const nextRole = targetRole || (user?.role === 'admin' ? 'user' : 'admin')
    const nextUser = loginWithDemoRole(nextRole)
    setUser(nextUser)
    return nextUser
  }

  /**
   * Memeriksa apakah user saat ini memiliki salah satu peran yang diizinkan
   */
  const hasRole = (allowedRoles) => {
    return checkRoleAccess(user, allowedRoles)
  }

  const value = {
    user,
    role: user?.role || 'guest',
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    loading,
    login,
    loginAsDemo,
    logout,
    register,
    switchRole,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom Hook useAuth
 * Memudahkan akses ke state dan fungsi AuthContext dari seluruh komponen
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>')
  }
  return context
}

export default AuthContext
