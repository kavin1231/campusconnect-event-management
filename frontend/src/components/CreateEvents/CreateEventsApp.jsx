import { useState, createContext, useContext } from "react";
import { THEMES, FONT, Icon } from "./designSystem";

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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: FONT, background: C.neutral }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Smooth animations */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        body { animation: fadeIn 0.4s ease-out; }
        
        /* Enhanced scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${C.neutral}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.textMuted}; }
        
        /* Form elements */
        ::placeholder { color: ${C.textMuted}; }
        select option { background: ${C.white}; color: ${C.text}; }
        
        /* Smooth button transitions */
        button { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        button:hover:not(:disabled) { transform: translateY(-2px); }
        button:active:not(:disabled) { transform: translateY(0); }
        
        /* Glass Effect */
        [data-glass] {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        /* Card hover effects */
        [data-card] { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        [data-card]:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(139, 92, 246, 0.15); }
        
        /* Glass Card */
        [data-glass-card] {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        [data-glass-card]:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.15);
        }
        
        /* Input focus states */
        input, textarea, select { transition: all 0.2s ease; }
        input:focus, textarea:focus, select:focus { 
          border-color: ${C.primary} !important; 
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        /* Glass Input */
        [data-glass-input] {
          background: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          color: ${C.text};
        }
        [data-glass-input]:focus {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
        }
        
        /* Badge animations */
        [data-badge] { animation: scaleIn 0.3s ease-out; }
        
        /* Glass Badge */
        [data-glass-badge] {
          background: rgba(139, 92, 246, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        /* Loading state */
        .skeleton { 
          background: linear-gradient(90deg, ${C.white} 25%, ${C.border} 50%, ${C.white} 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        font-family: Montserrat, system-ui, sans-serif;
      `}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" />

      <div style={{ height: "56px", background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 28px", gap: "24px", flexShrink: 0, zIndex: 200, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "8px" }}>
          <div onClick={() => navigate("dashboard")} style={{ width: "32px", height: "32px", borderRadius: "8px", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, cursor: "pointer" }}><Icon.Logo /></div>
          <span onClick={() => navigate("dashboard")} style={{ fontSize: "16px", fontWeight: "800", color: C.primary, fontFamily: FONT, letterSpacing: "-0.02em", cursor: "pointer" }}>NEXORA</span>
        </div>

        {[ ["dashboard", "Dashboard"], ["events", "Events"], ["merch", "Merchandise"], ["calendar", "Logistics"], ["requests", "Finances"] ].map(([key, label]) => {
          const isActive = navbarActive === key || (key === "events" && ["events", "pending", "approved", "published", "create", "submit_success"].includes(page));
          return (
            <a key={key} href="#" onClick={(e) => { e.preventDefault(); navigate(key); }} style={{ fontSize: "14px", fontWeight: isActive ? "700" : "500", color: isActive ? C.primary : C.textMuted, textDecoration: "none", borderBottom: isActive ? `3px solid ${C.primary}` : "2px solid transparent", paddingBottom: "1px", transition: "all .2s", padding: "0 0 1px", display: "flex", alignItems: "center" }}>
              {label}
            </a>
          );
        })}

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: C.neutral, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "7px 14px", width: "180px" }}>
          <span style={{ color: C.textDim, display: "flex" }}><Icon.Search /></span>
          <span style={{ fontSize: "13px", color: C.textDim, fontFamily: FONT }}>Search events...</span>
        </div>

        <button style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.textMuted, position: "relative" }}>
          <Icon.Bell />
          <span style={{ position: "absolute", top: "-3px", right: "-3px", width: "14px", height: "14px", borderRadius: "50%", background: C.secondary, color: C.white, fontSize: "8px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.white}` }}>4</span>
        </button>
        <button 
          onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
          style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.textMuted, transition: "all 0.2s" }}
          title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
        >
          {theme === "light" ? <Icon.Moon /> : <Icon.Sun />}
        </button>
        <button style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.textMuted }}><Icon.Settings /></button>

        <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: C.primaryLight, border: `2px solid ${C.primary}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary }}><Icon.User size={16} /></div>
          <div>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: C.text, fontFamily: FONT, lineHeight: 1.2 }}>Kavindu P.</p>
            <p style={{ margin: 0, fontSize: "10px", color: C.textMuted, fontFamily: FONT }}>Club President</p>
          </div>
          <span style={{ color: C.textDim, display: "flex" }}><Icon.ChevronDown size={12} /></span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
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
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: C.primary }}><Icon.Grid /></div>
              <p style={{ fontSize: "16px", fontWeight: "700", color: C.text, margin: "0 0 8px", fontFamily: FONT, textTransform: "capitalize" }}>{page}</p>
              <p style={{ fontSize: "13px", color: C.textMuted, margin: "0 0 20px", fontFamily: FONT }}>This section is part of the full NEXORA platform.</p>
              <button onClick={() => navigate("dashboard")} style={{ padding: "10px 22px", background: C.primary, color: C.white, border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
