import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

const features = [
  { img: "products/f1.png", text: "Free Shipping", bg: "#fddde4" },
  { img: "products/f2.png", text: "Online Order",  bg: "#cdebbc" },
  { img: "products/f3.png", text: "Save Money",    bg: "#d1e8f2" },
  { img: "products/f4.png", text: "Promotions",    bg: "#cdd4f8" },
  { img: "products/f5.png", text: "Happy Sell",    bg: "#f6dbf6" },
  { img: "products/f6.png", text: "24/7 Support",  bg: "#fff2e5" },
];

const Home = () => {
  const navigate = useNavigate();
  const featured = products.filter((p) => p.category === "featured");
  const newArr   = products.filter((p) => p.category === "new");

  return (
    <>
      <Navbar />

      <section id="hero">
        <h4>Trade-in-offer</h4>
        <h2>Super Value Deals</h2>
        <h1>On All Products</h1>
        <p>Save more with coupons &amp; up to 70% off!</p>
        <button onClick={() => navigate("/shop")}>Shop Now</button>
      </section>

      <section id="feature" className="section-p1">
        {features.map((item, i) => (
          <div className="box" key={i}>
            <img src={item.img} alt={item.text} />
            <h6 style={{ backgroundColor: item.bg }}>{item.text}</h6>
          </div>
        ))}
      </section>

      <section id="product1" className="section-p1">
        <h2>Featured Products</h2>
        <p>Summer Collection — New Modern Design</p>
        <div className="pro-container">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section id="banner" className="section-m1">
        <h4>Repair Services</h4>
        <h2>Up to <span>70% Off</span> All T-Shirts</h2>
        <button className="normal" onClick={() => navigate("/shop")}>Explore More</button>
      </section>

      <section id="product1" className="section-p1">
        <h2>New Arrivals</h2>
        <p>Summer Collection — New Modern Design</p>
        <div className="pro-container">
          {newArr.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section id="sm-banner" className="section-p1">
        <div className="banner-box">
          <h4>crazy deals</h4><h2>buy 1 get 1 free</h2>
          <span>The best classic dress is on sale at TN91</span>
          <button className="white" onClick={() => navigate("/shop")}>Learn more</button>
        </div>
        <div className="banner-box banner-box2">
          <h4>spring/summer</h4><h2>upcoming season</h2>
          <span>The best classic dress is on sale at TN91</span>
          <button className="white" onClick={() => navigate("/shop")}>Collection</button>
        </div>
      </section>

      <section id="banner3">
        <div className="banner-box"><h2>SEASONAL SALE</h2><h3>Winter Collection –50% OFF</h3></div>
        <div className="banner-box banner-box2"><h2>MENS COLLECTION</h2><h3>Winter Offer –25%</h3></div>
        <div className="banner-box banner-box3"><h2>T-SHIRTS</h2><h3>New Trendy Prints</h3></div>
      </section>

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

export default Home;
