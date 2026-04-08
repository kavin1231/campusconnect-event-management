import { useState, createContext, useContext } from "react";
import { THEMES, FONT, Icon } from "./designSystem";
import styles from "./CreateEventsApp.module.css";
import "./global.css";

// Theme Context for child components
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
import { MY_EVENTS } from "./data";
import SidebarFull from "./SidebarFull";
import DashboardPage from "./pages/DashboardPage";
import MyEventsPage from "./pages/MyEventsPage";
import PendingPage from "./pages/PendingPage";
import ApprovedPage from "./pages/ApprovedPage";
import PublishedPage from "./pages/PublishedPage";
import PermissionFormPage from "./pages/PermissionFormPage";
import SubmitSuccess from "./pages/SubmitSuccess";
import CalendarPage from "./pages/CalendarPage";
import MerchPage from "./pages/MerchPage";

export default function App() {
  const [page, setPage] = useState("create");
  const [selectedEvent, setSel] = useState(null);
  const [events, setEvents] = useState(MY_EVENTS);
  const [submitted, setSubmitted] = useState(null);
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to "light"
    try {
      const saved = localStorage.getItem("nexora-theme");
      return saved || "light";
    } catch {
      return "light";
    }
  });

  // Save theme preference when it changes
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("nexora-theme", newTheme);
    } catch {
      console.warn("Could not save theme preference");
    }
  };

  // Get colors based on current theme
  const C = THEMES[theme];

  const navigate = (key) => {
    setPage(key);
    setSel(null);
    setSubmitted(null);
  };

  const selectEvent = (ev) => {
    setSel(ev);
    if (ev.status === "pending") setPage("pending");
    if (ev.status === "approved") setPage("approved");
    if (ev.status === "published") setPage("published");
  };

  const handlePublish = (id) => {
    setEvents((evs) => evs.map((e) => (e.id === id ? { ...e, status: "published" } : e)));
    setPage("events");
    setSel(null);
  };

  const handleFormSubmit = (title) => {
    setSubmitted(title);
    setPage("submit_success");
  };

  const activeSidebar = ["pending", "approved", "published", "submit_success"].includes(page)
    ? "events"
    : page === "create"
    ? "create"
    : page;

  const navbarActive = ["dashboard"].includes(page)
    ? "dashboard"
    : ["events", "pending", "approved", "published", "create", "submit_success"].includes(page)
    ? "events"
    : ["calendar"].includes(page)
    ? "logistics"
    : ["merch"].includes(page)
    ? "merch"
    : ["requests"].includes(page)
    ? "reports"
    : page;

  return (
    <div style={{ background: C.neutral }} className={styles.root}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" />

      <div className={styles.navbar} style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div className={styles.navbarBrand}>
          <div onClick={() => navigate("dashboard")} className={styles.navbarLogo} style={{ background: C.primary, color: C.white }}><Icon.Logo /></div>
          <span onClick={() => navigate("dashboard")} className={styles.navbarText} style={{ color: C.primary }}>NEXORA</span>
        </div>

        {[ ["dashboard", "Dashboard"], ["events", "Events"], ["merch", "Merchandise"], ["calendar", "Logistics"], ["requests", "Finances"] ].map(([key, label]) => {
          const isActive = navbarActive === key || (key === "events" && ["events", "pending", "approved", "published", "create", "submit_success"].includes(page));
          return (
            <a key={key} href="#" onClick={(e) => { e.preventDefault(); navigate(key); }} className={styles.navLink} style={{ fontWeight: isActive ? "700" : "500", color: isActive ? C.primary : C.textMuted, borderBottom: isActive ? `3px solid ${C.primary}` : "2px solid transparent" }}>
              {label}
            </a>
          );
        })}

        <div className={styles.flex1} />

        <div className={styles.searchBox} style={{ background: C.neutral, border: `1px solid ${C.border}` }}>
          <span style={{ color: C.textDim, display: "flex" }}><Icon.Search /></span>
          <span style={{ fontSize: "13px", color: C.textDim, fontFamily: FONT }}>Search events...</span>
        </div>

        <button className={styles.navButton} style={{ border: `1px solid ${C.border}`, background: C.white, color: C.textMuted }}>
          <Icon.Bell />
          <span className={styles.notificationBadge} style={{ background: C.secondary, color: C.white, border: `2px solid ${C.white}` }}>4</span>
        </button>

        <button 
          onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
          className={styles.navButton}
          style={{ border: `1px solid ${C.border}`, background: C.white, color: C.textMuted }}
          title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
        >
          {theme === "light" ? <Icon.Moon /> : <Icon.Sun />}
        </button>

        <button className={styles.navButton} style={{ border: `1px solid ${C.border}`, background: C.white, color: C.textMuted }}><Icon.Settings /></button>

        <div className={styles.userProfile}>
          <div className={styles.userAvatar} style={{ background: C.primaryLight, border: `2px solid ${C.primary}`, color: C.primary }}><Icon.User size={16} /></div>
          <div>
            <p className={styles.userName} style={{ color: C.text }}>Kavindu P.</p>
            <p className={styles.userRole} style={{ color: C.textMuted }}>Club President</p>
          </div>
          <span style={{ color: C.textDim, display: "flex" }}><Icon.ChevronDown size={12} /></span>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <SidebarFull activePage={activeSidebar} onNavigate={navigate} />

        {page === "dashboard" && <DashboardPage onNavigate={navigate} />}
        {page === "events" && <MyEventsPage events={events} onSelectEvent={selectEvent} onNavigate={navigate} />}
        {page === "create" && <PermissionFormPage onBack={() => navigate("events")} onSubmitSuccess={handleFormSubmit} />}
        {page === "submit_success" && <SubmitSuccess eventTitle={submitted} onBack={() => navigate("events")} />}
        {page === "pending" && selectedEvent && <PendingPage event={selectedEvent} onBack={() => navigate("events")} />}
        {page === "approved" && selectedEvent && <ApprovedPage event={selectedEvent} onBack={() => navigate("events")} onPublish={handlePublish} />}
        {page === "published" && selectedEvent && <PublishedPage event={selectedEvent} onBack={() => navigate("events")} />}
        {page === "calendar" && <CalendarPage onBack={() => navigate("dashboard")} />}
        {page === "merch" && <MerchPage onNavigate={navigate} />}

        {["venues", "requests", "staffing"].includes(page) && (
          <div className={styles.placeholder}>
            <div className={styles.placeholderContent}>
              <div className={styles.placeholderIcon} style={{ background: C.primaryLight, color: C.primary }}><Icon.Grid /></div>
              <p className={styles.placeholderTitle} style={{ color: C.text }}>{page}</p>
              <p className={styles.placeholderDesc} style={{ color: C.textMuted }}>This section is part of the full NEXORA platform.</p>
              <button onClick={() => navigate("dashboard")} className={styles.placeholderButton} style={{ background: C.primary, color: C.white }}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
