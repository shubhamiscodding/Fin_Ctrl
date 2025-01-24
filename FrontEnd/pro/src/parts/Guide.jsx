import Nav from "./Nav";
import '../partcss/Guide.css'
import img1 from '../../computer.png'
import image1 from '../../image1.png';
import image2 from '../../image2.png';
import image3 from '../../image3.png';
import image0 from '../../image0.png';
function Guide(){
    return (
<>
        <Nav />
        <div className="landing-page">
      {/* Header Section */}
      <header className="header">
        <div className="hero">
          <div className="hero-text">
            <h1>Track Your Finances Effortlessly</h1>
            <p>Manage your finances with ease using our comprehensive platform.</p>
            <div className="hero-buttons">
              <button className="get-started">Get Started</button>
              <button className="learn-more">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <img src={img1} alt="Financial Illustration" />
          </div>
        </div>
      </header>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2>Why Choose Us?</h2>
        <ul className="features-list">
          <li>Easy-to-use tools for tracking expenses.</li>
          <li>Real-time financial insights.</li>
          <li>Secure and reliable platform.</li> 
          <li>Customizable reports and analytics.</li>
          <li>Customizable reports and analytics.</li>
          <li>Customizable reports and analytics.</li>
        </ul>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="work-steps">
          <div className="step">
            <img src={image1} alt="Step 1" />
            <h3>Step 1:Create Your Account</h3>
            <p>Sign up and get started within minutes.</p>
          </div>
          <div className="step">
            <img src={image2} alt="Step 2" />
            <h3>Step 2:Set Your Budget</h3>
            <p>Define your goals and allocate your funds smartly.</p>
          </div>
          <div className="step">
            <img src={image3} alt="Step 3" />
            <h3>Step 3:Track Your Progress</h3>
            <p>Stay on top of your finances with detailed reports.</p>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="join-us">
        <h2>Join the Financial Revolution</h2>
        <button className="join-button">Get Started Today</button>
      </section>

      {/* Contact Us Section */}
      <section className="contact-us">
        <div className="contact-container">
          <div className="contact-image">
            <img src={image0} alt="Mobile App" />
          </div>
          <form className="contact-form">
            <h2>Contact Us</h2>
            <label htmlFor="Name">Nmae:</label>
            <input type="text" placeholder="Name" />
            <label htmlFor="Email">Email:</label>
            <input type="email" placeholder="Email" />
            <label htmlFor="Message">Message:</label>
            <textarea placeholder="Message"></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 FinancePro. All rights reserved.</p>
        <ul className="footer-links">
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>Contact</li>
        </ul>
      </footer>
    </div>
</>
    )
}
export default Guide;