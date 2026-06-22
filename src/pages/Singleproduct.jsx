import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StarRating from "../components/StarRating";
import ReviewSection from "../components/ReviewSection";
import ProductCard from "../components/ProductCard";
import { useProductRating } from "../hooks/useProductRatings";
import { useCart } from "../context/CartContext";
import { useStock } from "../context/StockContext";
import { useToast } from "../context/ToastContext";
import products from "../data/products";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getStock } = useStock();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === Number(id)) || products[0];
  const { rating, total } = useProductRating(product.id);
  const images = [`/products/${product.img}`, `/products/f2.jpg`, `/products/f3.jpg`, `/products/f4.jpg`];

  const stock      = getStock(product.id, product.stock ?? 99);
  const outOfStock = stock <= 0;
  const lowStock   = stock > 0 && stock <= 10;

  const [mainImg, setMainImg] = useState(images[0]);
  const [qty,     setQty]     = useState(1);
  const [size,    setSize]    = useState("M");
  const [added,   setAdded]   = useState(false);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart({ id: product.id, name: product.name, price: product.price, image: mainImg, brand: product.brand, size, qty });
    setAdded(true);
    showToast?.(`${product.name} added to cart`, "success");
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <Navbar />

      <section id="prodetails" className="section-p1">
        <div className="single-pro-image">
          <img src={mainImg} width="100%" alt={product.name} style={{ borderRadius: 8 }} />
          <div className="small-img-group">
            {images.map((img, i) => (
              <div className="small-img-col" key={i}>
                <img src={img} width="100%" className={`small-img ${mainImg === img ? "active-thumb" : ""}`} alt="" onClick={() => setMainImg(img)} />
              </div>
            ))}
          </div>
        </div>

        <div className="single-pro-details">
          <h6>Home / {product.brand}</h6>
          <h4>{product.name}</h4>

          {/* Live rating from real user reviews */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0 16px" }}>
            <StarRating value={rating} size={18} />
            <span style={{ fontSize: 14, color: "#888" }}>
              {total > 0 ? `${rating} out of 5 (${total} review${total !== 1 ? "s" : ""})` : "No reviews yet"}
            </span>
          </div>

          <h2 style={{ color: "#088178" }}>₹{product.price}</h2>
          <p style={{ fontSize: 13, color: "#666", margin: "6px 0 10px" }}>
            Inclusive of all taxes &nbsp;|&nbsp; Free shipping on orders above ₹999
          </p>

          {/* Stock status */}
          {outOfStock ? (
            <p className="stock-status out"><i className="fas fa-times-circle"></i> Out of Stock</p>
          ) : lowStock ? (
            <p className="stock-status low"><i className="fas fa-exclamation-triangle"></i> Only {stock} left in stock — order soon!</p>
          ) : (
            <p className="stock-status in"><i className="fas fa-check-circle"></i> In Stock</p>
          )}

          <h5 style={{ marginBottom: 8, fontWeight: 700, marginTop: 14 }}>Select Size:</h5>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(s)} disabled={outOfStock} style={{
                padding: "8px 16px",
                border: `2px solid ${size === s ? "#088178" : "#ddd"}`,
                background: size === s ? "#088178" : "#fff",
                color: size === s ? "#fff" : "#333",
                borderRadius: 4, fontWeight: 700, cursor: outOfStock ? "not-allowed" : "pointer", transition: "0.2s",
                opacity: outOfStock ? 0.5 : 1,
              }}>{s}</button>
            ))}
          </div>

          <h5 style={{ marginBottom: 8, fontWeight: 700 }}>Quantity:</h5>
          <div className="qty-control" style={{ justifyContent: "flex-start", marginBottom: 20, opacity: outOfStock ? 0.5 : 1 }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={outOfStock}>−</button>
            <input type="number" value={qty} min="1" max={stock} disabled={outOfStock}
              onChange={(e) => setQty(Math.max(1, Math.min(stock || 1, Number(e.target.value))))} />
            <button onClick={() => setQty(Math.min(stock || 1, qty + 1))} disabled={outOfStock}>+</button>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="normal" onClick={handleAddToCart} disabled={outOfStock}
              style={{
                background: outOfStock ? "#ccc" : added ? "#088178" : "#222",
                color: "#fff", padding: "14px 28px", borderRadius: 4, fontWeight: 700, fontSize: 14,
                cursor: outOfStock ? "not-allowed" : "pointer",
              }}>
              {outOfStock ? "Out of Stock" : added ? "✓ Added to Cart!" : "Add To Cart"}
            </button>
            <button className="normal" onClick={() => navigate("/cart")}
              style={{ background: "#088178", color: "#fff", padding: "14px 28px", borderRadius: 4, fontWeight: 700, fontSize: 14 }}>
              View Cart
            </button>
          </div>

          <div style={{ marginTop: 24, padding: "16px 0", borderTop: "1px solid #eee" }}>
            <h5 style={{ marginBottom: 8 }}>Product Details</h5>
            <ul style={{ paddingLeft: 16, fontSize: 13, color: "#666", lineHeight: 2 }}>
              <li>Material: 100% Cotton</li>
              <li>Care: Machine wash cold</li>
              <li>Fit: Regular fit</li>
              <li>Origin: Made in India</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-p1" style={{ maxWidth: 900, margin: "0 auto" }}>
        <ReviewSection productId={product.id} />
      </section>

      {related.length > 0 && (
        <section id="product1" className="section-p1">
          <h2>Related Products</h2>
          <p>You may also like</p>
          <div className="pro-container">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

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

export default SingleProduct;
