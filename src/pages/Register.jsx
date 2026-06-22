import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]   = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = ["", "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#088178"];
  const s = strength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 6)       return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
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
        <h2>Create Account</h2>
        <p>Join TN91 and shop the best menswear</p>
      </section>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">TN<span>91</span></div>
          <h2 className="auth-title">Sign Up</h2>
          <p className="auth-sub">Already have an account? <Link to="/login">Login</Link></p>

          {error && <div className="auth-error"><i className="fal fa-exclamation-circle"></i> {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <i className="fal fa-user"></i>
                <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
            </div>

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
                <input type={showPw ? "text" : "password"} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                <i className={`fal ${showPw ? "fa-eye-slash" : "fa-eye"} pw-toggle`} onClick={() => setShowPw(!showPw)}></i>
              </div>
              {form.password && (
                <div className="pw-strength">
                  <div className="pw-bar">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i <= s ? strengthColor[s] : "#eee", marginRight:3, transition:"0.3s" }}></div>
                    ))}
                  </div>
                  <span style={{ color: strengthColor[s], fontSize:12 }}>{strengthLabel[s]}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <i className="fal fa-lock"></i>
                <input type={showPw ? "text" : "password"} name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 16 }}>
            By registering you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>
          </p>
        </div>

        <div className="auth-side">
          <h2>Join TN91 Family</h2>
          <p>Create your free account and enjoy these benefits:</p>
          <ul>
            <li><i className="fas fa-check-circle"></i> Faster checkout</li>
            <li><i className="fas fa-check-circle"></i> Order history &amp; tracking</li>
            <li><i className="fas fa-check-circle"></i> Write product reviews</li>
            <li><i className="fas fa-check-circle"></i> Exclusive member offers</li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;
