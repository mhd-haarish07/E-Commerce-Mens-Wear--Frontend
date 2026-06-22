import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

const ReviewSection = ({ productId }) => {
  const { user, token }         = useAuth();
  const navigate                = useNavigate();
  const [reviews, setReviews]   = useState([]);
  const [avgRating, setAvg]     = useState(0);
  const [total, setTotal]       = useState(0);
  const [form, setForm]         = useState({ rating: 0, comment: "" });
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  const fetchReviews = () => {
    fetch(`${API}/reviews/${productId}`)
      .then(r => r.json())
      .then(d => {
        setReviews(d.reviews || []);
        setAvg(d.avgRating || 0);
        setTotal(d.total || 0);
      })
      .catch(() => {});
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating)         return setError("Please click a star to set your rating");
    if (!form.comment.trim()) return setError("Please write a review comment");
    setError(""); setLoading(true);
    try {
      const r = await fetch(`${API}/reviews/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setSuccess("✓ Review submitted! Thank you.");
      setForm({ rating: 0, comment: "" });
      fetchReviews();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await fetch(`${API}/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  const ratingBars = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct:   total ? Math.round(reviews.filter(r => r.rating === star).length / total * 100) : 0,
  }));

  return (
    <div className="review-section">
      <h2>Customer Reviews</h2>

      {/* Summary */}
      <div className="review-summary">
        <div className="review-avg-box">
          <span className="review-avg-num">{total > 0 ? avgRating : "—"}</span>
          <StarRating value={Math.round(avgRating * 2) / 2} size={22} />
          <p>{total} review{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="review-bars">
          {ratingBars.map(({ star, count, pct }) => (
            <div key={star} className="review-bar-row">
              <span style={{ minWidth: 20 }}>{star} <i className="fas fa-star" style={{ color: "#f3b519", fontSize: 11 }}></i></span>
              <div className="review-bar-bg">
                <div className="review-bar-fill" style={{ width: `${pct}%` }}></div>
              </div>
              <span style={{ minWidth: 16, textAlign: "right" }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write review */}
      <div className="write-review-box">
        <h4>Write a Review</h4>

        {!user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0" }}>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>You must be logged in to write a review.</p>
            <button
              className="normal"
              onClick={() => navigate("/login")}
              style={{ background: "#088178", color: "#fff", padding: "9px 20px", borderRadius: 4, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}
            >
              Login to Review
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            {error   && <p className="rev-error">⚠ {error}</p>}
            {success && <p className="rev-success">{success}</p>}

            {/* Interactive stars — click to rate */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 10, color: "#333" }}>
                Your Rating <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 6 }} onMouseLeave={() => setHoverStar(0)}>
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={(hoverStar || form.rating) >= star ? "fas fa-star" : "far fa-star"}
                    style={{
                      fontSize: 30,
                      color: (hoverStar || form.rating) >= star ? "#f3b519" : "#ddd",
                      cursor: "pointer",
                      transition: "color 0.1s, transform 0.1s",
                      transform: hoverStar === star ? "scale(1.25)" : "scale(1)",
                    }}
                    onMouseEnter={() => setHoverStar(star)}
                    onClick={() => {
                      setForm(prev => ({ ...prev, rating: star }));
                      setError("");
                    }}
                  />
                ))}
                {form.rating > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 13, color: "#888", alignSelf: "center" }}>
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]}
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 8, color: "#333" }}>
                Your Review <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Share your experience — quality, fit, comfort..."
                value={form.comment}
                onChange={e => { setForm(prev => ({ ...prev, comment: e.target.value })); setError(""); }}
                style={{
                  width: "100%", padding: "12px 14px",
                  border: "1.5px solid #ddd", borderRadius: 8,
                  fontSize: 14, resize: "vertical", outline: "none",
                  fontFamily: "inherit", lineHeight: 1.6,
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#088178"}
                onBlur={e => e.target.style.borderColor = "#ddd"}
              />
              <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{form.comment.length} characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#aaa" : "#088178",
                color: "#fff", padding: "12px 28px",
                border: "none", borderRadius: 6,
                fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
                transition: "0.2s",
              }}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {/* Review list */}
      <div className="review-list">
        <h4 style={{ marginBottom: 16, color: "#333" }}>{total} Review{total !== 1 ? "s" : ""}</h4>
        {reviews.length === 0 ? (
          <p style={{ color: "#999", fontSize: 14, padding: "20px 0" }}>
            No reviews yet. {user ? "Be the first to review!" : <Link to="/login" style={{ color: "#088178" }}>Login to review</Link>}
          </p>
        ) : reviews.map(r => (
          <div key={r._id} className="review-card">
            <div className="review-card-header">
              <div className="rev-avatar">{r.userName?.[0]?.toUpperCase() || "U"}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{r.userName || "Anonymous"}</p>
                <StarRating value={r.rating} size={14} />
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, color: "#aaa" }}>{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                {(user?._id === r.user || user?.role === "admin") && (
                  <button
                    onClick={() => deleteReview(r._id)}
                    style={{ fontSize: 11, color: "#e74c3c", background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginTop: 4 }}
                  >
                    <i className="fal fa-trash-alt"></i> Delete
                  </button>
                )}
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#555", marginTop: 12, lineHeight: 1.7 }}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
