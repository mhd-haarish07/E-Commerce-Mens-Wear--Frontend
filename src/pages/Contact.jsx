import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => (
  <>
    <Navbar />

    <section id="page-header">
      <h2>#LET&apos;S TALK</h2>
      <p>Leave a message — we love to hear from you</p>
    </section>

    <section id="contact-details" className="section-p1">
      <div className="details">
        <span>GET IN TOUCH</span>
        <h2>Visit our store or contact us today</h2>
        <h3>Head Office</h3>
        <div>
          <li><i className="fal fa-map"></i><p>South Main Road, Sethiyathope, 608702</p></li>
          <li><i className="fal fa-envelope"></i><p>tn91@gmail.com</p></li>
          <li><i className="fal fa-phone-alt"></i><p><strong>Phone:</strong> <a href="tel:9865006742">+91 9865006742</a></p></li>
          <li><i className="fal fa-clock"></i><p>Monday to Saturday: 9:00 AM to 10:00 PM</p></li>
        </div>
      </div>

      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.631643078088!2d79.54163040000002!3d11.434259700000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54c98b7a1cf56d%3A0x31a4b1c71a26787e!2sTN%2091%20SILKS%20AND%20READYMADES!5e0!3m2!1sen!2sin!4v1755150981998!5m2!1sen!2sin"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="map"
        />
      </div>
    </section>

    <section id="form-details">
      <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! We'll get back to you shortly."); }}>
        <span>LEAVE A MESSAGE</span>
        <h2>We love to hear from you</h2>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="E-mail" required />
        <input type="text" placeholder="Subject" />
        <textarea cols="30" rows="10" placeholder="Your Message"></textarea>
        <button className="normal" type="submit">Send Message</button>
      </form>

      <div className="people">
        <div>
          <img src="products/md.jpg" alt="MD" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }} />
          <p>
            <span>S. HAKKIM</span><br />
            MD of TN91 Silks &amp; Readymades<br />
            Phone: 9865006742<br />
            Email: tn91@gmail.com
          </p>
        </div>
      </div>
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

export default Contact;
