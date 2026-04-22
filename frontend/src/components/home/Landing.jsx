import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ChatBot from "../common/ChatBot";
import { dashboardAPI, merchandiseAPI, resolveImageUrl } from "../../services/api";
import "./Landing.css";
import LogoutConfirmationModal from "../common/LogoutConfirmationModal";
import ThemeToggle from "../common/ThemeToggle";

// Footer Component
const Footer = ({ user }) => (
  <footer className="landing-footer">
    <div className="footer-container">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src="/logo/Nexora event logo design.png"
              alt="NEXORA"
              className="logo-image-footer"
            />
            <span>NEXORA</span>
          </div>
          <p className="footer-tagline">
            Connecting students through amazing events
          </p>
          <div className="social-links">
            <a href="#" className="social-icon">
              f
            </a>
            <a href="#" className="social-icon">
              𝕏
            </a>
            <a href="#" className="social-icon">
              in
            </a>
            <a href="#" className="social-icon">
              ig
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="#explore">Explore Events</a>
            </li>
            {(!user || (user && user.role && user.role.toUpperCase() !== "STUDENT")) && (
              <li>
                <Link to="/logistics">Logistics</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="#">Documentation</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Support</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Code of Conduct</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-divider"></div>
      <div className="footer-bottom">
        <p>&copy; 2026 NEXORA. All rights reserved.</p>
        <p>Built with ❤️ for campus events</p>
      </div>
    </div>
  </footer>
);

const Landing = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [merchandise, setMerchandise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [merchLoading, setMerchLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState({});
  const profileRef = useRef(null);

  const summarizeDescription = (value) => {
    const normalized = String(value || "")
      .replace(/\s+/g, " ")
      .trim();

    if (!normalized) return "Event details will be announced soon.";
    if (normalized.length <= 220) return normalized;
    return `${normalized.slice(0, 220)}...`;
  };

  // ── Register for event ──────────────────────────────────────
  const handleRegisterEvent = async (e, eventId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    setRegistrationLoading((prev) => ({ ...prev, [eventId]: true }));
    try {
      const response = await dashboardAPI.registerEvent(eventId);
      if (response.success) {
        await fetchEvents();
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setRegistrationLoading((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const handleUnregisterEvent = async (e, eventId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) return;

    setRegistrationLoading((prev) => ({ ...prev, [eventId]: true }));
    try {
      const response = await dashboardAPI.unregisterEvent(eventId);
      if (response.success) {
        await fetchEvents();
      }
    } catch (error) {
      console.error("Unregistration failed:", error);
    } finally {
      setRegistrationLoading((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  // ── Fetch events ────────────────────────────────────────────

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let data;
      let currentUser = null;
      
      const userDataStr = localStorage.getItem("user");
      if (userDataStr) {
        try {
          currentUser = JSON.parse(userDataStr);
        } catch {
          currentUser = null;
        }
      }

      // Students can use the dashboard feed for registration state.
      // Other roles should always use the public published feed.
      if (localStorage.getItem("token") && String(currentUser?.role || "").toUpperCase() === "STUDENT") {
        data = await dashboardAPI.getEvents({ filter: 'upcoming' });
      } else {
        const response = await fetch(`${dashboardAPI.getEvents.API_BASE_URL || "http://localhost:5000/api"}/events/published`);
        data = await response.json();
      }

      if (data.success) {
        const mapped = (data.events || []).map((event) => ({
          ...event,
          image: resolveImageUrl(event.image),
        }));
        setEvents(mapped);
        if (mapped.length > 0) {
          setFeaturedEvent(mapped[0]);
        } else {
          setFeaturedEvent(null);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchandise = async () => {
    try {
      setMerchLoading(true);
      const response = await merchandiseAPI.getProducts({ active: true });
      if (response?.success) {
        const mapped = (response.products || []).slice(0, 6).map((product) => ({
          ...product,
          image: resolveImageUrl(product.imageUrl),
        }));
        setMerchandise(mapped);
      }
    } catch (error) {
      console.error("Error fetching merchandise:", error);
    } finally {
      setMerchLoading(false);
    }
  };

  const handlePurchaseMerch = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    // Navigate to purchase page with product data
    navigate("/merchandise/purchase", { state: { product } });
  };

  useEffect(() => {
    // 1. Check if user is logged in
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("user");

    if (token && userDataStr) {
      try {
        const parsedUser = JSON.parse(userDataStr);
        if (parsedUser) {
          // Redirect admin away from home page
          if (parsedUser.role === "SYSTEM_ADMIN") {
            window.location.href = "/admin-dashboard";
            return;
          }
          setIsLoggedIn(true);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    // Fetch events from API
    fetchEvents();
    fetchMerchandise();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowLogoutModal(false);
  };

  // Helper to format date from DB
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
    };
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <img
              src="/logo/Nexora event logo design.png"
              alt="NEXORA"
              className="logo-image"
            />
            <span>NEXORA</span>
          </div>
          <div className="nav-links">
            <a href="#explore" className="nav-link active">
              Explore
            </a>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/clubs" className="nav-link">
              Clubs
            </Link>
            <Link to="/faculty" className="nav-link">
              Faculty
            </Link>
            {(user && user.role && !["STUDENT", "CLUB_PRESIDENT"].includes(user.role.toUpperCase())) && (
              <Link to="/logistics" className="nav-link">
                Logistics
              </Link>
            )}
            {(user && user.role && !["STUDENT", "CLUB_PRESIDENT"].includes(user.role.toUpperCase())) && (
              <Link to="/create-events" className="nav-link">
                Create Events
              </Link>
            )}
          </div>
        </div>
        <div className="nav-right">
          <div className="search-bar">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search events..." />
          </div>
          <button className="icon-btn" aria-label="Notifications">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button className="icon-btn" aria-label="Calendar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
          
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="profile-container" ref={profileRef}>
              <button
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Profile"
              >
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="profile-info">
                      <h4>{user?.name}</h4>
                      <p>{user?.email}</p>
                      <span className="user-role-badge">{user?.role}</span>
                      {user?.studentId && (
                        <span className="student-id">{user.studentId}</span>
                      )}
                    </div>
                  </div>
                  <div className="profile-menu-divider"></div>
                  <div className="profile-menu-items">
                    <Link to="/profile" className="profile-menu-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      My Profile
                    </Link>
                    <Link to="/dashboard" className="profile-menu-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Dashboard
                    </Link>
                    <Link to="/settings" className="profile-menu-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m5.2-15.8l-4.2 4.2m0 5.2l4.2 4.2M23 12h-6m-6 0H1m20.8-5.2l-4.2 4.2m0 5.2l4.2 4.2"></path>
                      </svg>
                      Settings
                    </Link>
                  </div>
                  <div className="profile-menu-divider"></div>
                  <button
                  onClick={handleLogoutClick}
                    className="profile-menu-item logout"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-login-nav">
              Log In
            </Link>
          )}
        </div>
      </nav>

      <main className="main-content">
        <div className="filter-chips">
          <button className="chip active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            All Events
          </button>
          <button className="chip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
            Sports
          </button>
          <button className="chip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Tech
          </button>
          <button className="chip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <line x1="12" y1="2" x2="12" y2="10"></line>
              <line x1="12" y1="14" x2="12" y2="22"></line>
            </svg>
            Arts
          </button>
          <button className="chip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            Music
          </button>
        </div>

        {featuredEvent && (
          <section
            className="hero-banner"
            style={{
              backgroundImage: `url('${featuredEvent.image || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1600"}')`,
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-meta">
                <span className="featured-tag">FEATURED EVENT</span>
                <span className="hero-date">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(featuredEvent.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="hero-title">
                {featuredEvent.title}
                <span className="highlight-accent">
                  <br />
                  {featuredEvent.category}
                </span>
              </h1>
              <p className="hero-desc">
                {summarizeDescription(featuredEvent.description)}
              </p>
              <div className="hero-actions">
                  <button
                    className={`btn-primary ${featuredEvent.isRegistered ? "btn-joined" : ""}`}
                    onClick={(e) => featuredEvent.isRegistered 
                      ? handleUnregisterEvent(e, featuredEvent.id)
                      : handleRegisterEvent(e, featuredEvent.id)
                    }
                    disabled={registrationLoading[featuredEvent.id]}
                  >
                    {registrationLoading[featuredEvent.id]
                      ? "Processing..."
                      : featuredEvent.isRegistered 
                        ? "Joined • Cancel" 
                        : "Register Now"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
                <button 
                  onClick={() => navigate(`/event/${featuredEvent.id}`)} 
                  className="btn-secondary"
                >
                  Learn More
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="events-section">
          {events.length > 0 && (
            <div className="section-header">
              <div className="section-title-wrap">
                <h2>Upcoming Club Events</h2>
                <p>Discover what's happening around campus</p>
              </div>
              <a href="#view-all" className="view-all">
                View All <span>&gt;</span>
              </a>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <h3>No events available</h3>
              <p>Stay tuned! Amazing campus events are coming soon.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event, index) => {
                const formatted = formatDate(event.date);
                return (
                  <div
                    key={event.id}
                    className="event-card-link"
                    style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer' }}
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    <div className="event-card">
                      <div className="card-image-wrap">
                        <div className="card-image">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="card-bg-img"
                            crossOrigin="anonymous"
                          />
                          <div className="image-overlay"></div>
                        </div>
                        <div className="date-badge">
                          <span className="day">{formatted.day}</span>
                          <span className="month">{formatted.month}</span>
                        </div>
                        <div className="category-badge">
                          <span>{event.category}</span>
                        </div>
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">{event.title}</h3>
                        <div className="card-meta">
                          <div className="meta-item">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>{event.location}</span>
                          </div>
                          <div className="meta-item">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>{event.registeredCount} Joined</span>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button
                            onClick={(e) => event.isRegistered 
                              ? handleUnregisterEvent(e, event.id)
                              : handleRegisterEvent(e, event.id)
                            }
                            disabled={registrationLoading[event.id]}
                            className={`btn-register ${event.isRegistered ? "btn-joined" : ""}`}
                          >
                            <span>
                              {registrationLoading[event.id]
                                ? "Processing..."
                                : event.isRegistered 
                                  ? "Joined ✓" 
                                  : "Register Now"}
                            </span>
                            {!registrationLoading[event.id] && !event.isRegistered && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="load-more-container">
            <button className="btn-load-more">
              Load More Events{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </section>

        <section className="events-section" id="merch">
          <div className="section-header">
            <div className="section-title-wrap">
              <h2>Campus Merchandise</h2>
              <p>Browse and purchase available merch drops</p>
            </div>
            <Link to="/dashboard" className="view-all">
              View All <span>&gt;</span>
            </Link>
          </div>

          {merchLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading merchandise...</p>
            </div>
          ) : merchandise.length === 0 ? (
            <div className="empty-state">
              <p>No merchandise available right now</p>
            </div>
          ) : (
            <div className="events-grid">
              {merchandise.map((product, index) => {
                const stock = Number(product.inventory || 0);
                const stockLabel = stock <= 0 ? "Out of Stock" : stock < 10 ? "Low Stock" : "In Stock";
                return (
                  <div
                    key={product.id}
                    className="event-card-link"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="event-card">
                      <div className="card-image-wrap">
                        <div className="card-image">
                          <img
                            src={product.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200"}
                            alt={product.name}
                            className="card-bg-img"
                          />
                          <div className="image-overlay"></div>
                        </div>
                        <div className="date-badge merch-stock-badge">
                          <span className="month">{stockLabel}</span>
                        </div>
                        <div className="category-badge merch-price-badge">
                          <span>${Number(product.price || 0).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">{product.name}</h3>
                        <div className="card-meta">
                          <div className="meta-item">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M6 2l1.5 6h11L20 2"></path>
                              <path d="M4 8h16l-1.5 8h-13z"></path>
                              <circle cx="9" cy="20" r="1"></circle>
                              <circle cx="15" cy="20" r="1"></circle>
                            </svg>
                            <span>{stock} available</span>
                          </div>
                          <div className="meta-item">
                            <span>{product.description || "Limited campus merchandise item."}</span>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button
                            onClick={(e) => handlePurchaseMerch(e, product)}
                            disabled={stock <= 0}
                            className="btn-register"
                          >
                            <span>
                              {stock <= 0
                                ? "Unavailable"
                                : "Buy Now"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {isLoggedIn && <ChatBot />}

      <Footer user={user} />
      <LogoutConfirmationModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogoutConfirm} 
      />
    </div>
  );
};

export default Landing;
