import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        GYM<span>FIT</span>
      </Link>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="#about">About Us</a>
        <a href="#courses">Courses</a>
        <a href="#schedule">Schedule</a>
        <a href="#blog">Blog</a>
        <a href="#contact">Contact Us</a>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-btn">
          Login
        </Link>
        <Link to="/register" className="signup-btn">
          Join Now
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;