import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { useProductRating } from "../hooks/useProductRatings";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLikes } from "../context/LikesContext";
import { useStock } from "../context/StockContext";
import { useToast } from "../context/ToastContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const { getStock } = useStock();
  const { showToast } = useToast();
  const { rating, total } = useProductRating(product.id);
  const liked = isLiked(product.id);

  const stock = getStock(product.id, product.stock ?? 99);
  const outOfStock = stock <= 0;
  const lowStock   = stock > 0 && stock <= 10;

  const handleCart = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart({ id: product.id, name: product.name, price: product.price, image: `/products/${product.img}`, brand: product.brand, size: "M", qty: 1 });
    showToast?.(`${product.name} added to cart`, "success");
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    toggleLike(product.id);
    showToast?.(liked ? "Removed from wishlist" : "Added to wishlist", liked ? "info" : "success");
  };

  return (
    <div className="pro" onClick={() => navigate(`/product/${product.id}`)}>
      {/* Wishlist button top-right */}
      <button className="like-btn" onClick={handleLike} title={liked ? "Remove from wishlist" : "Add to wishlist"}>
        <i className={liked ? "fas fa-heart" : "far fa-heart"}></i>
      </button>

      {/* Stock badge top-left */}
      {outOfStock && <span className="stock-badge out">Out of Stock</span>}
      {lowStock && !outOfStock && <span className="stock-badge low">Only {stock} left!</span>}

      <img src={`/products/${product.img}`} alt={product.name} style={outOfStock ? { opacity: 0.5 } : undefined} />

      <div className="des">
        <span>{product.brand}</span>
        <h5>{product.name}</h5>

        {/* Clickable star rating */}
        <div className="pro-star-row">
          <StarRating value={rating} size={13} />
          <span className="pro-review-count">
            {total > 0 ? `(${total})` : ""}
          </span>
        </div>
        <h4>₹{product.price}</h4>

        {/* Live stock quantity */}
        <p className={`pro-stock ${outOfStock ? "out" : lowStock ? "low" : "in"}`}>
          <i className={`fas ${outOfStock ? "fa-times-circle" : "fa-box"}`}></i>
          {outOfStock ? "Out of stock" : lowStock ? `Only ${stock} left in stock` : `In stock: ${stock}`}
        </p>
      </div>

      {/* Shop / Add to Cart button — bottom, rectangular */}
      <button className={`pro-shop-btn ${outOfStock ? "disabled" : ""}`} onClick={handleCart} disabled={outOfStock}>
        <i className={outOfStock ? "fal fa-ban" : "fal fa-shopping-cart"}></i>
        <span>{outOfStock ? "Out of Stock" : "Add to Cart"}</span>
      </button>
    </div>
  );
};

export default ProductCard;
