import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const [user] = useState({
    id: "1",
    name: "Kavin Admin",
    role: "ADMIN",
    email: "kavin@college.edu",
  });

  const handleLogout = () => {
    alert("Logged out successfully");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo-section">
          <Link to="/" className="header-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">CampusConnect</span>
          </Link>
          <p className="logo-subtitle">Event Management System</p>
        </div>

        {/* Navigation Menu */}
        <nav className="header-nav">
          <div className="nav-group">
            <span className="nav-label">Governance</span>
            <Link to="/governance/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/governance/club-onboarding" className="nav-link">
              Club Onboarding
            </Link>
            <Link to="/governance/event-approval" className="nav-link">
              Event Approval
            </Link>
            <Link to="/governance/president-applications" className="nav-link">
              President Apps
            </Link>
          </div>

          <div className="nav-group">
            <span className="nav-label">Logistics</span>
            <Link to="/logistics/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/logistics/assets" className="nav-link">
              Assets
            </Link>
            <Link to="/logistics/requests" className="nav-link">
              Requests
            </Link>
            <Link to="/logistics/availability" className="nav-link">
              Availability
            </Link>
            <Link to="/logistics/checkout" className="nav-link">
              Checkout
            </Link>
          </div>
        </nav>

        {/* User Menu */}
        <div className="header-user-section">
          <div
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
            <span className="dropdown-icon">▼</span>
          </div>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-email">{user.email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={() => handleNavigation("/profile")}
              >
                👤 My Profile
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleNavigation("/admin-dashboard")}
              >
                ⚙️ Admin Dashboard
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
