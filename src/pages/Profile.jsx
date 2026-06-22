import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import OrderTimeline from "../components/OrderTimeline";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLikes } from "../context/LikesContext";
import products from "../data/products";

const Profile = () => {
  const { user, logout, authFetch } = useAuth();
  const { cart, cartTotal } = useCart();
  const { likes } = useLikes();
  const navigate = useNavigate();

  const [tab,    setTab]    = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [form,   setForm]   = useState({ name: "" });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });
  const [msg,    setMsg]    = useState(null);

  useEffect(() => { if (!user) navigate("/login"); else setForm({ name: user.name }); }, [user]);
  useEffect(() => {
    if (tab === "orders") {
      authFetch("/orders/my").then(r=>r.json()).then(d=>setOrders(d.orders||[])).catch(()=>setOrders([]));
    }
  }, [tab]);

  const [cancellingId, setCancellingId] = useState(null);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order? It will be removed from your order list.")) return;
    setCancellingId(orderId);
    try {
      // Mark as cancelled, then delete it from the list/DB so the row disappears
      const r = await authFetch(`/orders/${orderId}/cancel`, { method: "PUT" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);

      await authFetch(`/orders/${orderId}`, { method: "DELETE" });

      setOrders(prev => prev.filter(o => o._id !== orderId));
      showMsg("Order cancelled and removed.");
    } catch (err) {
      showMsg(err.message, "error");
    } finally {
      setCancellingId(null);
    }
  };

  const showMsg = (text, type="success") => { setMsg({text,type}); setTimeout(()=>setMsg(null),3000); };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await authFetch("/auth/profile", { method:"PUT", body:JSON.stringify({name:form.name}) });
      showMsg("Profile updated!");
    } catch { showMsg("Update failed","error"); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const r = await authFetch("/auth/change-password", { method:"PUT", body:JSON.stringify(pwForm) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      showMsg("Password changed!"); setPwForm({oldPassword:"",newPassword:""});
    } catch (err) { showMsg(err.message,"error"); }
  };

  const likedProducts = products.filter(p => likes.includes(p.id));
  const initials = user ? user.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "";
  const statusColor = { pending:"#f39c12", processing:"#3498db", shipped:"#9b59b6", delivered:"#2ecc71", cancelled:"#e74c3c" };

  if (!user) return null;

  const tabs = [
    { key:"dashboard", icon:"fa-th-large",   label:"Dashboard" },
    { key:"orders",    icon:"fa-box",         label:"My Orders" },
    { key:"wishlist",  icon:"fa-heart",       label:"Wishlist" },
    { key:"profile",   icon:"fa-user",        label:"Profile" },
    { key:"security",  icon:"fa-shield-alt",  label:"Security" },
  ];

  return (
    <>
      <Navbar />
      <section id="page-header" style={{ minHeight:160 }}>
        <h2>My Account</h2>
        <p>Welcome back, {user.name.split(" ")[0]}!</p>
      </section>

      <div className="profile-page section-p1">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar-lg">{initials}</div>
          <h3 style={{ marginTop:12, fontWeight:800 }}>{user.name}</h3>
          <p style={{ fontSize:13, color:"#888" }}>{user.email}</p>
          <nav className="profile-nav">
            {tabs.map(t => (
              <button key={t.key} className={tab===t.key?"active":""} onClick={()=>setTab(t.key)}>
                <i className={`fal ${t.icon}`}></i> {t.label}
              </button>
            ))}
          </nav>
          <button className="profile-logout" onClick={()=>{logout();navigate("/")}}>
            <i className="fal fa-sign-out"></i> Logout
          </button>
        </div>

        {/* Content */}
        <div className="profile-content">
          {msg && <div className={`profile-msg ${msg.type}`}>{msg.text}</div>}

          {/* ─── DASHBOARD ─── */}
          {tab==="dashboard" && (
            <div>
              {/* Stats row */}
              <div className="dash-stats">
                <div className="dash-stat-card" onClick={()=>setTab("orders")}>
                  <i className="fal fa-box"></i>
                  <div><h3>{orders.length}</h3><p>Orders</p></div>
                </div>
                <div className="dash-stat-card" onClick={()=>navigate("/cart")}>
                  <i className="fal fa-shopping-bag"></i>
                  <div><h3>{cart.reduce((s,i)=>s+i.qty,0)}</h3><p>Cart Items</p></div>
                </div>
                <div className="dash-stat-card" onClick={()=>setTab("wishlist")}>
                  <i className="fal fa-heart"></i>
                  <div><h3>{likes.length}</h3><p>Wishlist</p></div>
                </div>
                <div className="dash-stat-card">
                  <i className="fal fa-tag"></i>
                  <div><h3>₹{cartTotal}</h3><p>Cart Value</p></div>
                </div>
              </div>

              {/* Quick links */}
              <div className="profile-card" style={{ marginTop:20 }}>
                <h3>Quick Actions</h3>
                <div className="quick-links">
                  <Link to="/shop" className="quick-link"><i className="fal fa-store"></i><span>Browse Shop</span></Link>
                  <Link to="/cart" className="quick-link"><i className="fal fa-shopping-cart"></i><span>View Cart</span></Link>
                  <button onClick={()=>setTab("wishlist")} className="quick-link"><i className="fal fa-heart"></i><span>Wishlist</span></button>
                  <button onClick={()=>setTab("orders")} className="quick-link"><i className="fal fa-box"></i><span>My Orders</span></button>
                  <button onClick={()=>setTab("profile")} className="quick-link"><i className="fal fa-user-edit"></i><span>Edit Profile</span></button>
                  <button onClick={()=>setTab("security")} className="quick-link"><i className="fal fa-lock"></i><span>Change Password</span></button>
                </div>
              </div>

              {/* Recent cart items */}
              {cart.length > 0 && (
                <div className="profile-card" style={{ marginTop:20 }}>
                  <h3>Items in Cart</h3>
                  {cart.slice(0,3).map(item => (
                    <div key={`${item.id}-${item.size}`} className="order-item">
                      <img src={item.image} alt={item.name} style={{ width:52,height:52,objectFit:"cover",borderRadius:6 }} />
                      <div>
                        <p style={{ fontWeight:600,fontSize:13 }}>{item.name}</p>
                        <p style={{ fontSize:12,color:"#888" }}>Size: {item.size} · Qty: {item.qty} · ₹{item.price*item.qty}</p>
                      </div>
                    </div>
                  ))}
                  {cart.length > 3 && <p style={{ fontSize:13,color:"#088178",marginTop:8 }}>+{cart.length-3} more items</p>}
                  <Link to="/cart" className="btn-outline" style={{ display:"inline-block",marginTop:12,fontSize:13 }}>View Full Cart</Link>
                </div>
              )}
            </div>
          )}

          {/* ─── ORDERS ─── */}
          {tab==="orders" && (
            <div className="profile-card">
              <h3>My Orders</h3>
              {orders.length === 0 ? (
                <div style={{ textAlign:"center",padding:"40px 0",color:"#888" }}>
                  <i className="fal fa-box-open" style={{ fontSize:48,display:"block",marginBottom:12 }}></i>
                  <p>No orders yet. <Link to="/shop" style={{ color:"#088178" }}>Start shopping!</Link></p>
                </div>
              ) : orders.map(o => (
                <div key={o._id} className="order-card">
                  <div className="order-card-header">
                    <div><p style={{ fontSize:12,color:"#888" }}>Order ID</p><p style={{ fontWeight:700,fontSize:13 }}>#{o._id.slice(-8).toUpperCase()}</p></div>
                    <div><p style={{ fontSize:12,color:"#888" }}>Date</p><p style={{ fontSize:13 }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</p></div>
                    <div><p style={{ fontSize:12,color:"#888" }}>Total</p><p style={{ fontWeight:700,color:"#088178" }}>₹{o.total}</p></div>
                    <span className="order-status" style={{ background:statusColor[o.status]+"22",color:statusColor[o.status],border:`1px solid ${statusColor[o.status]}` }}>
                      {o.status.charAt(0).toUpperCase()+o.status.slice(1)}
                    </span>
                  </div>
                  <OrderTimeline status={o.status} />
                  <div className="order-items">
                    {o.items.map((item,i) => (
                      <div key={i} className="order-item">
                        <img src={item.image} alt={item.name} style={{ width:52,height:52,objectFit:"cover",borderRadius:6 }} />
                        <div><p style={{ fontWeight:600,fontSize:13 }}>{item.name}</p><p style={{ fontSize:12,color:"#888" }}>Size: {item.size} · Qty: {item.qty} · ₹{item.price}</p></div>
                      </div>
                    ))}
                  </div>
                  {!["shipped","delivered"].includes(o.status) && (
                    <div className="order-card-footer">
                      <button
                        className="cancel-order-btn"
                        onClick={() => cancelOrder(o._id)}
                        disabled={cancellingId === o._id}
                      >
                        <i className="fal fa-times-circle"></i>
                        {cancellingId === o._id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ─── WISHLIST ─── */}
          {tab==="wishlist" && (
            <div>
              <div className="profile-card">
                <h3>My Wishlist ({likedProducts.length})</h3>
              </div>
              {likedProducts.length === 0 ? (
                <div style={{ textAlign:"center",padding:"40px",color:"#888" }}>
                  <i className="fal fa-heart" style={{ fontSize:48,display:"block",marginBottom:12 }}></i>
                  <p>No items in wishlist yet.</p>
                  <Link to="/shop" className="btn-outline" style={{ display:"inline-block",marginTop:12 }}>Browse Shop</Link>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {likedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          )}

          {/* ─── PROFILE ─── */}
          {tab==="profile" && (
            <div className="profile-card">
              <h3>Personal Information</h3>
              <form onSubmit={saveProfile}>
                <div className="pf-row">
                  <div className="pf-field"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                  <div className="pf-field"><label>Email Address</label><input value={user.email} disabled style={{ background:"#f5f5f5" }} /></div>
                </div>
                <div className="pf-field"><label>Account Role</label><input value={user.role==="admin"?"Administrator":"Customer"} disabled style={{ background:"#f5f5f5" }} /></div>
                <button type="submit" className="normal" style={{ background:"#088178",color:"#fff",padding:"12px 28px",marginTop:10,borderRadius:4,fontWeight:700 }}>Save Changes</button>
              </form>
            </div>
          )}

          {/* ─── SECURITY ─── */}
          {tab==="security" && (
            <div className="profile-card">
              <h3>Change Password</h3>
              <form onSubmit={changePassword}>
                <div className="pf-field"><label>Current Password</label><input type="password" value={pwForm.oldPassword} onChange={e=>setPwForm({...pwForm,oldPassword:e.target.value})} required /></div>
                <div className="pf-field"><label>New Password</label><input type="password" value={pwForm.newPassword} placeholder="Min. 6 characters" onChange={e=>setPwForm({...pwForm,newPassword:e.target.value})} required /></div>
                <button type="submit" className="normal" style={{ background:"#088178",color:"#fff",padding:"12px 28px",marginTop:10,borderRadius:4,fontWeight:700 }}>Update Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
