import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section id="page-header" style={{ height: 200 }}>
        <h2>Welcome Back</h2>
        <p>Login to your TN91 account</p>
      </section>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">TN<span>91</span></div>
          <h2 className="auth-title">Login</h2>
          <p className="auth-sub">Don't have an account? <Link to="/register">Sign Up</Link></p>

          {error && <div className="auth-error"><i className="fal fa-exclamation-circle"></i> {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <i className="fal fa-envelope"></i>
                <input type="email" name="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <i className="fal fa-lock"></i>
                <input type={showPw ? "text" : "password"} name="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
                <i className={`fal ${showPw ? "fa-eye-slash" : "fa-eye"} pw-toggle`} onClick={() => setShowPw(!showPw)}></i>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Login →"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#888" }}>
            By logging in you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>
          </p>
        </div>

        <div className="auth-side">
          <h2>Shop Premium Menswear</h2>
          <p>Get exclusive deals, track orders, and save your favourites — all in one account.</p>
          <ul>
            <li><i className="fas fa-check-circle"></i> Secure &amp; fast checkout</li>
            <li><i className="fas fa-check-circle"></i> Order tracking</li>
            <li><i className="fas fa-check-circle"></i> Exclusive coupons</li>
            <li><i className="fas fa-check-circle"></i> Save your wishlist</li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
