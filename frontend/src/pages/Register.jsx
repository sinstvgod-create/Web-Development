import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    address: "",
    experience: "beginner",
    physiqueGoal: "lean"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Save extra fields locally so they persist to profile if needed
      localStorage.setItem("overload_user_dob", formData.dob);
      localStorage.setItem("overload_user_phone", formData.phone);
      localStorage.setItem("overload_user_address", formData.address);
      localStorage.setItem("gymfit_physique_goal", formData.physiqueGoal);

      const response = await register(formData);

      if (response.success) {
        navigate("/assessment");
      } else {
        setError(
          response.message ||
          "Registration failed"
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <section className="auth-visual">

        <Link
          to="/"
          className="auth-brand"
        >
          OVERLOAD<span>FIT</span>
        </Link>

        <div className="auth-visual-content">

          <span className="section-label">
            START YOUR JOURNEY
          </span>

          <h1>
            Build Your
            <br />
            <span>Stronger</span>
            <br />
            Self.
          </h1>

          <p>
            Create your account and complete your
            fitness assessment. OverloadFit will
            use your information to build a
            personalized training experience.
          </p>

        </div>

        <div className="auth-quote">
          <span>"</span>
          Track. Progress. Grow Stronger.
        </div>

      </section>

      <section className="auth-form-section" style={{ padding: "40px 20px", overflowY: "auto", maxHeight: "100vh" }}>

        <div className="auth-form-container">

          <Link
            to="/"
            className="back-home"
          >
            ← BACK TO HOME
          </Link>

          <div className="auth-heading">

            <span className="section-label">
              CREATE ACCOUNT
            </span>

            <h2>
              Join <span>OverloadFit.</span>
            </h2>

            <p>
              Provide your details to start building
              your personalized fitness plan.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            style={{ marginTop: "25px" }}
          >

            <div className="form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="form-group">
                <label>DATE OF BIRTH</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>PHONE NUMBER</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>MAILING ADDRESS</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address / hostel room"
                required
              />
            </div>

            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="form-group">
                <label>EXPERIENCE LEVEL</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  style={{ width: "100%", height: "50px", padding: "0 15px", background: "var(--card)", border: "1px solid var(--border)", color: "var(--white)", borderRadius: "4px" }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>PRIMARY GOAL</label>
                <select
                  name="physiqueGoal"
                  value={formData.physiqueGoal}
                  onChange={handleChange}
                  style={{ width: "100%", height: "50px", padding: "0 15px", background: "var(--card)", border: "1px solid var(--border)", color: "var(--white)", borderRadius: "4px" }}
                >
                  <option value="lean">Lean</option>
                  <option value="bulk">Bulk</option>
                  <option value="athletic">Athletic</option>
                  <option value="toned">Toned</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
              />
            </div>

            {error && (
              <p
                style={{
                  color: "var(--red)",
                  fontSize: "11px",
                  marginBottom: "20px"
                }}
              >
                <i className="bi bi-exclamation-circle"></i>
                {" "}
                {error}
              </p>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </span>

              {!loading && (
                <span>
                  →
                </span>
              )}
            </button>

          </form>

          <div className="auth-divider">
            ACCOUNT
          </div>

          <div className="auth-switch">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Register;