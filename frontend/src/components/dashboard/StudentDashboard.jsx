import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { dashboardAPI, sportsAPI, groupLinksAPI, studySupportAPI, merchandiseAPI } from "../../services/api";
import { FileText, Link as LinkIcon, Video, Calendar, AlertCircle, Trophy, Users, ExternalLink, Loader2 as LoaderIcon } from 'lucide-react';
import "./StudentDashboard.css";

// ÔöÇÔöÇ Filter options ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
const FILTERS = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past Events" },
  { key: "orders", label: "My Orders" },
  { key: "explore", label: "Explore" },
  { key: "study", label: "Study Materials" },
  { key: "extracurricular", label: "Social" },
];

const CATEGORIES = [
  "All",
  "Tech",
  "Sports",
  "Arts",
  "Music",
  "Cultural",
  "Academic",
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

  // ÔöÇÔöÇ Study Support States ÔöÇÔöÇ
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [activeStudyTab, setActiveStudyTab] = useState('materials');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [studySearchTerm, setStudySearchTerm] = useState('');
  const [studyLoading, setStudyLoading] = useState(false);
  const [studyError, setStudyError] = useState(null);

  // ÔöÇÔöÇ Extracurricular States ÔöÇÔöÇ
  const [sports, setSports] = useState([]);
  const [extraLinks, setExtraLinks] = useState([]);
  const [activeExtraTab, setActiveExtraTab] = useState('sports');
  const [extraLoading, setExtraLoading] = useState(false);
  const [extraError, setExtraError] = useState(null);
  const [merchOrders, setMerchOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);

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

  // ÔöÇÔöÇ Fetch Study Data ÔöÇÔöÇ
  const fetchStudyData = useCallback(async () => {
    if (filter !== "study") return;
    setStudyLoading(true);
    try {
      const [materialsData, sessionsData] = await Promise.all([
        studySupportAPI.getMaterials(),
        studySupportAPI.getSessions()
      ]);

      if (materialsData.success) {
        setStudyMaterials(materialsData.data || []);
      }
      if (sessionsData.success) {
        setStudySessions(sessionsData.data || []);
      }
      setStudyError(null);
    } catch (err) {
      console.error('Error fetching study materials:', err);
      setStudyError('Failed to load study materials');
    } finally {
      setStudyLoading(false);
    }
  }, [filter]);

  // ÔöÇÔöÇ Extracurricular Data Fetching ÔöÇÔöÇ
  const fetchExtraData = useCallback(async () => {
    if (filter !== "extracurricular") return;
    setExtraLoading(true);
    setExtraError(null);
    try {
      const [sportsData, linksData] = await Promise.all([
        sportsAPI.getAllSports(),
        groupLinksAPI.getAllLinks()
      ]);
      
      if (sportsData.success) setSports(sportsData.sports);
      if (linksData.success) setExtraLinks(linksData.links);
    } catch (err) {
      console.error('Error fetching extracurricular data:', err);
      setExtraError('Failed to load extracurricular content');
    } finally {
      setExtraLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (user && filter === "study") {
      fetchStudyData();
    }
    if (user && filter === "extracurricular") {
      fetchExtraData();
    }
  }, [user, filter, fetchStudyData, fetchExtraData]);

  const fetchMerchOrders = useCallback(async () => {
    if (filter !== "orders") return;
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const response = await merchandiseAPI.getOrders();
      if (response?.success) {
        const list = Array.isArray(response.orders) ? response.orders : [];
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMerchOrders(list);
      } else {
        setOrdersError(response?.message || "Failed to load your merchandise orders.");
      }
    } catch (err) {
      console.error("Error loading merchandise orders:", err);
      setOrdersError(err?.message || "Failed to load your merchandise orders.");
    } finally {
      setOrdersLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (user && filter === "orders") {
      fetchMerchOrders();
    }
  }, [user, filter, fetchMerchOrders]);

  const getFilteredMaterials = () => {
    if (!Array.isArray(studyMaterials)) return [];
    return studyMaterials.filter(material => {
      const semesterMatch = selectedSemester === 'all' || material?.semester === selectedSemester;
      const title = material?.title || '';
      const desc = material?.description || '';
      const searchMatch = title.toLowerCase().includes(studySearchTerm.toLowerCase()) || 
                         desc.toLowerCase().includes(studySearchTerm.toLowerCase());
      return semesterMatch && searchMatch;
    });
  };

  const getFilteredSessions = () => {
    if (!Array.isArray(studySessions)) return [];
    return studySessions.filter(session => {
      const semesterMatch = selectedSemester === 'all' || session?.semester === selectedSemester;
      const title = session?.title || '';
      const desc = session?.description || '';
      const searchMatch = title.toLowerCase().includes(studySearchTerm.toLowerCase()) || 
                         desc.toLowerCase().includes(studySearchTerm.toLowerCase());
      return semesterMatch && searchMatch;
    });
  };

  const handleDownloadOrOpen = (material) => {
    if (!material.contentUrl) return;
    const url = material.contentUrl.startsWith('http') 
      ? material.contentUrl 
      : `http://localhost:5000/${material.contentUrl}`;
    window.open(url, '_blank');
  };

  const uniqueSemesters = Array.from(new Set([
    'Y1S1', 'Y1S2', 'Y2S1', 'Y2S2', 
    'Y3S1', 'Y3S2', 'Y4S1', 'Y4S2',
    ...studyMaterials.map(m => m.semester),
    ...studySessions.map(s => s.semester)
  ].filter(Boolean))).sort((a, b) => {
    const getValues = (str) => {
      const match = str.match(/Y(\d)S(\d)/i);
      if (match) return [parseInt(match[1]), parseInt(match[2])];
      const numMatch = str.match(/\d+/);
      return [9, numMatch ? parseInt(numMatch[0]) : 99];
    };
    const [yA, sA] = getValues(a);
    const [yB, sB] = getValues(b);
    if (yA !== yB) return yA - yB;
    return sA - sB;
  });

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
      Other: "#64748b",
    };
    return map[cat] || "#64748b";
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ORDER_STEPS = ["Submitted", "Payment Check", "Confirmed", "Ready/Delivered"];

  const getOrderTrackerMeta = (statusRaw) => {
    const status = String(statusRaw || "PENDING").toUpperCase();

    if (status.includes("REJECT") || status.includes("CANCEL")) {
      return {
        label: "Rejected",
        tone: "rejected",
        stepIndex: 1,
        helper: "Payment was not approved. Please re-submit with a valid payment slip.",
      };
    }

    if (status.includes("READY")) {
      return {
        label: "Ready for Pickup",
        tone: "confirmed",
        stepIndex: 3,
        helper: "Payment verified. Your order is ready for pickup.",
      };
    }

    if (status.includes("DELIVER") || status.includes("COMPLETE") || status.includes("FULFIL") || status.includes("COLLECT")) {
      return {
        label: "Delivered",
        tone: "complete",
        stepIndex: 3,
        helper: "Your order has completed fulfillment.",
      };
    }

    if (status.includes("PAID") || status.includes("CONFIRM") || status.includes("APPROV")) {
      return {
        label: "Payment Confirmed",
        tone: "confirmed",
        stepIndex: 2,
        helper: "Your payment has been verified and your order is being prepared.",
      };
    }

    return {
      label: "Payment Verification Pending",
      tone: "pending",
      stepIndex: 1,
      helper: "Order submitted and waiting for payment verification.",
    };
  };

  const isEventsView =
    filter !== "study" && filter !== "extracurricular" && filter !== "orders";

  const toggleOrderTracker = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

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
                      setSearchParams({ filter: f.key });
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
                    onClick={() => setCategory(c)}
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
                  >
                    {/* image */}
                    <div className="sd-card-img-wrap">
                      <img
                        src={ev.image}
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
                          onClick={() => toggleRegistration(ev)}
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
                          onClick={() => toggleRegistration(ev)}
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

        {filter === "orders" && (
          <section className="sd-orders-tracker-view">
            <div className="sd-orders-header-card">
              <div className="sd-orders-header-main">
                <div className="sd-orders-icon">📦</div>
                <div>
                  <h2>My Merchandise Orders</h2>
                  <p>Track each order from submission to payment confirmation and delivery.</p>
                </div>
              </div>
              <div className="sd-orders-summary">
                <span className="sd-orders-summary-label">Total Orders</span>
                <strong>{merchOrders.length}</strong>
              </div>
            </div>

            {ordersLoading ? (
              <div className="sd-loading">
                <div className="sd-spinner" />
                <p>Loading your orders...</p>
              </div>
            ) : ordersError ? (
              <div className="sd-study-error">
                <AlertCircle size={32} />
                <h3>{ordersError}</h3>
                <button onClick={fetchMerchOrders}>Try Again</button>
              </div>
            ) : merchOrders.length === 0 ? (
              <div className="sd-empty">
                <div className="sd-empty-icon">🧾</div>
                <h3>No merchandise orders yet</h3>
                <p>When you place an order, its tracker will appear here.</p>
              </div>
            ) : (
              <div className="sd-orders-list">
                {merchOrders.map((order) => {
                  const meta = getOrderTrackerMeta(order.status);
                  const isExpanded = expandedOrderIds.includes(order.id);
                  return (
                    <article className="sd-order-list-item" key={order.id}>
                      <div className="sd-order-list-row">
                        <div className="sd-order-list-main">
                          <p className="sd-order-label">Order #{order.id}</p>
                          <h3>{order.items?.[0]?.product?.name || "Merchandise Order"}</h3>
                          <p className="sd-order-submitted">Submitted on {formatDateTime(order.createdAt)}</p>
                        </div>

                        <div className="sd-order-list-status">
                          <span className={`sd-order-badge sd-order-badge-${meta.tone}`}>{meta.label}</span>
                          <p className="sd-order-helper">{meta.helper}</p>
                          {order.pickupLocation && (
                            <p className="sd-order-helper" style={{ marginTop: "4px", fontWeight: 700 }}>
                              Pickup Location: {order.pickupLocation}
                            </p>
                          )}
                        </div>

                        <div className="sd-order-list-metrics">
                          <div className="sd-order-metric">
                            <span>Total</span>
                            <strong>${Number(order.totalAmount || 0).toFixed(2)}</strong>
                          </div>
                          <div className="sd-order-metric">
                            <span>Items</span>
                            <strong>{Array.isArray(order.items) ? order.items.length : 0}</strong>
                          </div>
                          <div className="sd-order-metric">
                            <span>Payment Slip</span>
                            {order.paymentSlipUrl ? (
                              <a
                                href={`http://localhost:5000${order.paymentSlipUrl}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Attached Slip
                              </a>
                            ) : (
                              <strong>Not attached</strong>
                            )}
                          </div>
                        </div>

                        <button
                          className="sd-order-toggle"
                          type="button"
                          onClick={() => toggleOrderTracker(order.id)}
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? "Collapse order progress" : "Expand order progress"}
                        >
                          <span className={`sd-order-toggle-icon ${isExpanded ? "open" : ""}`}>▾</span>
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="sd-order-tracker-panel">
                          <div className="sd-order-steps">
                            {ORDER_STEPS.map((step, idx) => {
                              const done = idx < meta.stepIndex;
                              const active = idx === meta.stepIndex;
                              return (
                                <div key={`${order.id}-${step}`} className="sd-order-step-item">
                                  <span className={`sd-order-step-dot ${done ? "done" : ""} ${active ? "active" : ""}`}>
                                    {done ? "✓" : idx + 1}
                                  </span>
                                  <span className={`sd-order-step-text ${done || active ? "current" : ""}`}>{step}</span>
                                </div>
                              );
                            })}
                          </div>
                          {order.pickupLocation && (
                            <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--text-main)" }}>
                              Collection Point: <strong>{order.pickupLocation}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
        
        {/* ÔöÇÔöÇ Study Support Section ÔöÇÔöÇ */}
        {filter === "study" && (
          <div className="sd-study-integrated-view">
            <header className="sd-study-header">
              <div className="sd-study-search-wrap">
                <i className="search-icon">🔍</i>
                <input 
                  type="text" 
                  placeholder="Search materials, sessions, topics..." 
                  value={studySearchTerm}
                  onChange={(e) => setStudySearchTerm(e.target.value)}
                />
              </div>
              
              <div className="sd-study-filters">
                <select 
                  value={selectedSemester} 
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="sd-study-select"
                >
                  <option value="all">All Semesters</option>
                  {uniqueSemesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div className="sd-study-tabs">
                <button 
                  className={`sd-study-tab ${activeStudyTab === 'materials' ? 'active' : ''}`}
                  onClick={() => setActiveStudyTab('materials')}
                >
                  <FileText size={18} />
                  <span>Materials</span>
                </button>
                <button 
                  className={`sd-study-tab ${activeStudyTab === 'sessions' ? 'active' : ''}`}
                  onClick={() => setActiveStudyTab('sessions')}
                >
                  <Calendar size={18} />
                  <span>Sessions</span>
                </button>
              </div>
            </header>

            <div className="sd-study-feed">
              {studyLoading ? (
                <div className="sd-study-loading">
                  <div className="sd-study-spinner"></div>
                  <p>Loading resources...</p>
                </div>
              ) : studyError ? (
                <div className="sd-study-error">
                  <AlertCircle size={32} />
                  <h3>{studyError}</h3>
                  <button onClick={fetchStudyData}>Try Again</button>
                </div>
              ) : activeStudyTab === 'materials' ? (
                <div className="sd-study-table-wrapper">
                  {getFilteredMaterials().length === 0 ? (
                    <div className="sd-study-empty">
                      <div className="empty-icon">📚</div>
                      <h3>No materials found</h3>
                      <p>Try adjusting your search or semester filter</p>
                    </div>
                  ) : (
                    <table className="sd-study-table">
                      <thead>
                        <tr>
                          <th>Material Title</th>
                          <th>Semester</th>
                          <th>Type</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredMaterials().map((material, index) => (
                          <tr key={material.id} style={{ '--delay': index }}>
                            <td>
                              <div className="table-title-cell">
                                <div className="type-icon-small">
                                  {material.materialType === 'pdf' ? <FileText size={16} /> : 
                                   material.materialType === 'video' ? <Video size={16} /> : 
                                   <LinkIcon size={16} />}
                                </div>
                                <div>
                                  <div className="main-title">{material.title}</div>
                                  <div className="sub-desc">{material.description}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="table-tag">{material.semester}</span></td>
                            <td><span className="type-label">{material.materialType?.toUpperCase()}</span></td>
                            <td className="text-right">
                              <button className="table-btn-view" onClick={() => handleDownloadOrOpen(material)}>
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <div className="sd-study-table-wrapper">
                  {getFilteredSessions().length === 0 ? (
                    <div className="sd-study-empty">
                      <div className="empty-icon">🎥</div>
                      <h3>No sessions found</h3>
                      <p>Try adjusting your search or semester filter</p>
                    </div>
                  ) : (
                    <table className="sd-study-table">
                      <thead>
                        <tr>
                          <th>Session Title</th>
                          <th>Semester</th>
                          <th>Date & Time</th>
                          <th>Organizer</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredSessions().map((session, index) => (
                          <tr key={session.id} style={{ '--delay': index }}>
                            <td>
                              <div>
                                <div className="main-title">{session.title}</div>
                                <div className="sub-desc">{session.description}</div>
                              </div>
                            </td>
                            <td><span className="table-tag">{session.semester}</span></td>
                            <td>
                              <div className="table-date-cell">
                                <div>{new Date(session.sessionDate).toLocaleDateString()}</div>
                                <div className="sub-time">{new Date(session.sessionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                              </div>
                            </td>
                            <td>
                              <div className="table-creator">
                                <div className="avatar-small">🎓</div>
                                <span>{session.creator?.name || 'Admin'}</span>
                              </div>
                            </td>
                            <td className="text-right">
                              {session.sessionLink ? (
                                <button className="table-btn-join" onClick={() => {
                                  const url = session.sessionLink.startsWith('http') 
                                    ? session.sessionLink 
                                    : `http://localhost:5000/${session.sessionLink}`;
                                  window.open(url, '_blank');
                                }}>
                                  Join
                                </button>
                              ) : (
                                <span className="pending-label">Link Pending</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÔöÇÔöÇ Extracurricular Section ÔöÇÔöÇ */}
        {filter === "extracurricular" && (
          <div className="sd-study-integrated-view">
            <header className="sd-study-header">
              <div className="sd-study-search-wrap">
                <i className="search-icon">🔍</i>
                <input 
                  type="text" 
                  placeholder="Search clubs, hubs, communities..." 
                  value={studySearchTerm}
                  onChange={(e) => setStudySearchTerm(e.target.value)}
                />
              </div>
              <div className="sd-study-tabs">
                <button 
                  className={`sd-study-tab ${activeExtraTab === 'sports' ? 'active' : ''}`}
                  onClick={() => setActiveExtraTab('sports')}
                >
                  <Trophy size={18} />
                  <span>Sports Clubs</span>
                </button>
                <button 
                  className={`sd-study-tab ${activeExtraTab === 'links' ? 'active' : ''}`}
                  onClick={() => setActiveExtraTab('links')}
                >
                  <Users size={18} />
                  <span>Social Hub</span>
                </button>
              </div>
            </header>

            <div className="sd-study-feed">
              {extraLoading ? (
                <div className="sd-study-loading">
                  <div className="sd-study-spinner"></div>
                  <p>Loading hubs...</p>
                </div>
              ) : extraError ? (
                <div className="sd-study-error">
                  <AlertCircle size={32} />
                  <h3>{extraError}</h3>
                  <button onClick={fetchExtraData}>Try Again</button>
                </div>
              ) : activeExtraTab === 'sports' ? (
                <div className="sd-study-table-wrapper">
                  {sports.length === 0 ? (
                    <div className="sd-study-empty">
                      <div className="empty-icon">🏆</div>
                      <h3>No sports clubs found</h3>
                      <p>Check back later for active campus sports</p>
                    </div>
                  ) : (
                    <table className="sd-study-table">
                      <thead>
                        <tr>
                          <th>Club Name</th>
                          <th>Coach</th>
                          <th>Status</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sports.map((sport) => (
                          <tr key={sport.id}>
                            <td>
                              <div className="table-title-cell">
                                <div className="type-icon-small"><Trophy size={16} /></div>
                                <div>
                                  <div className="main-title">{sport.name}</div>
                                  <div className="sub-desc">{sport.description}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="table-creator">
                                <div className="avatar-small">👤</div>
                                <span>{sport.coachName || 'N/A'}</span>
                              </div>
                            </td>
                            <td><span className="table-tag">Active</span></td>
                            <td className="text-right">
                              {sport.whatsappLink && (
                                <button className="table-btn-join" onClick={() => window.open(sport.whatsappLink, '_blank')}>
                                  Join
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <div className="sd-study-table-wrapper">
                  {extraLinks.length === 0 ? (
                    <div className="sd-study-empty">
                      <div className="empty-icon">🔗</div>
                      <h3>No social hubs found</h3>
                      <p>Admin hasn't added any social groups yet</p>
                    </div>
                  ) : (
                    <table className="sd-study-table">
                      <thead>
                        <tr>
                          <th>Community Hub</th>
                          <th>Category</th>
                          <th>Platform</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {extraLinks.map((link) => (
                          <tr key={link.id}>
                            <td>
                              <div className="table-title-cell">
                                <div className="type-icon-small"><LinkIcon size={16} /></div>
                                <div>
                                  <div className="main-title">{link.name}</div>
                                  <div className="sub-desc">Official {link.platform} group</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="table-tag">{link.category}</span></td>
                            <td><span className="type-label">{link.platform}</span></td>
                            <td className="text-right">
                              <button className="table-btn-join" onClick={() => window.open(link.url, '_blank')}>
                                Join Hub
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default StudentDashboard;
