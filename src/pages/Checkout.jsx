import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Loads the Razorpay checkout script once, on demand
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const STEPS = ["Address", "Payment", "Confirm"];

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [payConfig, setPayConfig] = useState({ configured: false, keyId: null });

  // Detect whether Razorpay live test mode is available
  useEffect(() => {
    authFetch("/payment/config")
      .then((r) => r.json())
      .then((d) => setPayConfig(d))
      .catch(() => setPayConfig({ configured: false, keyId: null }));
  }, []);

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);
  const [addrError, setAddrError] = useState("");

  const [address, setAddress] = useState({
    label: "Home", name: user?.name || "", phone: "", street: "", city: "", state: "", pincode: "", isDefault: false,
  });
  const [payment, setPayment] = useState("card");
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "", name: "" });

  // Load saved addresses from backend on mount
  useEffect(() => {
    if (!user) return;
    authFetch("/address")
      .then(r => r.json())
      .then(d => {
        const list = d.addresses || [];
        setSavedAddresses(list);
        if (list.length > 0) {
          const def = list.find(a => a.isDefault) || list[0];
          setSelectedAddrId(def._id);
          setAddress(def);
        } else {
          setShowAddForm(true);
        }
      })
      .catch(() => setShowAddForm(true));
  }, [user]);

  const selectSavedAddress = (addr) => {
    setSelectedAddrId(addr._id);
    setAddress(addr);
    setShowAddForm(false);
  };

  const saveNewAddress = async () => {
    setAddrError("");
    if (!address.name || address.phone.length < 10 || !address.street || !address.city || !address.state || address.pincode.length < 6) {
      setAddrError("Please fill all fields correctly (phone: 10 digits, pincode: 6 digits)");
      return;
    }
    setSavingAddr(true);
    try {
      const r = await authFetch("/address", { method: "POST", body: JSON.stringify(address) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setSavedAddresses(prev => [d.address, ...prev]);
      setSelectedAddrId(d.address._id);
      setAddress(d.address);
      setShowAddForm(false);
    } catch (err) {
      setAddrError(err.message);
    } finally {
      setSavingAddr(false);
    }
  };

  const discount = 0; // could be wired to cart coupon via context/localStorage if desired
  const shipping = cartTotal >= 999 || cartTotal === 0 ? 0 : 99;
  const grandTotal = cartTotal - discount + shipping;

  const addrValid = address.name && address.phone?.length >= 10 && address.street && address.city && address.state && address.pincode?.length >= 6;

  const goNext = () => {
    if (step === 0) {
      if (showAddForm || !selectedAddrId) {
        alert("Please save your address before continuing, or select a saved one.");
        return;
      }
      if (!addrValid) { alert("Please fill all address fields correctly"); return; }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // Saves the order to the backend once payment is settled
  const finalizeOrder = async (paymentInfo) => {
    const items = cart.map((i) => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty, size: i.size, image: i.image }));
    try {
      if (user) {
        await authFetch("/orders", {
          method: "POST",
          body: JSON.stringify({
            items, total: grandTotal, discount, shipping, address,
            paymentMethod: payment,
            paymentStatus: paymentInfo.status,
            razorpayOrderId:   paymentInfo.orderId   || "",
            razorpayPaymentId: paymentInfo.paymentId || "",
          }),
        });
      }
    } catch {
      /* even if the save fails, still show confirmation so the user isn't stuck */
    }
    setOrderPlaced(true);
    clearCart();
    setPlacing(false);
  };

  const placeOrder = async () => {
    setPlacing(true);

    // Cash on Delivery — no gateway, order is "pending" payment
    if (payment === "cod") {
      await finalizeOrder({ status: "pending" });
      return;
    }

    // Online payment (card / upi / netbanking) → Razorpay
    try {
      const r = await authFetch("/payment/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: grandTotal }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Could not start payment");

      // Simulation mode (no Razorpay keys configured)
      if (!d.configured) {
        showToast("Simulating payment — add Razorpay keys for the real gateway", "info");
        await new Promise((res) => setTimeout(res, 1200));
        await finalizeOrder({ status: "paid", orderId: d.order.id });
        return;
      }

      // Real Razorpay test checkout
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Couldn't load Razorpay. Check your internet connection.");

      const rzp = new window.Razorpay({
        key: d.keyId,
        amount: d.order.amount,
        currency: d.order.currency,
        name: "TN91 Silkes & Readymades",
        description: `Order payment — ₹${grandTotal}`,
        order_id: d.order.id,
        prefill: { name: address.name, contact: address.phone, email: user?.email || "" },
        theme: { color: "#088178" },
        handler: async (resp) => {
          try {
            const vr = await authFetch("/payment/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id:   resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature:  resp.razorpay_signature,
              }),
            });
            const vd = await vr.json();
            if (!vr.ok || !vd.verified) throw new Error("Payment verification failed");
            showToast("Payment successful!", "success");
            await finalizeOrder({ status: "paid", orderId: resp.razorpay_order_id, paymentId: resp.razorpay_payment_id });
          } catch (err) {
            showToast(err.message, "error");
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => { showToast("Payment cancelled", "warning"); setPlacing(false); },
        },
      });
      rzp.on("payment.failed", (resp) => {
        showToast("Payment failed: " + (resp.error?.description || "please try again"), "error");
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      showToast(err.message || "Payment error", "error");
      setPlacing(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <>
        <Navbar />
        {/* <div className="empty-cart">
          <div className="empty-cart-inner">
            <i className="far fa-shopping-bag empty-cart-icon"></i>
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before checking out.</p>
            <Link to="/shop" className="btn-outline" style={{ display: "inline-block", marginTop: 16 }}>Browse Shop</Link>
          </div>
        </div> */}
        <Footer />
      </>
    );
  }

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="order-success">
          <div className="order-success-card">
            <div className="success-icon"><i className="fas fa-check"></i></div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you, {address.name}. Your order will be delivered to:</p>
            <p className="success-address">{address.street}, {address.city}, {address.state} – {address.pincode}</p>
            <p className="success-total">Total {payment === "cod" ? "Payable" : "Paid"}: <strong>₹{grandTotal}</strong></p>
            <p className="success-pay">
              Payment: {payment === "card" ? "Credit/Debit Card" : payment === "upi" ? "UPI" : payment === "netbanking" ? "Net Banking" : "Cash on Delivery"}
              {payment === "cod"
                ? <span className="pay-badge pending"> • Pending</span>
                : <span className="pay-badge paid"> • Paid ✓</span>}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
              <Link to="/shop" className="btn-outline">Continue Shopping</Link>
              <Link to="/profile" className="checkout-btn" style={{ textDecoration: "none", display: "inline-block", padding: "12px 28px", width: "auto" }}>View My Orders</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section id="page-header" style={{ minHeight: 160 }}>
        <h2>#CHECKOUT</h2>
        <p>Complete your order in a few steps</p>
      </section>

      {/* Step indicator */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`checkout-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
            <div className="step-circle">{i < step ? <i className="fas fa-check"></i> : i + 1}</div>
            <span>{s}</span>
            {i < STEPS.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>

      <div className="checkout-layout section-p1">
        {/* Main content */}
        <div className="checkout-main">

          {/* STEP 0 — ADDRESS */}
          {step === 0 && (
            <div className="checkout-card">
              <h3><i className="fal fa-map-marker-alt"></i> Delivery Address</h3>

              {!user && (
                <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
                  <Link to="/login" style={{ color: "#088178", fontWeight: 700 }}>Login</Link> to save your address for faster checkout next time.
                </p>
              )}

              {/* Saved addresses list */}
              {savedAddresses.length > 0 && (
                <div className="saved-addr-list">
                  {savedAddresses.map((a) => (
                    <div
                      key={a._id}
                      className={`saved-addr-card ${selectedAddrId === a._id && !showAddForm ? "selected" : ""}`}
                      onClick={() => selectSavedAddress(a)}
                    >
                      <div className="saved-addr-radio">
                        {selectedAddrId === a._id && !showAddForm && <i className="fas fa-check-circle"></i>}
                      </div>
                      <div className="saved-addr-info">
                        <p className="saved-addr-label">{a.label} {a.isDefault && <span className="default-tag">Default</span>}</p>
                        <p className="saved-addr-name">{a.name} · {a.phone}</p>
                        <p className="saved-addr-text">{a.street}, {a.city}, {a.state} – {a.pincode}</p>
                      </div>
                    </div>
                  ))}
                  {!showAddForm && (
                    <button className="add-new-addr-btn" onClick={() => { setShowAddForm(true); setAddrError(""); setAddress({ label:"Home", name:user?.name||"", phone:"", street:"", city:"", state:"", pincode:"", isDefault:false }); }}>
                      <i className="fal fa-plus"></i> Add New Address
                    </button>
                  )}
                </div>
              )}

              {/* New address form */}
              {(showAddForm || savedAddresses.length === 0) && (
                <div className={savedAddresses.length > 0 ? "new-addr-form" : ""}>
                  {savedAddresses.length > 0 && <h4 style={{ fontSize: 14, fontWeight: 800, margin: "16px 0 12px" }}>New Address</h4>}

                  {addrError && <p className="auth-error" style={{ marginBottom: 12 }}>{addrError}</p>}

                  <div className="pf-row">
                    <div className="pf-field"><label>Label</label>
                      <select value={address.label} onChange={e=>setAddress({...address,label:e.target.value})} style={{ padding:"10px 14px", border:"1.5px solid #e0e0e0", borderRadius:6, fontSize:14 }}>
                        <option>Home</option><option>Work</option><option>Other</option>
                      </select>
                    </div>
                    <div className="pf-field"><label>Full Name *</label><input value={address.name} onChange={e=>setAddress({...address,name:e.target.value})} placeholder="Your full name" /></div>
                  </div>
                  <div className="pf-field"><label>Phone Number *</label><input value={address.phone} onChange={e=>setAddress({...address,phone:e.target.value})} placeholder="10-digit mobile number" maxLength={10} /></div>
                  <div className="pf-field"><label>Street Address *</label><input value={address.street} onChange={e=>setAddress({...address,street:e.target.value})} placeholder="House no, street, area" /></div>
                  <div className="pf-row">
                    <div className="pf-field"><label>City *</label><input value={address.city} onChange={e=>setAddress({...address,city:e.target.value})} placeholder="City" /></div>
                    <div className="pf-field"><label>State *</label><input value={address.state} onChange={e=>setAddress({...address,state:e.target.value})} placeholder="State" /></div>
                    <div className="pf-field"><label>Pincode *</label><input value={address.pincode} onChange={e=>setAddress({...address,pincode:e.target.value})} placeholder="6-digit pincode" maxLength={6} /></div>
                  </div>

                  {user ? (
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
                      <button className="checkout-btn" style={{ width: "auto", padding: "10px 24px", marginTop: 0 }} onClick={saveNewAddress} disabled={savingAddr}>
                        {savingAddr ? "Saving..." : "Save Address"}
                      </button>
                      {savedAddresses.length > 0 && (
                        <button className="btn-outline" onClick={() => { setShowAddForm(false); const def = savedAddresses.find(a=>a.isDefault)||savedAddresses[0]; if (def) selectSavedAddress(def); }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>This address will only be used for this order (not saved).</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 1 — PAYMENT */}
          {step === 1 && (
            <div className="checkout-card">
              <h3><i className="fal fa-credit-card"></i> Payment Method</h3>

              <div className={`pay-mode-banner ${payConfig.configured ? "live" : "sim"}`}>
                <i className={`fas ${payConfig.configured ? "fa-shield-check" : "fa-flask"}`}></i>
                {payConfig.configured
                  ? <span>Secure payments by <strong>Razorpay</strong> (test mode). Use test card <strong>4111 1111 1111 1111</strong>, any future expiry &amp; CVV.</span>
                  : <span><strong>Simulation mode</strong> — payments are mocked. Add Razorpay test keys in <code>backend/.env</code> to enable the real gateway.</span>}
              </div>

              <div className="payment-options">
                {[
                  { key: "card",       icon: "fa-credit-card",   label: "Credit / Debit Card" },
                  { key: "upi",        icon: "fa-mobile-alt",    label: "UPI" },
                  { key: "netbanking", icon: "fa-university",    label: "Net Banking" },
                  { key: "cod",        icon: "fa-money-bill-wave", label: "Cash on Delivery" },
                ].map((opt) => (
                  <label key={opt.key} className={`payment-option ${payment === opt.key ? "selected" : ""}`}>
                    <input type="radio" name="payment" value={opt.key} checked={payment === opt.key} onChange={() => setPayment(opt.key)} />
                    <i className={`fal ${opt.icon}`}></i>
                    <span>{opt.label}</span>
                    {payment === opt.key && <i className="fas fa-check-circle pay-check"></i>}
                  </label>
                ))}
              </div>

              {!payConfig.configured && payment === "card" && (
                <div className="card-form">
                  <div className="pf-field"><label>Card Number</label><input placeholder="1234 5678 9012 3456" value={cardForm.number} onChange={e=>setCardForm({...cardForm,number:e.target.value})} maxLength={19} /></div>
                  <div className="pf-row">
                    <div className="pf-field"><label>Expiry</label><input placeholder="MM/YY" value={cardForm.expiry} onChange={e=>setCardForm({...cardForm,expiry:e.target.value})} maxLength={5} /></div>
                    <div className="pf-field"><label>CVV</label><input placeholder="123" type="password" value={cardForm.cvv} onChange={e=>setCardForm({...cardForm,cvv:e.target.value})} maxLength={3} /></div>
                  </div>
                  <div className="pf-field"><label>Name on Card</label><input placeholder="Cardholder name" value={cardForm.name} onChange={e=>setCardForm({...cardForm,name:e.target.value})} /></div>
                </div>
              )}
              {!payConfig.configured && payment === "upi" && (
                <div className="card-form"><div className="pf-field"><label>UPI ID</label><input placeholder="yourname@upi" /></div></div>
              )}
              {payConfig.configured && payment !== "cod" && (
                <div className="free-shipping-note" style={{ marginTop: 16 }}>
                  🔒 You'll complete your payment securely in the Razorpay window after clicking <strong>Place Order</strong>.
                </div>
              )}
              {payment === "cod" && (
                <div className="free-shipping-note" style={{ marginTop: 16 }}>💵 Pay ₹{grandTotal} in cash when your order is delivered.</div>
              )}
            </div>
          )}

          {/* STEP 2 — CONFIRM */}
          {step === 2 && (
            <div className="checkout-card">
              <h3><i className="fal fa-clipboard-check"></i> Review &amp; Confirm</h3>

              <div className="review-block">
                <h4>Delivery Address</h4>
                <p>{address.name} · {address.phone}</p>
                <p>{address.street}, {address.city}, {address.state} – {address.pincode}</p>
                <button className="edit-link" onClick={() => setStep(0)}>Edit</button>
              </div>

              <div className="review-block">
                <h4>Payment Method</h4>
                <p>{payment === "card" ? "Credit/Debit Card" : payment === "upi" ? "UPI" : payment === "netbanking" ? "Net Banking" : "Cash on Delivery"}</p>
                <button className="edit-link" onClick={() => setStep(1)}>Edit</button>
              </div>

              <div className="review-block">
                <h4>Order Items ({cart.length})</h4>
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="order-item">
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                    <div><p style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</p><p style={{ fontSize: 12, color: "#888" }}>Size: {item.size} · Qty: {item.qty} · ₹{item.price * item.qty}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="checkout-nav">
            {step > 0 && <button className="btn-outline" onClick={goBack}>← Back</button>}
            {step < STEPS.length - 1
              ? <button className="checkout-btn" style={{ width: "auto", padding: "13px 32px" }} onClick={goNext}>Continue →</button>
              : <button className="checkout-btn" style={{ width: "auto", padding: "13px 32px" }} onClick={placeOrder} disabled={placing}>
                  {placing
                    ? "Processing..."
                    : payment === "cod"
                      ? `Place Order — ₹${grandTotal}`
                      : `Pay ₹${grandTotal}`}
                </button>
            }
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="checkout-sidebar">
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free-tag">FREE</span> : `₹${shipping}`}</span></div>
              <div className="summary-row total-row"><span>Total</span><span>₹{grandTotal}</span></div>
            </div>
            <div style={{ marginTop: 14 }}>
              {cart.slice(0, 3).map((item) => (
                <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4 }} />
                  <span style={{ fontSize: 12, color: "#666", flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>×{item.qty}</span>
                </div>
              ))}
              {cart.length > 3 && <p style={{ fontSize: 12, color: "#aaa" }}>+{cart.length - 3} more items</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
