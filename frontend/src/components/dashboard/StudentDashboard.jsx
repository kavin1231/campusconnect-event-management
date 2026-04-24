import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { dashboardAPI, sportsAPI, groupLinksAPI, studySupportAPI, merchandiseAPI, resolveImageUrl } from "../../services/api";
import { FileText, Link as LinkIcon, Video, Calendar, AlertCircle, Trophy, Users, ExternalLink, Loader2 as LoaderIcon } from 'lucide-react';
import "./StudentDashboard.css";

// ÔöÇÔöÇ Filter options ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
const FILTERS = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past Events" },
];

const CATEGORIES = [
  "All",
  "Tech",
  "Sports",
  "Arts",
  "Music",
  "Cultural",
  "Academic",
  "Workshops",
  "Gaming",
  "Entertainment",
  "Other",
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    registered: 0,
    upcoming: 0,
    past: 0,
    totalEvents: 0,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filter, setFilter] = useState(() => searchParams.get("filter") || "all");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");
  const [actionLoading, setActionLoading] = useState({}); // { [eventId]: true }
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const searchTimerRef = useRef(null);


  // ÔöÇÔöÇ Auth guard ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      navigate("/login");
      return;
    }
    try {
      const u = JSON.parse(userStr);
      if (u.role === "SYSTEM_ADMIN") {
        navigate("/admin-dashboard");
        return;
      }
      if (u.role !== "STUDENT" && u.role !== "CLUB_PRESIDENT") {
        navigate("/");
        return;
      }
      setUser(u);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  // ÔöÇÔöÇ Fetch stats ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await dashboardAPI.getStats();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ÔöÇÔöÇ Fetch events ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        filter,
        ...(category !== "All" ? { category } : {}),
        ...(search ? { search } : {}),
      };
      const data = await dashboardAPI.getEvents(filters);
      if (data.success) setEvents(data.events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, category, search]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchEvents();
    }
  }, [user, fetchStats, fetchEvents]);



  // ÔöÇÔöÇ Sync filter with URL ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all";
    if (urlFilter !== filter) {
      setFilter(urlFilter);
    }
  }, [searchParams, filter]);

  // ÔöÇÔöÇ Debounced search ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setSearch(e.target.value), 400);
  };

  // ÔöÇÔöÇ Profile dropdown close on outside click ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfileMenu(false);
    };
    if (showProfileMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showProfileMenu]);

  // ÔöÇÔöÇ Toast helper ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // ÔöÇÔöÇ Register / Unregister ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const toggleRegistration = async (event) => {
    setActionLoading((prev) => ({ ...prev, [event.id]: true }));
    try {
      let data;
      if (event.isRegistered) {
        data = await dashboardAPI.unregisterEvent(event.id);
      } else {
        data = await dashboardAPI.registerEvent(event.id);
      }
      if (data.success) {
        showToast(data.message);
        await fetchStats();
        await fetchEvents();
      } else {
        showToast(data.message || "Action failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [event.id]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ÔöÇÔöÇ Helpers ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
      full: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  };

  const getCategoryColor = (cat) => {
    const map = {
      Tech: "#6366f1",
      Sports: "#10b981",
      Arts: "#f59e0b",
      Music: "#ec4899",
      Cultural: "#8b5cf6",
      Academic: "#3b82f6",
      Workshops: "#f97316",
      Gaming: "#06b6d4",
      Entertainment: "#f43f5e",
      Other: "#64748b",
    };
    return map[cat] || "#64748b";
  };


  const isEventsView = true;


  // ÔöÇÔöÇ Render ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  return (
    <>
      <Header />
      <div className="sd-layout">
        <Sidebar activePage="dashboard" />

      {/* ÔöÇÔöÇ Main Wrapper ÔöÇÔöÇ */}
      <div className="sd-content-wrapper">
        {/* ÔöÇÔöÇ Toast ÔöÇÔöÇ */}
        {toastMsg && (
          <div className={`sd-toast sd-toast-${toastType}`}>
            {toastType === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {toastMsg}
          </div>
        )}

        {isEventsView && (
          <header className="sd-header">
            <div className="sd-header-content">
              <div className="sd-header-text">
                <span className="sd-header-badge">WELCOME BACK</span>
                <h1>Hello, {user?.name?.split(" ")[0]}! 👋</h1>
                <p>Here's what's happening with your campus events today.</p>
              </div>
              <div className="sd-header-stats">
                <div className="sd-header-stat">
                  <span className="sd-stat-num">{stats.totalEvents}</span>
                  <span className="sd-stat-text">Total Events</span>
                </div>
                <div className="sd-header-stat">
                  <span className="sd-stat-num">{stats.registered}</span>
                  <span className="sd-stat-text">Registered</span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* ÔöÇÔöÇ Body ÔöÇÔöÇ */}
        <main className="sd-main">

          {/* Stats row */}
          {isEventsView && (
            <div className="sd-stats-row">
              {[
                {
                  label: "Total Registered",
                  value: stats.registered,
                  icon: "📝",
                  color: "#4f46e5",
                },
                {
                  label: "Upcoming",
                  value: stats.upcoming,
                  icon: "📅",
                  color: "#10b981",
                },
                {
                  label: "Completed",
                  value: stats.past,
                  icon: "✅",
                  color: "#f59e0b",
                },
                {
                  label: "Events on Platform",
                  value: stats.totalEvents,
                  icon: "🌐",
                  color: "#8b5cf6",
                },
              ].map((s) => (
                <div key={s.label} className="sd-stat-card">
                  <div
                    className="sd-stat-icon"
                    style={{ background: `${s.color}18` }}
                  >
                    {s.icon}
                  </div>
                  <div className="sd-stat-body">
                    <span className="sd-stat-value" style={{ color: s.color }}>
                      {statsLoading ? "ÔÇö" : s.value}
                    </span>
                    <span className="sd-stat-label">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Filter + Category bar ── */}
          {isEventsView && (
            <div className="sd-controls">
              <div className="sd-filter-tabs">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    className={`sd-filter-tab ${filter === f.key ? "sd-filter-active" : ""}`}
                    onClick={() => {
                      setFilter(f.key);
                      setSearchParams({ filter: f.key, category });
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="sd-category-chips">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    className={`sd-chip ${category === c ? "sd-chip-active" : ""}`}
                    onClick={() => {
                      setCategory(c);
                      setSearchParams({ filter, category: c });
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Event Grid content */}
          {isEventsView && (
            <>
          {loading ? (
            <div className="sd-loading">
              <div className="sd-spinner" />
              <p>Loading events…</p>
            </div>
          ) : events.length === 0 ? (
            <div className="sd-empty">
              <div className="sd-empty-icon">🔍</div>
              <h3>No events found</h3>
              <p>Try changing the filter or search term.</p>
            </div>
          ) : (
            <div className="sd-events-grid">
              {events.map((ev) => {
                const fd = formatDate(ev.date);
                const catColor = getCategoryColor(ev.category);
                const busy = !!actionLoading[ev.id];

                return (
                  <div
                    key={ev.id}
                    className={`sd-event-card ${ev.isPast ? "sd-event-past" : ""} ${ev.isRegistered ? "sd-event-registered" : ""}`}
                    onClick={() => navigate(`/event/${ev.id}`)}
                  >
                    {/* image */}
                    <div className="sd-card-img-wrap">
                      <img
                        src={resolveImageUrl(ev.image)}
                        alt={ev.title}
                        className="sd-card-img"
                      />
                      <div className="sd-card-date">
                        <span className="sd-date-day">{fd.day}</span>
                        <span className="sd-date-month">{fd.month}</span>
                      </div>
                      <span
                        className="sd-card-category"
                        style={{ background: catColor }}
                      >
                        {ev.category}
                      </span>
                      {ev.isRegistered && (
                        <span className="sd-registered-badge">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Registered
                        </span>
                      )}
                      {ev.isPast && (
                        <div className="sd-past-overlay">Event Ended</div>
                      )}
                    </div>

                    {/* body */}
                    <div className="sd-card-body">
                      <h3 className="sd-card-title">{ev.title}</h3>
                      <p className="sd-card-desc">{ev.description}</p>

                      <div className="sd-card-meta">
                        <div className="sd-meta-item">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {ev.location}
                        </div>
                        <div className="sd-meta-item">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
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
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {fd.full}
                        </div>
                        <div className="sd-meta-item">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {ev.registeredCount} Registered
                        </div>
                      </div>

                      {/* Action button */}
                      {ev.isPast ? (
                        <button className="sd-btn-ended" disabled>
                          Event Ended
                        </button>
                      ) : ev.isRegistered ? (
                        <button
                          className="sd-btn-unregister"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRegistration(ev);
                          }}
                          disabled={busy}
                        >
                          {busy ? (
                            <>
                              <div className="sd-btn-spinner sd-btn-spinner-dark" />
                              ProcessingÔÇª
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              Unregister
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          className="sd-btn-register"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRegistration(ev);
                          }}
                          disabled={busy}
                        >
                          {busy ? (
                            <>
                              <div className="sd-btn-spinner" />
                              ProcessingÔÇª
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                              Register
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
        </main>

      </div>
    </div>
    </>
  );
};

export default StudentDashboard;
