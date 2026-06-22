import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="section-p1">
    <div className="col">
      <span className="brand-name footer-brand">TN<span style={{color:"#e63946"}}>91</span></span>
      <h4>Contact</h4>
      <p><strong>Address:</strong> South Main Road, Sethiyathope</p>
      <p><strong>Phone:</strong> <a href="tel:9865006742">+91 9865006742</a></p>
      <p><strong>Hours:</strong> 9 AM – 10 PM, Mon – Sat</p>
      <div className="follow">
        <h4>Follow us</h4>
        <div className="icon">
          <a href="https://www.facebook.com/tn91menswear" target="_blank" rel="noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>

    <div className="col">
      <h4>About</h4>
      <a href="#">About us</a>
      <a href="#">Delivery information</a>
      <a href="#">Privacy policy</a>
      <a href="#">Terms and conditions</a>
      <Link to="/contact">Contact us</Link>
    </div>

    <div className="col">
      <h4>My Account</h4>
      <a href="#">Sign in</a>
      <Link to="/cart">View Cart</Link>
      <a href="#">My Wishlist</a>
      <a href="#">Track My Order</a>
      <a href="#">Help</a>
    </div>

    <div className="col install">
      <h4>Install App</h4>
      <p>From App Store or Google Play</p>
      <div className="row">
        <img src="/products/app.jpg" alt="App Store" />
        <img src="/products/play.jpg" alt="Google Play" />
      </div>
      <p>Secured Payment Gateways</p>
      <img src="/products/pay.png" alt="Payment Methods" />
    </div>

    <div className="copyright">
      <p>© TN91 SILKS &amp; READYMADES 2025</p>
    </div>
  </footer>
);

export default Footer;
