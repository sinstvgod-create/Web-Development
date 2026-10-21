import React from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="dashboard-sidebar">
      {/* Logo */}
      <Link to="/dashboard" className="dashboard-logo">
        GYM<span>FIT</span>
      </Link>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <Link
          to="/dashboard"
          className={
            isActive("/dashboard")
              ? "dashboard-nav-item active"
              : "dashboard-nav-item"
          }
        >
          <span>⌂</span>
          Dashboard
        </Link>

        <Link
          to="/workout/log"
          className={
            isActive("/workout/log") || isActive("/workout")
              ? "dashboard-nav-item active"
              : "dashboard-nav-item"
          }
        >
          <span>⚡</span>
          Workout
        </Link>

        <Link
          to="/diet"
          className={
            isActive("/diet")
              ? "dashboard-nav-item active"
              : "dashboard-nav-item"
          }
        >
          <span>◉</span>
          Nutrition
        </Link>

        <Link
          to="/progress"
          className={
            isActive("/progress")
              ? "dashboard-nav-item active"
              : "dashboard-nav-item"
          }
        >
          <span>↗</span>
          Progress
        </Link>

        <Link
          to="/profile"
          className={
            isActive("/profile")
              ? "dashboard-nav-item active"
              : "dashboard-nav-item"
          }
        >
          <span>○</span>
          Profile
        </Link>
      </nav>

      {/* User Section */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "M"}
          </div>

          <div>
            <strong>
              {user?.name || "Member"}
            </strong>

            <span>
              GymFit User
            </span>
          </div>
        </div>

        <button
          className="logout-link"
          onClick={handleLogout}
        >
          ← Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;