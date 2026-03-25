import { useState } from "react";
import { C, FONT } from "../../constants/colors";
import { Icon } from "./Icon";

export function Sidebar({ page, onNavigate }) {
  const [open, setOpen] = useState(true);
  const NAV = [
    { key: "dashboard", icon: <Icon.Grid />, label: "Overview" },
    { key: "events", icon: <Icon.Calendar />, label: "My Events" },
    { key: "create", icon: <Icon.Plus />, label: "Create Event", highlight: true },
    { key: "calendar", icon: <Icon.CalendarView />, label: "Conflict Calendar" },
    { key: "venues", icon: <Icon.Venue />, label: "Venues" },
    { key: "requests", icon: <Icon.FileText />, label: "My Requests" },
    { key: "staffing", icon: <Icon.Users />, label: "Staffing" },
  ];
  return (
    <div
      style={{
        width: open ? "216px" : "60px",
        flexShrink: 0,
        background: C.primary,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: open ? "16px 16px 14px" : "16px 10px 14px",
          borderBottom: "1px solid rgba(255,255,255,.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          minHeight: "64px",
        }}
      >
        {open && (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: C.secondary,
                margin: "0 0 2px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: FONT,
              }}
            >
              Event Manager
            </p>
            <p
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,.4)",
                margin: 0,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: FONT,
              }}
            >
              University Logistics
            </p>
          </div>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "rgba(255,255,255,.1)",
            border: "none",
            borderRadius: "6px",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: C.white,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.1)")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: open ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.25s",
            }}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <nav style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {NAV.map(({ key, icon, label, highlight }) => {
          const isActive = page === key;
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
                borderRadius: "8px",
                cursor: "pointer",
                position: "relative",
                background: isActive
                  ? "rgba(255,255,255,.14)"
                  : highlight
                  ? "rgba(255,113,0,.15)"
                  : "transparent",
                transition: "all .15s",
                border: highlight && !isActive ? "1px solid rgba(255,113,0,.3)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = highlight ? "rgba(255,113,0,.22)" : "rgba(255,255,255,.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isActive ? "rgba(255,255,255,.14)" : highlight ? "rgba(255,113,0,.15)" : "transparent";
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "20px",
                    borderRadius: "0 3px 3px 0",
                    background: C.secondary,
                  }}
                />
              )}
              <span
                style={{
                  display: "flex",
                  flexShrink: 0,
                  color: highlight ? C.secondary : isActive ? C.white : "rgba(255,255,255,.55)",
                }}
              >
                {icon}
              </span>
              {open && (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: isActive || highlight ? "700" : "500",
                    fontFamily: FONT,
                    flex: 1,
                    color: highlight ? C.secondary : isActive ? C.white : "rgba(255,255,255,.55)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div
        style={{
          padding: open ? "14px" : "14px 10px",
          borderTop: "1px solid rgba(255,255,255,.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: open ? "10px" : "0",
            justifyContent: open ? "flex-start" : "center",
            padding: open ? "8px 10px" : "8px 0",
            borderRadius: "8px",
            cursor: "pointer",
            color: "rgba(255,255,255,.45)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.07)";
            e.currentTarget.style.color = C.white;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,.45)";
          }}
        >
          <span style={{ display: "flex" }}>
            <Icon.LogOut size={15} />
          </span>
          {open && (
            <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: "500" }}>Sign Out</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
