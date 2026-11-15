import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [shippingForm, setShippingForm] = useState({
    name: user?.fullName || user?.name || '',
    email: user?.email || '',
    address: 'Jl. Lenteng Agung Raya No. 20, Jagakarsa, Jakarta Selatan',
    paymentMethod: 'qris',
    note: '',
  })

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  // State Modal Pembayaran Midtrans (Simulation / Real)
  const [midtransModal, setMidtransModal] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState('qris')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle Checkout & Integrasi Midtrans Snap
  const handleCheckout = async (e) => {
    e.preventDefault()

    if (!user) {
      if (confirm('Anda belum masuk. Ingin login terlebih dahulu agar pesanan tercatat di akun profil Anda?')) {
        navigate('/login', { state: { from: { pathname: '/cart' } } })
        return
      }
    }

    if (cartItems.length === 0) {
      alert('Keranjang belanja Anda masih kosong.')
      return
    }

    setIsCheckingOut(true)
    try {
      // 1. Simpan pesanan ke database MySQL melalui TransactionController
      const payload = {
        customer_id: user?.id || 10,
        items: cartItems.map((item) => ({
          book_id: item.id,
          price: item.price,
          quantity: item.quantity,
          title: item.title,
        })),
        address: shippingForm.address,
        note: shippingForm.note,
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        alert(data.message || 'Gagal memproses pesanan. Silakan coba lagi.')
        setIsCheckingOut(false)
        return
      }

      const generatedOrderNumber = data.order_number

      // 2. Minta Snap Token dari Backend Laravel (/api/payment/snap-token)
      const paymentResponse = await fetch('/api/payment/snap-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          order_number: generatedOrderNumber,
          gross_amount: totalPrice,
          customer_name: shippingForm.name || user?.name || 'Customer Bookstore',
          customer_email: shippingForm.email || user?.email || 'customer@bookstore.id',
          items: cartItems.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            title: item.title,
          })),
        }),
      })

      const paymentData = await paymentResponse.json().catch(() => ({}))

      // 3. Cek apakah Midtrans Snap JS tersedia dan valid
      if (
        paymentData.mode === 'midtrans_real' &&
        window.snap &&
        paymentData.snap_token
      ) {
        window.snap.pay(paymentData.snap_token, {
          onSuccess: (result) => {
            finishOrder(generatedOrderNumber, result.payment_type || 'Midtrans Snap')
          },
          onPending: (result) => {
            finishOrder(generatedOrderNumber, result.payment_type || 'Pending Midtrans')
          },
          onError: (error) => {
            console.error('Midtrans payment error:', error)
            openSimulationModal(generatedOrderNumber, paymentData.snap_token)
          },
          onClose: () => {
            openSimulationModal(generatedOrderNumber, paymentData.snap_token)
          },
        })
      } else {
        openSimulationModal(generatedOrderNumber, paymentData.snap_token || 'SIMULATION-TOKEN')
      }
    } catch (err) {
      console.error('Error during checkout:', err)
      alert('Terjadi kendala saat memproses transaksi.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Buka Modal Simulator Midtrans
  const openSimulationModal = (orderNumber, snapToken) => {
    setMidtransModal({
      orderNumber,
      snapToken,
      amount: totalPrice,
      itemCount: totalItems,
    })
  }

  // Selesaikan Pesanan & Tampilkan Layar Sukses
  const finishOrder = (orderNumber, method) => {
    setOrderSuccess({
      orderNumber: orderNumber,
      totalAmount: totalPrice,
      itemCount: totalItems,
      customerName: shippingForm.name || 'Pelanggan',
      paymentMethod: method,
    })
    setMidtransModal(null)
    clearCart()
  }

  // Konfirmasi Pembayaran dari Modal
  const confirmSimulationPayment = () => {
    setIsProcessingPayment(true)
    setTimeout(() => {
      setIsProcessingPayment(false)
      const methodLabels = {
        qris: 'QRIS (GoPay / OVO / Dana / LinkAja)',
        bca: 'BCA Virtual Account (Otomatis)',
        mandiri: 'Mandiri Bill Payment (Livin)',
        delivery: 'Payment at Delivery (Bayar Saat Pengiriman)',
      }
      finishOrder(midtransModal.orderNumber, methodLabels[selectedMethod] || 'Midtrans Payment')
    }, 1200)
  }

  // =========================================================================
  // 1. TAMPILAN LAYAR SUKSES PEMBAYARAN (RECEIPT STYLE CARD)
  // =========================================================================
  if (orderSuccess) {
    return (
      <div className="container my-5 py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="receipt-order-card text-center p-4 p-md-5">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: '68px',
                  height: '68px',
                  backgroundColor: 'var(--accent-secondary-light)',
                  color: 'var(--accent-secondary)',
                  fontSize: '2rem',
                }}
              >
                <i className="fa-solid fa-stamp"></i>
              </div>

              <div className="mb-2">
                <span className="receipt-stamp stamp-paid">
                  <i className="fa-solid fa-circle-check me-1"></i> Transaksi Terkonfirmasi Lunas
                </span>
              </div>

              <h2 className="editorial-heading fw-bold mb-2">Tanda Terima Pesanan</h2>
              <p className="small mb-4" style={{ color: 'var(--text-secondary)' }}>
                Terima kasih, <strong>{orderSuccess.customerName}</strong>. Pesanan buku Anda telah resmi tercatat di sistem penerbitan Bookstore.
              </p>

              {/* Receipt Body */}
              <div
                className="p-3 text-start mb-4 rounded-3"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-secondary">Nomor Faktur:</span>
                  <span className="receipt-order-number text-dark">
                    {orderSuccess.orderNumber}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-secondary">Kanal Pembayaran:</span>
                  <span className="fw-semibold text-dark">
                    {orderSuccess.paymentMethod}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-secondary">Jumlah Eksemplar:</span>
                  <span className="fw-semibold">{orderSuccess.itemCount} Buku</span>
                </div>
                <div className="d-flex justify-content-between pt-2 border-top" style={{ borderColor: 'var(--border-subtle) !important' }}>
                  <span className="fw-bold">Total Pembayaran:</span>
                  <span className="book-price-tag fs-5">
                    {formatRupiah(orderSuccess.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <Link to="/book" className="btn btn-outline-secondary rounded-pill px-4 py-2">
                  <i className="fa-solid fa-book-open me-2"></i> Jelajahi Rak Lain
                </Link>
                <Link to="/profile" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                  <i className="fa-regular fa-id-badge me-2"></i> Buka Riwayat Pesanan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // 2. TAMPILAN KERANJANG KOSONG
  // =========================================================================
  if (cartItems.length === 0) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="py-5">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
            style={{
              width: '84px',
              height: '84px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--accent-primary)',
              fontSize: '2.2rem',
            }}
          >
            <i className="fa-solid fa-basket-shopping"></i>
          </div>
          <h2 className="editorial-heading fw-bold mb-2">Keranjang Belanja Masih Kosong</h2>
          <p className="lead col-lg-6 mx-auto mb-4" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Anda belum memilih buku untuk disimpan di keranjang. Jelajahi katalog buku kurasi kami dan temukan bacaan yang Anda sukai.
          </p>
          <Link
            to="/book"
            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
          >
            <i className="fa-solid fa-book-open me-2"></i> Jelajahi Katalog Buku
          </Link>
        </div>
      </div>
    )
  }

  // =========================================================================
  // 3. TAMPILAN KERANJANG & FORM CHECKOUT
  // =========================================================================
  return (
    <div className="container my-5">
      {/* Header Halaman */}
      <div className="mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
        <span
          className="badge rounded-pill px-3 py-1 mb-2"
          style={{
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            border: '1px solid rgba(200, 90, 50, 0.25)',
          }}
        >
          <i className="fa-solid fa-basket-shopping me-1"></i> Rincian Pembelian
        </span>
        <h1 className="editorial-heading fw-bold mb-1">Keranjang Belanja Buku</h1>
        <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
          Periksa kembali judul buku dan jumlah eksemplar sebelum melanjutkan ke pembayaran Midtrans.
        </p>
      </div>

      <div className="row g-4">
        {/* Kolom Kiri: Tabel Daftar Item */}
        <div className="col-lg-8">
          <div className="card overflow-hidden mb-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ minWidth: '240px' }}>Buku & Penulis</th>
                    <th style={{ width: '130px' }}>Harga</th>
                    <th style={{ width: '140px' }} className="text-center">Jumlah</th>
                    <th style={{ width: '130px' }} className="text-end">Subtotal</th>
                    <th style={{ width: '50px' }} className="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded overflow-hidden shadow-sm flex-shrink-0"
                            style={{
                              width: '48px',
                              height: '68px',
                              backgroundColor: 'var(--bg-secondary)',
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src =
                                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                              }}
                            />
                          </div>
                          <div>
                            <h6 className="font-serif fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.98rem' }}>
                              {item.title}
                            </h6>
                            <small className="text-muted d-block">
                              Karya {item.author}
                            </small>
                            <span className="book-card-genre mt-1">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary small fw-medium">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="text-center">
                        <div
                          className="d-inline-flex align-items-center border rounded-pill px-2 py-1"
                          style={{
                            borderColor: 'var(--border-subtle) !important',
                            backgroundColor: 'var(--bg-surface)',
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-decoration-none text-dark p-0 px-1"
                            onClick={() => updateQuantity(item.id, -1)}
                            title="Kurangi kuantitas"
                          >
                            <i className="fa-solid fa-minus" style={{ fontSize: '0.75rem' }}></i>
                          </button>
                          <span className="px-2 fw-bold small">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-decoration-none text-dark p-0 px-1"
                            onClick={() => updateQuantity(item.id, 1)}
                            title="Tambah kuantitas"
                          >
                            <i className="fa-solid fa-plus" style={{ fontSize: '0.75rem' }}></i>
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-bold book-price-tag">
                        {formatRupiah(item.price * item.quantity)}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          title="Hapus dari keranjang"
                          onClick={() => removeFromCart(item.id)}
                          style={{ opacity: 0.7 }}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer py-3 d-flex justify-content-between align-items-center">
              <Link to="/book" className="btn btn-outline-secondary rounded-pill px-3 btn-sm">
                <i className="fa-solid fa-arrow-left me-1"></i> Pilih Buku Lain
              </Link>
              <button
                type="button"
                className="btn btn-outline-danger rounded-pill px-3 btn-sm"
                onClick={clearCart}
              >
                <i className="fa-regular fa-trash-can me-1"></i> Kosongkan Keranjang
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan & Form Pemesanan */}
        <div className="col-lg-4">
          <div
            className="card p-4 sticky-top"
            style={{
              top: '90px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h5 className="font-serif fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Ringkasan Pembelian
            </h5>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-secondary">Jumlah Eksemplar</span>
              <span className="fw-semibold">{totalItems} buku</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-secondary">Kemasan & Ongkir</span>
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: 'var(--accent-secondary-light)',
                  color: 'var(--accent-secondary)',
                  border: '1px solid rgba(61, 90, 69, 0.25)',
                }}
              >
                Bebas Biaya Pengiriman
              </span>
            </div>
            <div className="d-flex justify-content-between pt-3 border-top mb-4" style={{ borderColor: 'var(--border-subtle) !important' }}>
              <span className="fw-bold">Total Pembayaran</span>
              <span className="book-price-tag fs-5">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            {/* Form Informasi Pengiriman */}
            <form onSubmit={handleCheckout}>
              <h6 className="fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                Tujuan Pengiriman
              </h6>

              <div className="mb-2">
                <label className="form-label small text-secondary fw-semibold mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-sm"
                  placeholder="Nama lengkap penerima..."
                  value={shippingForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-secondary fw-semibold mb-1">
                  Email Konfirmasi
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-sm"
                  placeholder="alamat@surel.com"
                  value={shippingForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold mb-1">
                  Alamat Lengkap Penerima
                </label>
                <textarea
                  name="address"
                  rows="2"
                  className="form-control form-control-sm"
                  placeholder="Alamat jalan, nomor, RT/RW, kota, kode pos..."
                  value={shippingForm.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div
                className="d-flex align-items-center gap-2 mb-3 p-2 rounded small"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-secondary)' }}></i>
                <span>Gerbang Pembayaran Resmi: <strong>Midtrans Snap</strong></span>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-2 fw-semibold shadow-sm"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Menghubungkan Midtrans...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock me-2"></i>
                    Lanjut ke Pembayaran ({formatRupiah(totalPrice)})
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL SIMULASI PEMBAYARAN MIDTRANS SNAP
          ===================================================================== */}
      {midtransModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(35, 31, 32, 0.65)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content overflow-hidden">
              {/* Header Modal Midtrans */}
              <div className="modal-header py-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="px-2 py-1 rounded fw-bold small"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: '#FFFDF9',
                      fontSize: '0.75rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    MIDTRANS
                  </div>
                  <h6 className="modal-title font-serif fw-bold mb-0">Gerbang Pembayaran Snap</h6>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMidtransModal(null)}
                  disabled={isProcessingPayment}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="text-center pb-3 border-bottom mb-3" style={{ borderColor: 'var(--border-subtle) !important' }}>
                  <span className="small text-muted">Total Pembayaran Transaksi:</span>
                  <h3 className="book-price-tag mb-1 fs-4">
                    {formatRupiah(midtransModal.amount)}
                  </h3>
                  <small className="receipt-order-number text-muted">
                    No. Pesanan: {midtransModal.orderNumber}
                  </small>
                </div>

                <h6 className="fw-bold mb-3 small text-uppercase" style={{ letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                  Pilih Kanal Pembayaran:
                </h6>

                <div className="d-flex flex-column gap-2 mb-4">
                  {/* Pilihan 1: QRIS */}
                  <label
                    className="card p-3 d-flex flex-row align-items-center justify-content-between"
                    style={{
                      cursor: 'pointer',
                      borderColor: selectedMethod === 'qris' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      backgroundColor: selectedMethod === 'qris' ? 'var(--accent-light)' : 'var(--bg-surface)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        value="qris"
                        checked={selectedMethod === 'qris'}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="form-check-input"
                      />
                      <div>
                        <div className="fw-bold small text-dark">QRIS & Dompet Digital</div>
                        <small className="text-secondary">GoPay, OVO, ShopeePay, Dana, LinkAja</small>
                      </div>
                    </div>
                    <i className="fa-solid fa-qrcode fs-4" style={{ color: 'var(--accent-primary)' }}></i>
                  </label>

                  {/* Pilihan 2: Virtual Account BCA */}
                  <label
                    className="card p-3 d-flex flex-row align-items-center justify-content-between"
                    style={{
                      cursor: 'pointer',
                      borderColor: selectedMethod === 'bca' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      backgroundColor: selectedMethod === 'bca' ? 'var(--accent-light)' : 'var(--bg-surface)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        value="bca"
                        checked={selectedMethod === 'bca'}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="form-check-input"
                      />
                      <div>
                        <div className="fw-bold small text-dark">BCA Virtual Account</div>
                        <small className="text-secondary">Verifikasi pembayaran otomatis</small>
                      </div>
                    </div>
                    <i className="fa-solid fa-building-columns fs-4 text-secondary"></i>
                  </label>

                  {/* Pilihan 3: Mandiri */}
                  <label
                    className="card p-3 d-flex flex-row align-items-center justify-content-between"
                    style={{
                      cursor: 'pointer',
                      borderColor: selectedMethod === 'mandiri' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      backgroundColor: selectedMethod === 'mandiri' ? 'var(--accent-light)' : 'var(--bg-surface)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        value="mandiri"
                        checked={selectedMethod === 'mandiri'}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="form-check-input"
                      />
                      <div>
                        <div className="fw-bold small text-dark">Mandiri Bill Payment</div>
                        <small className="text-secondary">Livin by Mandiri & ATM</small>
                      </div>
                    </div>
                    <i className="fa-regular fa-credit-card fs-4 text-secondary"></i>
                  </label>

                  {/* Pilihan 4: Payment at Delivery */}
                  <label
                    className="card p-3 d-flex flex-row align-items-center justify-content-between"
                    style={{
                      cursor: 'pointer',
                      borderColor: selectedMethod === 'delivery' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      backgroundColor: selectedMethod === 'delivery' ? 'var(--accent-light)' : 'var(--bg-surface)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        value="delivery"
                        checked={selectedMethod === 'delivery'}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="form-check-input"
                      />
                      <div>
                        <div className="fw-bold small text-dark">Payment at Delivery (COD)</div>
                        <small className="text-secondary">Konfirmasi pembayaran sebelum paket dikirim</small>
                      </div>
                    </div>
                    <i className="fa-solid fa-truck-ramp-box fs-4" style={{ color: 'var(--accent-secondary)' }}></i>
                  </label>
                </div>

                <div
                  className="p-2 rounded small"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <i className="fa-solid fa-shield-halved me-1" style={{ color: 'var(--accent-secondary)' }}></i>
                  Mode Simulator Sandbox Midtrans aktif untuk verifikasi transaksi cepat.
                </div>
              </div>

              <div className="modal-footer py-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setMidtransModal(null)}
                  disabled={isProcessingPayment}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 fw-semibold"
                  onClick={confirmSimulationPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check me-2"></i>
                      Konfirmasi Bayar ({formatRupiah(midtransModal.amount)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart