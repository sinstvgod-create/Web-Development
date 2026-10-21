import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const response = await login(formData);

      if (response.success) {
        navigate("/dashboard");
      } else {
        // Explicitly check or default to wrong password/email message
        setError("Password or email is wrong");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Password or email is wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-visual">

        <Link to="/" className="auth-brand">
          OVERLOAD<span>FIT</span>
        </Link>

        <div className="auth-visual-content">

          <span className="section-label">
            WELCOME BACK
          </span>

          <h1>
            TRAIN
            <br />
            <span>SMARTER.</span>
          </h1>

          <p>
            Continue your fitness journey, track your
            performance and keep progressing toward your goal.
          </p>

        </div>

        <div className="auth-quote">
          <span>"</span>
          Progress is built one workout at a time.
        </div>

      </div>

      <div className="auth-form-section">

        <div className="auth-form-container">

          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>

          <div className="auth-heading">

            <span className="section-label">
              ACCOUNT LOGIN
            </span>

            <h2>
              Welcome <span>Back.</span>
            </h2>

            <p>
              Sign in with your email and password to continue your training journey.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="password">
                PASSWORD
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
                <i className="bi bi-exclamation-circle"></i> {" "}
                {error}
              </p>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              <span>
                {loading ? "LOGGING IN..." : "LOGIN"}
              </span>

              {!loading && (
                <span>
                  →
                </span>
              )}
            </button>

          </form>

          <div className="auth-divider">
            OR
          </div>

          <div className="auth-switch">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create one
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;