import { useState } from "react";
import { C, FONT, Icon } from "./designSystem";

export default function SidebarFull({ activePage, onNavigate }) {
  const [open, setOpen] = useState(true);
  const NAV = [
    { key: "dashboard", icon: <Icon.Grid />, label: "Overview" },
    { key: "events", icon: <Icon.Events />, label: "My Events" },
    { key: "create", icon: <Icon.Plus />, label: "Request Permission", highlight: true },
    { key: "calendar", icon: <Icon.CalendarView />, label: "Conflict Calendar" },
    { key: "merch", icon: <Icon.ShoppingBag />, label: "Merch & Orders" },
    { key: "venues", icon: <Icon.Venue />, label: "Venues" },
    { key: "requests", icon: <Icon.FileText />, label: "My Requests" },
    { key: "staffing", icon: <Icon.Users />, label: "Staffing" },
  ];

  return (
    <div style={{ width: open ? "216px" : "60px", flexShrink: 0, background: C.primary, display: "flex", flexDirection: "column", transition: "width 0.25s cubic-bezier(.4,0,.2,1)", overflow: "hidden" }}>
      <div style={{ padding: open ? "16px 16px 14px" : "16px 10px 14px", borderBottom: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", minHeight: "64px" }}>
        {open && (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.secondary, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT }}>Event Manager</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,.4)", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: FONT }}>University Logistics</p>
          </div>
        )}
        <button onClick={() => setOpen((o) => !o)} style={{ background: "rgba(255,255,255,.1)", border: "none", borderRadius: "8px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.white, flexShrink: 0 }}>
          <span style={{ fontSize: "14px", lineHeight: 1 }}>{open ? "<" : ">"}</span>
        </button>
      </div>

      <nav style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {NAV.map(({ key, icon, label, highlight }) => {
          const isActive = activePage === key;
          return (
            <div
              key={key}
              title={!open ? label : undefined}
              onClick={() => onNavigate(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: open ? "10px" : "0",
                padding: open ? "9px 10px" : "9px 0",
                justifyContent: open ? "flex-start" : "center",
                borderRadius: "10px",
                cursor: "pointer",
                position: "relative",
                background: isActive ? "rgba(255,255,255,.14)" : highlight ? "rgba(255,113,0,.15)" : "transparent",
                transition: "all .15s",
                border: highlight && !isActive ? "1px solid rgba(255,113,0,.3)" : "1px solid transparent",
              }}
            >
              {isActive && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "3px", height: "20px", borderRadius: "0 3px 3px 0", background: C.secondary }} />}
              <span style={{ display: "flex", flexShrink: 0, color: highlight ? C.secondary : isActive ? C.white : "rgba(255,255,255,.55)" }}>{icon}</span>
              {open && <span style={{ fontSize: "12px", fontWeight: isActive || highlight ? "700" : "500", fontFamily: FONT, flex: 1, color: highlight ? C.secondary : isActive ? C.white : "rgba(255,255,255,.55)", whiteSpace: "nowrap", overflow: "hidden" }}>{label}</span>}
              {open && highlight && <span style={{ fontSize: "8px", fontWeight: "800", background: "rgba(255,113,0,.3)", color: C.secondary, padding: "2px 6px", borderRadius: "100px", fontFamily: FONT }}>NEW</span>}
            </div>
          );
        })}
      </nav>

      <div style={{ padding: open ? "14px" : "14px 10px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: open ? "10px" : "0", justifyContent: open ? "flex-start" : "center", padding: open ? "8px 10px" : "8px 0", borderRadius: "8px", cursor: "pointer", color: "rgba(255,255,255,.45)" }}>
          <span style={{ display: "flex" }}><Icon.LogOut /></span>
          {open && <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: "500" }}>Sign Out</span>}
        </div>
      </div>
    </div>
  );
}
