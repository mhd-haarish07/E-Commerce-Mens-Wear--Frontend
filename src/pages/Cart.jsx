import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const COUPONS = { TN91: 10, WELCOME20: 20, SAVE15: 15 };

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon]     = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setMsg]     = useState(null);

  const shipping    = cartTotal >= 999 || cartTotal === 0 ? 0 : 99;
  const discountAmt = Math.round((cartTotal * discount) / 100);
  const grandTotal  = cartTotal - discountAmt + shipping;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) { setDiscount(COUPONS[code]); setMsg({ type:"success", text:`✓ ${COUPONS[code]}% discount applied!` }); }
    else { setDiscount(0); setMsg({ type:"error", text:"✗ Invalid coupon code" }); }
  };

  if (cart.length === 0) return (
    <>
      <Navbar />
      <div className="empty-cart">
        <div className="empty-cart-inner">
          <i className="far fa-shopping-bag empty-cart-icon"></i>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-outline" style={{ display:"inline-block", marginTop:16 }}>Continue Shopping</Link>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      {/* <section id="page-header" className="cart-page-header">
        <h2>#YOUR CART</h2>
        <p>{cart.reduce((s,i) => s+i.qty, 0)} item{cart.reduce((s,i)=>s+i.qty,0)!==1?"s":""} in your cart</p>
      </section> */}

      {/* ── CART ITEMS — single responsive layout, no duplicate render ── */}
      <section className="cart-section section-p1">
        <div className="cart-items-list">
          {cart.map((item) => (
            <div className="cart-row" key={`${item.id}-${item.size}`}>
              <img
                className="cart-row-img"
                src={item.image}
                alt={item.name}
                onClick={() => navigate(`/product/${item.id}`)}
              />

              <div className="cart-row-info">
                <p className="cart-item-name" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</p>
                <p className="cart-item-brand">{item.brand} &middot; <span className="size-badge">{item.size}</span></p>
                <p className="cart-price-mobile">₹{item.price}</p>
              </div>

              <div className="cart-row-price desktop-cell"><span className="cart-price">₹{item.price}</span></div>

              <div className="cart-row-qty">
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, item.size, item.qty - 1)}>−</button>
                  <input type="number" value={item.qty} min="1"
                    onChange={(e) => updateQty(item.id, item.size, Number(e.target.value))} />
                  <button onClick={() => updateQty(item.id, item.size, item.qty + 1)}>+</button>
                </div>
              </div>

              <div className="cart-row-subtotal"><span className="cart-subtotal">₹{item.price * item.qty}</span></div>

              <button className="remove-btn cart-row-remove" onClick={() => removeFromCart(item.id, item.size)}>
                <i className="fal fa-trash-alt"></i>
              </button>
            </div>
          ))}
        </div>

        {/* Cart actions */}
        <div className="cart-actions">
          <Link to="/shop" className="btn-outline">← Continue Shopping</Link>
          <button className="btn-outline danger" onClick={clearCart}>🗑 Clear Cart</button>
        </div>
      </section>

      {/* ── COUPON + ORDER SUMMARY ── */}
      <section className="cart-summary-section section-p1">
        {/* Coupon */}
        <div className="coupon-box">
          <h3>Apply Coupon</h3>
          <p className="coupon-hint">Try: <strong>TN91</strong> · <strong>WELCOME20</strong> · <strong>SAVE15</strong></p>
          <div className="coupon-input-row">
            <input type="text" placeholder="Enter coupon code" value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCoupon()} />
            <button className="coupon-apply-btn" onClick={applyCoupon}>Apply</button>
          </div>
          {couponMsg && <p className={`coupon-msg ${couponMsg.type}`}>{couponMsg.text}</p>}
          {discount > 0 && (
            <button className="coupon-remove-btn" onClick={() => { setDiscount(0); setCoupon(""); setMsg(null); }}>
              Remove Coupon
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div className="order-summary-box">
          <h3>Order Summary</h3>

          {cartTotal < 999 && (
            <div className="free-shipping-note">
              🚚 Add <strong>₹{999 - cartTotal}</strong> more for FREE shipping!
            </div>
          )}

          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
            {discount > 0 && (
              <div className="summary-row green">
                <span>Discount ({discount}%)</span><span>−₹{discountAmt}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-tag">FREE</span> : `₹${shipping}`}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span><span>₹{grandTotal}</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout →
          </button>

          <div className="payment-methods">
            <p>Secure Payment</p>
            <div className="payment-icons">
              <span className="pay-icon">💳 Card</span>
              <span className="pay-icon">📱 UPI</span>
              <span className="pay-icon">🏦 Net Banking</span>
              <span className="pay-icon">💵 COD</span>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter" className="section-p1 section-m1">
        <div className="newstext">
          <h4>Sign Up for Newsletter</h4>
          <p>Get E-mail updates about our latest shop and <span>special offers.</span></p>
        </div>
        <div className="form">
          <input type="text" placeholder="Your email address" />
          <a href="/register" className="normal" style={{textDecoration:"none",display:"inline-block",padding:"10px 20px",background:"#088178",color:"#fff",borderRadius:4,fontWeight:700}}>Sign Up</a>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Cart;
