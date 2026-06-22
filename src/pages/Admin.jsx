import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderTimeline from "../components/OrderTimeline";
import { useAuth } from "../context/AuthContext";
import { useStock } from "../context/StockContext";
import { useToast } from "../context/ToastContext";
import products from "../data/products";

const STATUS_FLOW = ["pending", "processing", "shipped", "delivered"];
const statusColor = { pending:"#f39c12", processing:"#3498db", shipped:"#9b59b6", delivered:"#2ecc71", cancelled:"#e74c3c" };

const Admin = () => {
  const { user, authFetch } = useAuth();
  const { getStock, setStock, seedStock } = useStock();
  const { showToast } = useToast();

  const [tab, setTab]       = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Stock management state
  const [stockEdits, setStockEdits] = useState({});   // { productId: typedValue }
  const [stockSearch, setStockSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [oRes, sRes] = await Promise.all([
        authFetch("/orders"),
        authFetch("/orders/stats"),
      ]);
      const oData = await oRes.json();
      const sData = await sRes.json();
      setOrders(oData.orders || []);
      setStats(sData);
    } catch {
      showToast?.("Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.role === "admin") fetchAll(); }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  const updateStatus = async (orderId, newStatus) => {
    try {
      const r = await authFetch(`/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify({ status: newStatus }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setOrders(prev => prev.map(o => o._id === orderId ? d.order : o));
      showToast?.(`Order marked as ${newStatus}`, "success");
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const lowStockProducts = products.filter(p => getStock(p.id, p.stock ?? 99) <= 10);

  const saveStock = async (productId) => {
    const raw = stockEdits[productId];
    if (raw === undefined || raw === "") return;
    setSavingId(productId);
    try {
      await setStock(productId, Number(raw));
      setStockEdits(prev => { const n = { ...prev }; delete n[productId]; return n; });
      showToast?.("Stock updated", "success");
    } catch (err) {
      showToast?.(err.message, "error");
    } finally {
      setSavingId(null);
    }
  };

  const initInventory = async () => {
    setSeeding(true);
    try {
      await seedStock(products.map(p => ({ productId: p.id, stock: p.stock ?? 0 })), false);
      showToast?.("Inventory initialised from catalog", "success");
    } catch (err) {
      showToast?.(err.message, "error");
    } finally {
      setSeeding(false);
    }
  };

  const stockList = products
    .filter(p => p.name.toLowerCase().includes(stockSearch.toLowerCase()))
    .filter(p => !lowOnly || getStock(p.id, p.stock ?? 99) <= 10)
    .sort((a, b) => getStock(a.id, a.stock ?? 99) - getStock(b.id, b.stock ?? 99));

  return (
    <>
      <Navbar />
      <section id="page-header" style={{ minHeight: 150 }}>
        <h2>#ADMIN PANEL</h2>
        <p>Manage orders, products &amp; store performance</p>
      </section>

      <div className="admin-layout section-p1">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <nav className="profile-nav">
            <button className={tab==="dashboard"?"active":""} onClick={()=>setTab("dashboard")}><i className="fal fa-th-large"></i> Dashboard</button>
            <button className={tab==="orders"?"active":""} onClick={()=>setTab("orders")}><i className="fal fa-box"></i> All Orders</button>
            <button className={tab==="stock"?"active":""} onClick={()=>setTab("stock")}><i className="fal fa-warehouse"></i> Manage Stock</button>
          </nav>
        </div>

        {/* Content */}
        <div className="admin-content">
          {loading ? (
            <div className="admin-loading"><i className="fal fa-spinner fa-spin"></i> Loading admin data...</div>
          ) : (
            <>
              {/* DASHBOARD */}
              {tab === "dashboard" && stats && (
                <div>
                  <div className="dash-stats">
                    <div className="dash-stat-card">
                      <i className="fal fa-receipt"></i>
                      <div><h3>{stats.totalOrders}</h3><p>Total Orders</p></div>
                    </div>
                    <div className="dash-stat-card">
                      <i className="fal fa-rupee-sign"></i>
                      <div><h3>₹{stats.totalRevenue}</h3><p>Total Revenue</p></div>
                    </div>
                    <div className="dash-stat-card">
                      <i className="fal fa-users"></i>
                      <div><h3>{stats.totalUsers}</h3><p>Registered Users</p></div>
                    </div>
                    <div className="dash-stat-card" onClick={() => setTab("stock")}>
                      <i className="fal fa-exclamation-triangle"></i>
                      <div><h3>{lowStockProducts.length}</h3><p>Low Stock Items</p></div>
                    </div>
                  </div>

                  <div className="profile-card" style={{ marginTop: 20 }}>
                    <h3>Order Status Breakdown</h3>
                    <div className="status-breakdown">
                      {STATUS_FLOW.concat("cancelled").map(s => (
                        <div key={s} className="status-pill-row">
                          <span className="status-dot" style={{ background: statusColor[s] }}></span>
                          <span className="status-label">{s.charAt(0).toUpperCase()+s.slice(1)}</span>
                          <span className="status-count">{stats.statusCounts?.[s] || 0}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="profile-card" style={{ marginTop: 20 }}>
                    <h3>Recent Orders</h3>
                    {orders.slice(0, 5).map(o => (
                      <div key={o._id} className="admin-order-row">
                        <span className="ao-id">#{o._id.slice(-6).toUpperCase()}</span>
                        <span className="ao-customer">{o.user?.name || "Guest"}</span>
                        <span className="ao-total">₹{o.total}</span>
                        <span className="order-status sm" style={{ background:statusColor[o.status]+"22", color:statusColor[o.status], border:`1px solid ${statusColor[o.status]}` }}>
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ALL ORDERS */}
              {tab === "orders" && (
                <div className="profile-card">
                  <h3>All Orders ({filteredOrders.length})</h3>

                  <div className="admin-filters">
                    <input
                      type="text"
                      placeholder="Search by order ID, name, or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="admin-search-input"
                    />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="sort-select">
                      <option value="all">All Statuses</option>
                      {STATUS_FLOW.concat("cancelled").map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <p style={{ color: "#888", padding: "30px 0", textAlign: "center" }}>No orders match your filters.</p>
                  ) : filteredOrders.map(o => (
                    <div key={o._id} className="order-card">
                      <div className="order-card-header">
                        <div><p style={{ fontSize:12,color:"#888" }}>Order ID</p><p style={{ fontWeight:700,fontSize:13 }}>#{o._id.slice(-8).toUpperCase()}</p></div>
                        <div><p style={{ fontSize:12,color:"#888" }}>Customer</p><p style={{ fontSize:13 }}>{o.user?.name || "Guest"} <br/><span style={{ fontSize:11,color:"#aaa" }}>{o.user?.email}</span></p></div>
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
                            <img src={item.image} alt={item.name} style={{ width:48,height:48,objectFit:"cover",borderRadius:6 }} />
                            <div><p style={{ fontWeight:600,fontSize:13 }}>{item.name}</p><p style={{ fontSize:12,color:"#888" }}>Size: {item.size} · Qty: {item.qty} · ₹{item.price}</p></div>
                          </div>
                        ))}
                      </div>
                      {o.address && (
                        <p style={{ fontSize: 12, color: "#888", padding: "0 18px 14px" }}>
                          <i className="fal fa-map-marker-alt"></i> {o.address.street}, {o.address.city}, {o.address.state} – {o.address.pincode} · {o.address.phone}
                        </p>
                      )}
                      {o.status !== "cancelled" && o.status !== "delivered" && (
                        <div className="admin-status-actions">
                          {STATUS_FLOW.map(s => (
                            <button
                              key={s}
                              className={`status-action-btn ${o.status === s ? "current" : ""}`}
                              onClick={() => updateStatus(o._id, s)}
                              disabled={o.status === s}
                            >
                              {s.charAt(0).toUpperCase()+s.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* MANAGE STOCK */}
              {tab === "stock" && (
                <div className="profile-card">
                  <div className="stock-manage-head">
                    <h3>Manage Inventory ({stockList.length})</h3>
                    <button className="seed-stock-btn" onClick={initInventory} disabled={seeding}>
                      <i className="fal fa-database"></i> {seeding ? "Saving..." : "Initialise from Catalog"}
                    </button>
                  </div>

                  <p style={{ fontSize: 12, color: "#888", margin: "0 0 14px" }}>
                    Edit a product's quantity and click <strong>Save</strong>. Changes apply live to product cards across the store.
                  </p>

                  <div className="admin-filters">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={stockSearch}
                      onChange={(e) => setStockSearch(e.target.value)}
                      className="admin-search-input"
                    />
                    <button className={`filter-toggle-btn ${lowOnly ? "active" : ""}`} onClick={() => setLowOnly(v => !v)}>
                      <i className="fal fa-exclamation-triangle"></i> Low / Out only
                    </button>
                  </div>

                  {stockList.length === 0 ? (
                    <p style={{ color: "#888", padding: "20px 0" }}>No products match.</p>
                  ) : (
                    <div className="admin-stock-list">
                      {stockList.map(p => {
                        const current = getStock(p.id, p.stock ?? 99);
                        const edited  = stockEdits[p.id];
                        const status  = current <= 0 ? "out" : current <= 10 ? "low" : "in";
                        return (
                          <div key={p.id} className="admin-stock-row">
                            <img src={`/products/${p.img}`} alt={p.name} style={{ width:52,height:52,objectFit:"cover",borderRadius:6 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</p>
                              <p style={{ fontSize: 12, color: "#888" }}>{p.brand} · ₹{p.price}</p>
                            </div>
                            <span className={`stock-pill ${status}`}>
                              {status === "out" ? "Out" : status === "low" ? `${current} left` : `${current} in stock`}
                            </span>
                            <div className="stock-edit-controls">
                              <input
                                type="number"
                                min="0"
                                className="stock-qty-input"
                                value={edited !== undefined ? edited : current}
                                onChange={(e) => setStockEdits(prev => ({ ...prev, [p.id]: e.target.value }))}
                              />
                              <button
                                className="stock-save-btn"
                                onClick={() => saveStock(p.id)}
                                disabled={edited === undefined || edited === "" || Number(edited) === current || savingId === p.id}
                              >
                                {savingId === p.id ? "..." : "Save"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Admin;
