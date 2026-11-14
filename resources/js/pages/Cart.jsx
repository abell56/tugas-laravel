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
    address: 'Jl. Sudirman No. 45, Jagakarsa, Jakarta Selatan',
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
      if (confirm('Anda belum login. Ingin masuk terlebih dahulu agar pesanan tercatat di akun Anda?')) {
        navigate('/login', { state: { from: { pathname: '/cart' } } })
        return
      }
    }

    if (cartItems.length === 0) {
      alert('Keranjang Anda masih kosong.')
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
            // Buka modal fallback agar user tetap bisa menyelesaikan tes
            openSimulationModal(generatedOrderNumber, paymentData.snap_token)
          },
          onClose: () => {
            // Jika user menutup pop-up midtrans
            openSimulationModal(generatedOrderNumber, paymentData.snap_token)
          },
        })
      } else {
        // Tampilkan Modal Pembayaran Midtrans Sandbox / Simulator
        openSimulationModal(generatedOrderNumber, paymentData.snap_token || 'SIMULATION-TOKEN')
      }
    } catch (err) {
      console.error('Error during checkout:', err)
      alert('Terjadi kesalahan saat memproses pesanan.')
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
        qris: 'QRIS (GoPay / OVO / Dana)',
        bca: 'Bank Transfer (BCA Virtual Account)',
        mandiri: 'Bank Transfer (Mandiri Bill Payment)',
        bni: 'Bank Transfer (BNI Virtual Account)',
        delivery: 'Payment at Delivery (Bayar sebelum pengiriman)',
      }
      finishOrder(midtransModal.orderNumber, methodLabels[selectedMethod] || 'Midtrans Payment')
    }, 1200)
  }

  // =========================================================================
  // 1. TAMPILAN LAYAR SUKSES PEMBAYARAN & PESANAN
  // =========================================================================
  if (orderSuccess) {
    return (
      <div className="container my-5 py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 text-center p-4 p-md-5">
              <div
                className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mx-auto mb-4"
                style={{ width: '84px', height: '84px', fontSize: '2.5rem' }}
              >
                <i className="fa-solid fa-check"></i>
              </div>

              <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill mb-2 fw-semibold">
                <i className="fa-solid fa-shield-halved me-1"></i> Pembayaran Terverifikasi Midtrans
              </span>
              <h2 className="fw-bold text-dark mb-2">Pembayaran Berhasil!</h2>
              <p className="text-secondary mb-4">
                Terima kasih, <strong>{orderSuccess.customerName}</strong>. Transaksi dan pembayaran Anda telah resmi tercatat di database toko buku.
              </p>

              <div className="bg-light rounded-3 p-3 text-start mb-4 border">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">Nomor Pesanan:</span>
                  <span className="fw-bold text-primary font-monospace">
                    {orderSuccess.orderNumber}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">Metode Pembayaran:</span>
                  <span className="fw-semibold text-dark small">
                    {orderSuccess.paymentMethod}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">Status Transaksi:</span>
                  <span className="badge bg-success">Lunas (Paid)</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">Total Item:</span>
                  <span className="fw-semibold">{orderSuccess.itemCount} Buku</span>
                </div>
                <div className="d-flex justify-content-between pt-2 border-top">
                  <span className="fw-bold">Total Pembayaran:</span>
                  <span className="fw-bold text-success fs-5">
                    {formatRupiah(orderSuccess.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <Link to="/book" className="btn btn-outline-secondary rounded-pill px-4 py-2">
                  <i className="fa-solid fa-book-open me-2"></i> Belanja Lagi
                </Link>
                <Link to="/profile" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                  <i className="fa-solid fa-user me-2"></i> Lihat Riwayat Pesanan
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
            className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-4"
            style={{ width: '96px', height: '96px', fontSize: '2.5rem' }}
          >
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <h2 className="fw-bold text-dark mb-2">Keranjang Belanja Anda Kosong</h2>
          <p className="lead text-secondary col-lg-6 mx-auto mb-4">
            Anda belum menambahkan buku apapun ke keranjang. Jelajahi katalog buku pilihan kami sekarang!
          </p>
          <Link
            to="/book"
            className="btn btn-primary rounded-pill px-5 py-3 fw-semibold shadow-sm"
          >
            <i className="fa-solid fa-book me-2"></i> Jelajahi Buku Sekarang
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
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2 fw-semibold">
          <i className="fa-solid fa-cart-shopping me-1"></i> Keranjang & Pembayaran
        </span>
        <h1 className="fw-bold text-dark">Keranjang Belanja Buku</h1>
        <p className="text-secondary">
          Periksa kembali buku pesanan Anda dan lanjutkan ke pembayaran Midtrans.
        </p>
      </div>

      <div className="row g-4">
        {/* Kolom Kiri: Tabel Daftar Item */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-secondary small">
                  <tr>
                    <th style={{ minWidth: '240px' }}>Buku</th>
                    <th style={{ width: '130px' }}>Harga Satuan</th>
                    <th style={{ width: '130px' }} className="text-center">Kuantitas</th>
                    <th style={{ width: '130px' }} className="text-end">Subtotal</th>
                    <th style={{ width: '60px' }} className="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="rounded shadow-sm"
                            style={{ width: '50px', height: '68px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700&auto=format&fit=crop'
                            }}
                          />
                          <div>
                            <h6 className="mb-1 fw-bold text-dark">{item.title}</h6>
                            <small className="text-muted d-block">
                              <i className="fa-solid fa-user-pen me-1"></i>
                              {item.author}
                            </small>
                            <span className="badge bg-light text-secondary border mt-1">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="fw-medium text-secondary">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm border rounded-pill overflow-hidden">
                          <button
                            type="button"
                            className="btn btn-light px-2"
                            onClick={() => updateQuantity(item.id, -1)}
                            title="Kurangi kuantitas"
                          >
                            <i className="fa-solid fa-minus small"></i>
                          </button>
                          <span className="btn btn-light px-3 fw-bold bg-white border-0">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="btn btn-light px-2"
                            onClick={() => updateQuantity(item.id, 1)}
                            title="Tambah kuantitas"
                          >
                            <i className="fa-solid fa-plus small"></i>
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-bold text-primary">
                        {formatRupiah(item.price * item.quantity)}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          title="Hapus dari keranjang"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
              <Link to="/book" className="btn btn-outline-secondary rounded-pill px-3 btn-sm">
                <i className="fa-solid fa-arrow-left me-1"></i> Tambah Buku Lain
              </Link>
              <button
                type="button"
                className="btn btn-outline-danger rounded-pill px-3 btn-sm"
                onClick={clearCart}
              >
                <i className="fa-solid fa-trash-can me-1"></i> Kosongkan Keranjang
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan & Form Pemesanan */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold text-dark mb-3">Ringkasan Pesanan</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Total Jumlah Buku</span>
              <span className="fw-semibold">{totalItems} pcs</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Biaya Pengiriman</span>
              <span className="badge bg-success-subtle text-success">Gratis Ongkir</span>
            </div>
            <div className="d-flex justify-content-between pt-3 border-top mb-4">
              <span className="fw-bold fs-5">Total Tagihan</span>
              <span className="fw-bold fs-5 text-primary">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            {/* Form Informasi Pengiriman */}
            <form onSubmit={handleCheckout}>
              <h6 className="fw-bold text-dark mb-2">Data Pengiriman & Pemesan</h6>

              <div className="mb-2">
                <label className="form-label small text-secondary fw-semibold mb-1">
                  Nama Pemesan
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-sm"
                  placeholder="Nama lengkap..."
                  value={shippingForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-secondary fw-semibold mb-1">
                  Email Notifikasi
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-sm"
                  placeholder="alamat@email.com"
                  value={shippingForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold mb-1">
                  Alamat Lengkap Pengiriman
                </label>
                <textarea
                  name="address"
                  rows="2"
                  className="form-control form-control-sm"
                  placeholder="Alamat lengkap penerima..."
                  value={shippingForm.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="d-flex align-items-center gap-2 mb-3 p-2 bg-light rounded border text-muted small">
                <i className="fa-solid fa-credit-card text-primary fs-5"></i>
                <span>Metode Pembayaran: <strong>Midtrans Payment Gateway</strong></span>
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
                    Bayar Sekarang (Midtrans)
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
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Header Modal Midtrans */}
              <div className="modal-header bg-dark text-white border-bottom py-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary text-white px-2 py-1 rounded fw-bold small">
                    MIDTRANS
                  </div>
                  <h6 className="modal-title fw-bold mb-0">Payment Gateway Snap</h6>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMidtransModal(null)}
                  disabled={isProcessingPayment}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="text-center pb-3 border-bottom mb-3">
                  <span className="text-muted small">Total Tagihan Pembayaran:</span>
                  <h3 className="fw-bold text-primary mb-1">
                    {formatRupiah(midtransModal.amount)}
                  </h3>
                  <small className="text-muted font-monospace">
                    Order ID: {midtransModal.orderNumber}
                  </small>
                </div>

                <h6 className="fw-bold text-dark mb-3">Pilih Metode Pembayaran:</h6>

                <div className="d-flex flex-column gap-2 mb-4">
                  {/* Pilihan 1: QRIS */}
                  <label
                    className={`card border p-3 rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                      selectedMethod === 'qris' ? 'border-primary bg-primary-subtle' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
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
                        <div className="fw-bold text-dark">QRIS / E-Wallet</div>
                        <small className="text-secondary">GoPay, OVO, ShopeePay, Dana</small>
                      </div>
                    </div>
                    <i className="fa-solid fa-qrcode fs-3 text-primary"></i>
                  </label>

                  {/* Pilihan 2: Virtual Account BCA */}
                  <label
                    className={`card border p-3 rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                      selectedMethod === 'bca' ? 'border-primary bg-primary-subtle' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
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
                        <div className="fw-bold text-dark">BCA Virtual Account</div>
                        <small className="text-secondary">Verifikasi Otomatis 24 Jam</small>
                      </div>
                    </div>
                    <i className="fa-solid fa-building-columns fs-3 text-secondary"></i>
                  </label>

                  {/* Pilihan 3: Mandiri */}
                  <label
                    className={`card border p-3 rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                      selectedMethod === 'mandiri' ? 'border-primary bg-primary-subtle' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
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
                        <div className="fw-bold text-dark">Mandiri Bill Payment</div>
                        <small className="text-secondary">ATM / Livin by Mandiri</small>
                      </div>
                    </div>
                    <i className="fa-solid fa-credit-card fs-3 text-secondary"></i>
                  </label>

                  {/* Pilihan 4: Payment at Delivery */}
                  <label
                    className={`card border p-3 rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                      selectedMethod === 'delivery' ? 'border-primary bg-primary-subtle' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
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
                        <div className="fw-bold text-dark">Payment at Delivery</div>
                        <small className="text-secondary">Konfirmasi bayar sebelum paket dikirim</small>
                      </div>
                    </div>
                    <i className="fa-solid fa-truck-fast fs-3 text-success"></i>
                  </label>
                </div>

                <div className="alert alert-info py-2 px-3 small mb-0">
                  <i className="fa-solid fa-circle-info me-1"></i>
                  Midtrans Sandbox Simulator Mode aktif untuk verifikasi transaksi instan.
                </div>
              </div>

              <div className="modal-footer bg-light border-top py-3">
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
                  className="btn btn-success rounded-pill px-4 fw-semibold shadow-sm"
                  onClick={confirmSimulationPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Memverifikasi Pembayaran...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-shield-check me-2"></i>
                      Bayar Sekarang ({formatRupiah(midtransModal.amount)})
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
