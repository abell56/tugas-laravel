import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'bookstore_cart'

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (e) {
      console.error('Gagal menyimpan cart:', e)
    }
  }, [cartItems])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  const addToCart = (book) => {
    const rawPrice =
      typeof book.price === 'number'
        ? book.price
        : Number(String(book.price).replace(/[^0-9]/g, '')) || 85000

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === book.id)
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        }
        return updated
      } else {
        return [
          ...prev,
          {
            id: book.id,
            title: book.title || book.description || 'Buku Pilihan',
            author: book.author || 'Penulis Bookstore',
            category: book.category || 'Umum',
            price: rawPrice,
            image: book.image || book.cover_photo || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop',
            quantity: 1,
          },
        ]
      }
    })

    showToast(`"${book.title || book.description}" berhasil dimasukkan ke keranjang!`)
  }

  const removeFromCart = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId))
  }

  const updateQuantity = (bookId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === bookId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        toast,
      }}
    >
      {children}
      {/* Toast Notifikasi Global */}
      {toast && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1090 }}
        >
          <div className="toast show align-items-center text-bg-success border-0 shadow-lg">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <i className="fa-solid fa-circle-check fs-5"></i>
                <span>{toast}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast(null)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider')
  }
  return context
}
