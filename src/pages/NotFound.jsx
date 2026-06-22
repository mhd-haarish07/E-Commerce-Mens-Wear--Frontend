import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => (
  <>
    <Navbar />
    <div className="notfound-page">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <Link to="/" className="btn-outline">← Back to Home</Link>
          <Link to="/shop" className="checkout-btn" style={{ width: "auto", padding: "11px 24px", textDecoration: "none", display: "inline-block" }}>Browse Shop</Link>
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default NotFound;
