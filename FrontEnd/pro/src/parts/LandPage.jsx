import React from "react";
import Nav from "./Nav";
import '../partcss/LandPage.css';
import landimg from '../../landimg.png'

function LandPage() {
  return (
    <>
      <Nav />
      <section className="hero">
      <div className="hero-content">
          <h1>Take Control of your financial Future.</h1>
          <p>
            Track, manage, and optimize your finance with our comprehensive
            platform. Perfect for both personal and business use.
          </p>
          <div className="hero-buttons">
            <button className="get-started">Get Started</button>
            <button className="watch-demo">Watch Demo</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={landimg} alt="Dashboard" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Everything you need to manage finance</h2>
        <div className="feature-items">
          <div className="feature-item">
            <h3>Financial Tracking</h3>
            <p>Track your daily, weekly, monthly finance with detailed insights and analytics.</p>
          </div>
          <div className="feature-item">
            <h3>Financial Tracking</h3>
            <p>Track your daily, weekly, monthly finance with detailed insights and analytics.</p>
          </div>
          <div className="feature-item">
            <h3>Financial Tracking</h3>
            <p>Track your daily, weekly, monthly finance with detailed insights and analytics.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default LandPage;
