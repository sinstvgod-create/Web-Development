import React, { useState } from "react";
import { Link } from "react-router-dom";

function Landing() {
  const [activeBlog, setActiveBlog] = useState(null);
  
  // NEW FEATURE: Interactive Landing Page BMI Calculator State
  const [calcHeight, setCalcHeight] = useState("");
  const [calcWeight, setCalcWeight] = useState("");
  const [landingBmi, setLandingBmi] = useState(null);

  // NEW FEATURE: FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const calculateLandingBmi = (e) => {
    e.preventDefault();
    if (calcHeight && calcWeight) {
      const hM = Number(calcHeight) / 100;
      const wKg = Number(calcWeight);
      if (hM > 0) {
        const val = (wKg / (hM * hM)).toFixed(1);
        setLandingBmi(val);
      }
    }
  };

  const articles = [
    {
      id: 1,
      title: "The Science of Progressive Overload",
      category: "Training",
      readTime: "4 min read",
      excerpt: "Learn how manipulating volume and intensity triggers continuous hypertrophy without hitting plateaus.",
      content: "Progressive overload is the gradual increase of stress placed upon the body during resistance training. Consistently challenging your muscles forces them to adapt by growing stronger and denser."
    },
    {
      id: 2,
      title: "Macronutrient Timing for Athletes",
      category: "Nutrition",
      readTime: "5 min read",
      excerpt: "Discover how distributing your protein and carb intake optimizes recovery and muscle protein synthesis.",
      content: "Spreading your protein intake into balanced meals spaced 3 to 4 hours apart maximizes daily muscle protein synthesis rates much better than consuming massive isolated meals."
    },
    {
      id: 3,
      title: "Recovery Science: The Power of Sleep",
      category: "Recovery",
      readTime: "3 min read",
      excerpt: "Your muscles grow when you rest. Explore how deep sleep cycles drive growth hormone production.",
      content: "During slow-wave sleep, blood supply to muscles increases significantly, delivering vital oxygen and nutrients while growth hormones repair micro-tears from heavy lifting."
    }
  ];

  const faqs = [
    {
      q: "What is progressive overload?",
      a: "Progressive overload is the systematic increase of weight, reps, or volume over time to continually challenge muscle fibers and stimulate growth."
    },
    {
      q: "How does OverloadFit generate my diet plan?",
      a: "Our algorithm calculates your Total Daily Energy Expenditure (TDEE) based on your height, weight, age, and activity level, then divides your macros according to your physique goal."
    },
    {
      q: "Can I use OverloadFit at home or just in a gym?",
      a: "OverloadFit supports full gym setups, dumbbell-only routines, and bodyweight home workouts tailored directly to your available equipment."
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <Link className="logo" to="/">
          OVERLOAD<span>FIT</span>
        </Link>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#about">About Us</a>
          <a href="#courses">Courses</a>
          <a href="#schedule">Schedule</a>
          <a href="#bmi-tool">BMI Tool</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact Us</a>
        </div>

        <div className="nav-actions">
          <Link className="login-btn" to="/login">
            Login
          </Link>
          <Link className="signup-btn" to="/register">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              FITNESS FOR ATHLETIC STRENGTH
            </div>

            <h1>
              OverloadFit
              <br />
              <span>FOR ULTIMATE PERFORMANCE</span>
            </h1>

            <p>
              We Offer Hardcore Strength Machines, Curve Treadmills, Boxing
              Studio, TRX, And Progressive Overload Training Tools.
            </p>

            <div className="hero-buttons">
              <Link className="primary-btn" to="/register">
                Join Now!
              </Link>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="features-section" id="about">
          <div className="features-grid">
            <div className="about-images-grid">
              <div className="about-image-box"></div>
              <div className="about-image-box"></div>
            </div>

            <div className="about-text-content">
              <h3>About Us</h3>
              <h2>The Ultimate Gym Platform</h2>
              <p>
                OverloadFit is engineered for serious lifters and athletes looking to track their progressive overload, manage their daily macros, and maximize their physical output.
              </p>
              <p>
                Quisque consectetur ligula eu urna dignissim, nec mollis ipsum aliquam. Aliquam non est a ipsum facilisis scelerisque eu sed lectus.
              </p>
              <Link className="primary-btn" to="/register" style={{ marginTop: "20px" }}>
                Read More
              </Link>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="goals-section" id="courses">
          <div className="section-heading">
            <span className="section-label">Our Courses</span>
            <h2>
              We Aim to Transform
              <span> Your Abilities</span>
            </h2>
          </div>

          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-overlay">
                <span>01</span>
                <h3>STRENGTH</h3>
                <p>Build hardcore muscle and power with progressive tracking.</p>
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-overlay">
                <span>02</span>
                <h3>CARDIO</h3>
                <p>Enhance endurance with spinning and high-intensity treadmills.</p>
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-overlay">
                <span>03</span>
                <h3>BOXING</h3>
                <p>Condition your body with professional studio training routines.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="features-section" id="schedule" style={{ background: "#0a0a0a", padding: "80px 5%" }}>
          <div className="section-heading" style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="section-label">Weekly Routine</span>
            <h2>Training <span>Schedule</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            {[
              { day: "Monday", focus: "Chest & Triceps", time: "07:00 AM - 09:00 AM" },
              { day: "Tuesday", focus: "Back & Biceps", time: "07:00 AM - 09:00 AM" },
              { day: "Wednesday", focus: "Active Recovery / Rest", time: "Flexible" },
              { day: "Thursday", focus: "Legs & Core", time: "07:00 AM - 09:00 AM" },
              { day: "Friday", focus: "Shoulders & Arms", time: "07:00 AM - 09:00 AM" },
              { day: "Saturday", focus: "Full Body Conditioning", time: "08:00 AM - 10:00 AM" }
            ].map((sched, idx) => (
              <div key={idx} style={{ background: "#141414", border: "1px solid var(--border)", padding: "20px", borderRadius: "8px" }}>
                <span className="section-label" style={{ color: "var(--orange)" }}>{sched.day.toUpperCase()}</span>
                <h3 style={{ color: "#fff", fontSize: "16px", margin: "8px 0" }}>{sched.focus}</h3>
                <p style={{ color: "var(--gray)", fontSize: "12px" }}>{sched.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NEW FEATURE: INTERACTIVE BMI CALCULATOR WIDGET ON LANDING */}
        <section className="goals-section" id="bmi-tool" style={{ padding: "80px 5%", background: "var(--black-light)" }}>
          <div className="section-heading" style={{ textAlign: "center", marginBottom: "30px" }}>
            <span className="section-label">Interactive Tool</span>
            <h2>Check Your <span>BMI Instantly</span></h2>
          </div>
          <div style={{ maxWidth: "600px", margin: "0 auto", background: "var(--card)", border: "1px solid var(--border)", padding: "30px", borderRadius: "8px" }}>
            <form onSubmit={calculateLandingBmi} style={{ display: "grid", gap: "15px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>HEIGHT (CM)</label>
                  <input
                    type="number"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(e.target.value)}
                    placeholder="e.g. 175"
                    required
                    style={{ width: "100%", padding: "10px", background: "#111", border: "1px solid var(--border)", color: "#fff", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>WEIGHT (KG)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    placeholder="e.g. 70"
                    required
                    style={{ width: "100%", padding: "10px", background: "#111", border: "1px solid var(--border)", color: "#fff", borderRadius: "4px" }}
                  />
                </div>
              </div>
              <button type="submit" className="primary-btn" style={{ width: "100%", minHeight: "42px" }}>Calculate BMI</button>
            </form>
            {landingBmi && (
              <div style={{ marginTop: "20px", padding: "15px", background: "rgba(255, 94, 20, 0.1)", border: "1px solid var(--orange)", borderRadius: "6px", textAlign: "center" }}>
                <span style={{ fontSize: "10px", color: "var(--orange)", fontWeight: "700", display: "block" }}>YOUR RESULT</span>
                <strong style={{ fontSize: "24px", fontFamily: "Poppins, sans-serif" }}>BMI: {landingBmi}</strong>
              </div>
            )}
          </div>
        </section>

        {/* Blog Section */}
        <section className="goals-section" id="blog" style={{ padding: "80px 5%" }}>
          <div className="section-heading">
            <span className="section-label">Expert Insights</span>
            <h2>Fitness <span>Blog & Articles</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            {articles.map((art) => (
              <div key={art.id} style={{ background: "#141414", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span className="section-label" style={{ color: "var(--orange)" }}>{art.category}</span>
                    <span style={{ fontSize: "10px", color: "var(--gray)" }}>{art.readTime}</span>
                  </div>
                  <h3 style={{ color: "#fff", fontSize: "18px", marginBottom: "10px" }}>{art.title}</h3>
                  <p style={{ color: "var(--gray)", fontSize: "12px", lineHeight: "1.5", marginBottom: "15px" }}>{art.excerpt}</p>
                  {activeBlog === art.id && (
                    <p style={{ color: "#ddd", fontSize: "12px", background: "#1e1e1e", padding: "10px", borderRadius: "4px", marginBottom: "15px", borderLeft: "2px solid var(--orange)" }}>
                      {art.content}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBlog(activeBlog === art.id ? null : art.id)}
                  className="secondary-btn"
                  style={{ padding: "8px 16px", fontSize: "11px", minHeight: "36px", width: "100%" }}
                >
                  {activeBlog === art.id ? "Hide Details" : "Read Article"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* NEW FEATURE: FAQ ACCORDION SECTION */}
        <section className="features-section" style={{ background: "#050505", padding: "80px 5%" }}>
          <div className="section-heading" style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="section-label">Got Questions?</span>
            <h2>Frequently Asked <span>Questions</span></h2>
          </div>
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "15px" }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ background: "#111", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: "100%", padding: "18px 20px", background: "transparent", border: "none", color: "#fff", textAlign: "left", fontSize: "14px", fontWeight: "600", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                >
                  <span>{faq.q}</span>
                  <i className={`bi ${openFaq === idx ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ color: "var(--orange)" }}></i>
                </button>
                {openFaq === idx && (
                  <div style={{ padding: "0 20px 20px 20px", color: "var(--gray)", fontSize: "12px", lineHeight: "1.6" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Call To Action */}
        <section className="cta-section" id="contact">
          <div className="cta-content">
            <span className="section-label">Start Your Training</span>
            <h2>
              Ready to
              <span> Transform?</span>
            </h2>
            <p>
              Sign up today and experience the ultimate gym training and tracking platform.
            </p>
            <Link className="primary-btn" to="/register">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          OVERLOAD<span>FIT</span>
        </div>
        <p>Track. Progress. Grow Stronger.</p>
        <span>© 2026 OverloadFit. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Landing;