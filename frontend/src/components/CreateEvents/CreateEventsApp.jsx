import { useState } from "react";
import { C, FONT, Icon } from "./designSystem";
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
  const [page, setPage] = useState("dashboard");
  const [selectedEvent, setSel] = useState(null);
  const [events, setEvents] = useState(MY_EVENTS);
  const [submitted, setSubmitted] = useState(null);

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
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D1DCE8; border-radius: 10px; }
        ::placeholder { color: #A3B8CC; }
        select option { background: #fff; color: #0D1F33; }
        body, button, input, textarea, select { font-family: Montserrat, system-ui, sans-serif; }
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
            <a key={key} href="#" onClick={(e) => { e.preventDefault(); navigate(key); }} style={{ fontSize: "14px", fontWeight: isActive ? "700" : "500", color: isActive ? C.primary : C.textMuted, textDecoration: "none", borderBottom: isActive ? `2px solid ${C.secondary}` : "none", paddingBottom: "2px", transition: "color .15s" }}>
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
