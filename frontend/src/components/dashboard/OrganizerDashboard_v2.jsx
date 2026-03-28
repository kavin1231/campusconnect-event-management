import { useState } from "react";
import { C, FONT } from "../../constants/colors";
import { Icon } from "../common/Icon";
import { Navbar, NotificationPanel } from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { Btn, StatusBadge, TypeBadge } from "../common/Primitives";
import { UPCOMING_EVENTS, RECENT_REQUESTS } from "../../constants/staticData";
import EventRequestFormPage from "../../pages/EventRequestFormPage";
import { CalendarPage } from "../../pages/CalendarPage";
import { PlaceholderPage } from "../../pages/PlaceholderPage";

function StatCard({ label, value, sub, trend, trendUp, icon, accent = false }) {
  return (
    <div
      style={{
        background: accent ? C.primary : C.white,
        borderRadius: "14px",
        padding: "22px",
        border: `1px solid ${accent ? "transparent" : C.border}`,
        boxShadow: accent ? "0 6px 24px rgba(5,54,104,.2)" : "0 2px 8px rgba(5,54,104,.05)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: accent ? "rgba(255,255,255,.12)" : C.primaryLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent ? C.white : C.primary,
          }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: trendUp ? C.success : C.error,
              fontSize: "11px",
              fontWeight: "700",
              fontFamily: FONT,
            }}
          >
            {trendUp ? <Icon.ArrowUp size={11} /> : <Icon.ArrowDown size={11} />}
            {trend}%
          </div>
        )}
      </div>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: "800", color: accent ? C.white : C.text, fontFamily: FONT, lineHeight: 1 }}>
          {value}
        </p>
        <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: "600", color: accent ? "rgba(255,255,255,.8)" : C.text, fontFamily: FONT }}>{label}</p>
        {sub && <p style={{ margin: 0, fontSize: "11px", color: accent ? "rgba(255,255,255,.5)" : C.textMuted, fontFamily: FONT }}>{sub}</p>}
      </div>
    </div>
  );
}

function ActionCard({ icon, label, desc, onClick, variant = "default" }) {
  const variants = {
    primary: { bg: C.primary, color: C.white, border: "transparent" },
    orange: { bg: C.secondary, color: C.white, border: "transparent" },
    outline: { bg: C.white, color: C.primary, border: C.border },
    cream: { bg: C.tertiary, color: "#7A6200", border: C.terDark },
    default: { bg: C.neutral, color: C.text, border: C.border },
  };
  const v = variants[variant];

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px 18px",
        borderRadius: "12px",
        background: v.bg,
        color: v.color,
        border: `1.5px solid ${v.border}`,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          flexShrink: 0,
          background: variant === "primary" || variant === "orange" ? "rgba(255,255,255,.15)" : C.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: variant === "primary" || variant === "orange" ? C.white : C.primary,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "700", color: "inherit" }}>{label}</p>
        <p style={{ margin: 0, fontSize: "11px", color: variant === "primary" || variant === "orange" ? "rgba(255,255,255,.65)" : C.textMuted, lineHeight: 1.4 }}>{desc}</p>
      </div>
      <span style={{ display: "flex", opacity: 0.6, color: "inherit" }}>
        <Icon.ChevronRight size={14} />
      </span>
    </button>
  );
}

function DashboardPage({ onNavigate }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: C.secondary, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>GOOD MORNING</p>
          <h1 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "800", color: C.text, fontFamily: FONT, letterSpacing: "-0.02em" }}>Welcome back, Kavindu</h1>
          <p style={{ margin: 0, fontSize: "13px", color: C.textMuted, fontFamily: FONT }}>You have 2 pending requests and 1 upcoming event this week.</p>
        </div>
        <Btn onClick={() => onNavigate("create")}>+ New Event Request</Btn>
      </div>

      <div style={{ background: C.secLight, border: `1.5px solid rgba(255,113,0,.4)`, borderRadius: "12px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,113,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", color: C.secondary, flexShrink: 0 }}>
          <Icon.Warning size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "700", color: "#7A3300", fontFamily: FONT }}>2 Venue Conflicts Detected</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#A05000", fontFamily: FONT }}>Music Night and Charity Gala are both booked at the Open Air Amphitheatre on Apr 20.</p>
        </div>
        <Btn variant="secondary" onClick={() => onNavigate("calendar")}>Resolve Now</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        <StatCard label="Total Events" value="12" sub="This semester" trend={18} trendUp={true} icon={<Icon.Calendar size={18} />} accent={true} />
        <StatCard label="Pending Requests" value="2" sub="Awaiting review" trend={0} trendUp={false} icon={<Icon.FileText size={18} />} />
        <StatCard label="Approved Events" value="8" sub="Ready to run" trend={12} trendUp={true} icon={<Icon.Check size={18} />} />
        <StatCard label="Active Conflicts" value="2" sub="Need resolution" trend={100} trendUp={false} icon={<Icon.Conflict size={18} />} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px 20px", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
            <p style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "700", color: C.text, fontFamily: FONT }}>Quick Actions</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <ActionCard variant="primary" icon={<Icon.Plus size={16} />} label="New Event Request" desc="Submit a permission request" onClick={() => onNavigate("create")} />
              <ActionCard variant="orange" icon={<Icon.Conflict size={16} />} label="Conflict Calendar" desc="Check venue availability" onClick={() => onNavigate("calendar")} />
              <ActionCard variant="outline" icon={<Icon.Venue size={16} />} label="Browse Venues" desc="View all campus venues" onClick={() => onNavigate("venues")} />
              <ActionCard variant="cream" icon={<Icon.FileText size={16} />} label="My Requests" desc="Track submitted requests" onClick={() => onNavigate("requests")} />
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(5,54,104,.05)", overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "700", color: C.text, fontFamily: FONT }}>Upcoming Events</p>
                <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>Your next scheduled events</p>
              </div>
              <button onClick={() => onNavigate("events")} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: "12px", fontWeight: "700", fontFamily: FONT }}>View all</button>
            </div>
            {UPCOMING_EVENTS.map((ev, i) => (
              <div key={ev.id} style={{ padding: "14px 20px", borderBottom: i < UPCOMING_EVENTS.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{ev.title}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>{ev.date} · {ev.time} · {ev.venue}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <StatusBadge status={ev.status} />
                  <TypeBadge type={ev.type} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(5,54,104,.05)", overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}` }}>
              <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "700", color: C.text, fontFamily: FONT }}>Permission Requests</p>
              <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>Track your submitted requests</p>
            </div>
            {RECENT_REQUESTS.slice(0, 4).map((req, i) => (
              <div key={req.id} style={{ padding: "12px 20px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "600", color: C.text, fontFamily: FONT }}>{req.title}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>{req.submitted}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
            <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>This Month</p>
            <p style={{ margin: "0 0 16px", fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>March 2026 · 5 requests</p>
            {[{ label: "Approved", value: 3, total: 5, color: C.success }, { label: "Pending", value: 1, total: 5, color: "#D97706" }, { label: "Conflicts", value: 2, total: 5, color: C.secondary }].map((s) => (
              <div key={s.label} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>{s.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{s.value}/{s.total}</span>
                </div>
                <div style={{ background: C.border, borderRadius: "100px", height: "5px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(s.value / s.total) * 100}%`, background: s.color, borderRadius: "100px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrganizerDashboard() {
  const [page, setPage] = useState("dashboard");
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = (key) => {
    setNotifOpen(false);
    setPage(key);
  };

  const pageContent = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage onNavigate={navigate} />;
      case "create":
        return <EventRequestFormPage onOpenCalendar={() => navigate("calendar")} onBack={() => navigate("dashboard")} />;
      case "calendar":
        return <CalendarPage onBack={() => navigate("dashboard")} />;
      case "venues":
        return <PlaceholderPage title="Venues" icon={<Icon.Venue size={28} />} desc="Browse venue capacity, features, and availability." action="Open Calendar" onAction={() => navigate("calendar")} />;
      case "requests":
        return <PlaceholderPage title="My Requests" icon={<Icon.FileText size={28} />} desc="Track all your submitted permission requests and current statuses." />;
      case "events":
        return <PlaceholderPage title="My Events" icon={<Icon.Calendar size={28} />} desc="All your upcoming and past events in one place." action="Create New Event" onAction={() => navigate("create")} />;
      case "staffing":
        return <PlaceholderPage title="Staffing" icon={<Icon.Users size={28} />} desc="Manage volunteers, team members, and role assignments." />;
      default:
        return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: FONT, background: C.neutral }}>
      <Navbar page={page} onNavigate={navigate} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <NotificationPanel open={notifOpen} />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Sidebar page={page} onNavigate={navigate} />
        {pageContent()}
      </div>
    </div>
  );
}
