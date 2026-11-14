/**
 * authService.js
 * Service otorisasi dan autentikasi untuk membedakan hak akses Pengguna (User/Customer) dan Administrator (Admin).
 * Terintegrasi langsung dengan endpoint Laravel API (/api/login & /api/register) ke database MySQL.
 */

// Kunci penyimpanan localStorage
export const STORAGE_KEYS = {
  CURRENT_USER: 'bookstore_auth_user',
  USERS_LIST: 'bookstore_users',
  TOKEN: 'bookstore_token',
}

// Akun Demo Bawaan untuk pengujian role Admin dan User
export const DEMO_ACCOUNTS = {
  admin: {
    id: 9,
    fullName: 'Administrator Bookstore',
    username: 'admin',
    email: 'admin@bookstore.id',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Lead System Administrator & Content Manager Bookstore',
    registeredAt: 'Senin, 1 Januari 2026',
  },
  user: {
    id: 10,
    fullName: 'Budi Santoso',
    username: 'user',
    email: 'budi.santoso@gmail.com',
    password: 'user123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    bio: 'Penikmat buku fiksi, sastra, dan teknologi pengembangan web',
    registeredAt: 'Rabu, 15 Januari 2026',
  },
}

/**
 * Menginisialisasi data akun bawaan jika belum tersedia di localStorage
 */
export function initAuthStorage() {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.USERS_LIST)
    if (!existing) {
      const initialUsers = [
        { ...DEMO_ACCOUNTS.admin },
        { ...DEMO_ACCOUNTS.user },
      ]
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(initialUsers))
    }
  } catch (error) {
    console.error('Gagal menginisialisasi penyimpanan autentikasi:', error)
  }
}

/**
 * Mengambil seluruh daftar pengguna terdaftar dari localStorage
 * @returns {Array}
 */
export function getRegisteredUsers() {
  try {
    initAuthStorage()
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS_LIST)
    return usersJson ? JSON.parse(usersJson) : []
  } catch (error) {
    console.error('Gagal membaca daftar pengguna:', error)
    return []
  }
}

/**
 * Mengambil data pengguna yang sedang login saat ini dari localStorage
 * @returns {object|null}
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Gagal membaca sesi pengguna saat ini:', error)
    return null
  }
}

/**
 * Menyimpan data pengguna yang sedang login ke localStorage
 * @param {object} user 
 */
export function setCurrentUser(user) {
  try {
    if (user) {
      // eslint-disable-next-line no-unused-vars
      const { password, ...safeUser } = user
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser))
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  } catch (error) {
    console.error('Gagal menyimpan sesi pengguna:', error)
  }
}

/**
 * Menghapus sesi aktif (Logout)
 */
export async function logoutUser() {
  try {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {})
  } finally {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }
}

/**
 * Melakukan autentikasi / login ke Laravel API (Database MySQL)
 * @param {string} identifier (username atau email)
 * @param {string} password 
 * @returns {Promise<object>} data user yang berhasil login
 */
export async function authenticateUser(identifier, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        identifier: (identifier || '').trim(),
        password: password,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || 'Username / email atau kata sandi tidak sesuai.')
    }

    if (data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
    }

    const userData = data.user
    setCurrentUser(userData)
    return userData
  } catch (err) {
    if (err.message && !err.message.includes('fetch')) {
      throw err
    }

    // Fallback offline jika server Laravel tidak merespons
    console.warn('Backend API tidak merespons, beralih ke fallback akun lokal:', err)
    initAuthStorage()
    const users = getRegisteredUsers()
    const cleanId = (identifier || '').trim().toLowerCase()

    const found = users.find(
      (u) =>
        (u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId) &&
        u.password === password,
    )

    if (!found) {
      throw new Error('Username / email atau kata sandi tidak sesuai.')
    }

    setCurrentUser(found)
    return found
  }
}

/**
 * Login langsung menggunakan Akun Demo (admin atau user)
 * @param {'admin'|'user'} role 
 * @returns {object}
 */
export function loginWithDemoRole(role = 'user') {
  initAuthStorage()
  const targetAccount = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.user
  setCurrentUser(targetAccount)
  return targetAccount
}

/**
 * Menambahkan pengguna baru ke database MySQL melalui Laravel API (/api/register)
 * @param {object} userData 
 * @returns {Promise<object>} pengguna yang baru didaftarkan
 */
export async function registerNewUser(userData) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: userData.fullName || userData.name || userData.username,
        email: userData.email.trim(),
        password: userData.password,
        role: userData.role || 'customer',
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || 'Pendaftaran gagal disimpan.')
    }

    if (data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
    }

    const createdUser = {
      ...data.user,
      username: userData.username || data.user.username,
      avatar:
        userData.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=0d6efd&color=fff`,
    }

    setCurrentUser(createdUser)
    return createdUser
  } catch (err) {
    if (err.message && !err.message.includes('fetch')) {
      throw err
    }

    // Fallback offline
    console.warn('Backend API tidak merespons, beralih ke registrasi lokal:', err)
    initAuthStorage()
    const users = getRegisteredUsers()

    const cleanEmail = userData.email.trim().toLowerCase()
    const cleanUsername = userData.username.trim().toLowerCase()

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Alamat email sudah terdaftar dalam sistem.')
    }
    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      throw new Error('Username sudah digunakan oleh akun lain.')
    }

    const newUser = {
      id: Date.now(),
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      username: userData.username.trim(),
      password: userData.password,
      role: userData.role || 'user',
      avatar:
        userData.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=0d6efd&color=fff`,
      bio: userData.bio || 'Pengguna terdaftar Bookstore.',
      registeredAt: new Date().toLocaleDateString('id-ID'),
    }

    users.push(newUser)
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users))
    setCurrentUser(newUser)
    return newUser
  }
}

/**
 * Memeriksa apakah pengguna memiliki hak akses (role) tertentu
 * @param {object|null} user 
 * @param {string|string[]} allowedRoles 
 * @returns {boolean}
 */
export function checkRoleAccess(user, allowedRoles) {
  if (!user || !user.role) return false

  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(user.role)
  }

  return user.role === allowedRoles
}

/**
 * Helper untuk memeriksa apakah user aktif adalah admin
 * @param {object|null} user 
 * @returns {boolean}
 */
export function isUserAdmin(user) {
  return user?.role === 'admin'
}
