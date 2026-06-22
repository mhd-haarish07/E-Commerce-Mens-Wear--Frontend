import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { cartCount }           = useCart();
  const { user, logout }        = useAuth();
  const location                = useLocation();
  const navigate                = useNavigate();
  const dropRef                 = useRef(null);
  const isActive = (p) => location.pathname === p ? "active" : "";

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); setDropOpen(false); };
  const initials = user ? user.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "";

  return (
    <section id="header">
      <Link to="/" className="logo-link">
        <span className="brand-name">TN<span style={{ color:"#e63946" }}>91</span></span>
      </Link>

      <ul id="navbar" className={menuOpen ? "active" : ""}>
        <i className="far fa-times" id="close" onClick={() => setMenuOpen(false)}></i>
        <li><Link className={isActive("/")}        to="/"        onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link className={isActive("/shop")}    to="/shop"    onClick={() => setMenuOpen(false)}>Shop</Link></li>
        <li><Link className={isActive("/contact")} to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        {/* Mobile-only auth links */}
        {!user && <>
          <li className="mobile-auth-link"><Link to="/login"    onClick={() => setMenuOpen(false)}>Login</Link></li>
          <li className="mobile-auth-link"><Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
        </>}
        <li id="lg-bag">
          <Link to="/cart" className="cart-icon-wrap" onClick={() => setMenuOpen(false)}>
            <i className="far fa-shopping-bag"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </li>
      </ul>

      <div className="nav-auth" ref={dropRef}>
        {user ? (
          <div className="user-menu">
            <div className="user-avatar" onClick={() => setDropOpen(!dropOpen)} title={user.name}>
              {initials}
            </div>
            {dropOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar sm">{initials}</div>
                  <div>
                    <p className="ud-name">{user.name}</p>
                    <p className="ud-email">{user.email}</p>
                  </div>
                </div>
                <hr />
                <Link to="/profile"   onClick={() => setDropOpen(false)}><i className="fal fa-th-large"></i> Dashboard</Link>
                <Link to="/cart"      onClick={() => setDropOpen(false)}><i className="fal fa-shopping-bag"></i> My Cart {cartCount > 0 && <span className="dd-badge">{cartCount}</span>}</Link>
                <Link to="/profile"   onClick={() => setDropOpen(false)}><i className="fal fa-heart"></i> Wishlist</Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setDropOpen(false)} style={{ color: "#e63946" }}><i className="fal fa-user-shield"></i> Admin Panel</Link>
                )}
                <hr />
                <button onClick={handleLogout}><i className="fal fa-sign-out"></i> Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-btns">
            <Link to="/login"    className="btn-login">Login</Link>
            <Link to="/register" className="btn-signup">Sign Up</Link>
          </div>
        )}
        <div id="mobile">
          <Link to="/cart" className="cart-icon-wrap mobile-cart">
            <i className="far fa-shopping-bag"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <i className="far fa-bars" onClick={() => setMenuOpen(true)}></i>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
