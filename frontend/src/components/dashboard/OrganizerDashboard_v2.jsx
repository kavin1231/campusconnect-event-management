import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  primary: "#053668",
  secondary: "#FF7100",
  tertiary: "#F7ECB5",
  neutral: "#F9FAFB",
  white: "#FFFFFF",
  primaryLight: "#EBF1F9",
  border: "#D1DCE8",
  text: "#0D1F33",
  textMuted: "#5A7494",
  textDim: "#A3B8CC",
  secLight: "#FFF0E3",
  success: "#1B7F4B",
  error: "#D93025",
};

const FONT = "'Montserrat', sans-serif";

function StatCard({ icon, label, value, trend, trendUp = true, accent = false }) {
  return (
    <div style={{
      background: accent ? `linear-gradient(135deg, ${C.primary} 0%, #0a4f96 100%)` : C.white,
      borderRadius: "14px",
      padding: "24px",
      border: `1px solid ${accent ? "transparent" : C.border}`,
      boxShadow: accent ? "0 6px 24px rgba(5,54,104,.2)" : "0 2px 8px rgba(5,54,104,.05)",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      flex: 1,
      minWidth: 0,
      position: "relative",
      overflow: "hidden",
      transition: "all .3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = accent ? "0 8px 32px rgba(5,54,104,.3)" : "0 4px 16px rgba(5,54,104,.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = accent ? "0 6px 24px rgba(5,54,104,.2)" : "0 2px 8px rgba(5,54,104,.05)";
    }}>
      {accent && (
        <>
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-30px",
            right: "40px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255,113,0,.08)",
          }} />
        </>
      )}

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "10px",
          background: accent ? "rgba(255,255,255,.12)" : C.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent ? C.white : C.primary,
          fontSize: "20px",
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: trendUp ? C.success : C.error,
            fontSize: "11px",
            fontWeight: "700",
            fontFamily: FONT,
          }}>
            {trendUp ? "↑" : "↓"} {trend}%
          </div>
        )}
      </div>

      <div>
        <p style={{
          margin: "0 0 6px",
          fontSize: "32px",
          fontWeight: "800",
          color: accent ? C.white : C.text,
          fontFamily: FONT,
          lineHeight: 1,
        }}>
          {value}
        </p>
        <p style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: "600",
          color: accent ? "rgba(255,255,255,.85)" : C.text,
          fontFamily: FONT,
        }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function ActionCard({ icon, label, desc, onClick, variant = "primary" }) {
  const variants = {
    primary: { bg: C.primary, color: C.white, border: "transparent", hover: "#0a4f96" },
    secondary: { bg: C.secondary, color: C.white, border: "transparent", hover: "#e06200" },
    outline: { bg: C.white, color: C.primary, border: C.border, hover: C.primaryLight },
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
        transition: "all .2s",
        fontFamily: FONT,
        boxShadow: variant === "primary" || variant === "secondary" ? "0 4px 12px rgba(5,54,104,.15)" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = v.hover;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = v.bg;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        flexShrink: 0,
        background: variant === "primary" || variant === "secondary" ? "rgba(255,255,255,.15)" : C.primaryLight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: variant === "primary" || variant === "secondary" ? C.white : C.primary,
        fontSize: "18px",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "700", color: "inherit", fontFamily: FONT }}>
          {label}
        </p>
        <p style={{
          margin: 0,
          fontSize: "11px",
          color: variant === "primary" || variant === "secondary" ? "rgba(255,255,255,.65)" : C.textMuted,
          lineHeight: 1.4,
          fontFamily: FONT,
        }}>
          {desc}
        </p>
      </div>
      <span style={{ display: "flex", opacity: 0.6, color: "inherit", fontSize: "14px" }}>→</span>
    </button>
  );
}

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [notif] = useState(2);

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "28px 32px",
      display: "flex",
      flexDirection: "column",
      gap: "28px",
      background: C.neutral,
      fontFamily: FONT,
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{
            margin: "0 0 6px",
            fontSize: "11px",
            fontWeight: "700",
            color: C.secondary,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: FONT,
          }}>
            WELCOME BACK
          </p>
          <h1 style={{
            margin: "0 0 6px",
            fontSize: "28px",
            fontWeight: "800",
            color: C.text,
            fontFamily: FONT,
            letterSpacing: "-0.02em",
          }}>
            Organizer Dashboard 👋
          </h1>
          <p style={{
            margin: 0,
            fontSize: "13px",
            color: C.textMuted,
            fontFamily: FONT,
          }}>
            Manage your events and track upcoming schedules
          </p>
        </div>
        <button
          onClick={() => navigate('/my-events')}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: C.primary,
            color: C.white,
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: FONT,
            boxShadow: "0 4px 16px rgba(5,54,104,.25)",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0a4f96";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.primary;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span>+</span> View My Events
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}>
        <StatCard icon="📅" label="Total Events" value="12" trend={18} trendUp={true} accent={true} />
        <StatCard icon="⏳" label="Pending Approval" value="2" trend={0} />
        <StatCard icon="✓" label="Approved" value="8" trend={12} trendUp={true} />
        <StatCard icon="⚠️" label="Active Conflicts" value="2" trend={100} trendUp={false} />
      </div>

      {/* Quick Actions */}
      <div style={{
        background: C.white,
        borderRadius: "14px",
        border: `1px solid ${C.border}`,
        padding: "20px",
        boxShadow: "0 2px 8px rgba(5,54,104,.05)",
      }}>
        <h2 style={{
          fontSize: "14px",
          fontWeight: "700",
          color: C.text,
          margin: "0 0 16px",
          fontFamily: FONT,
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}>
          <ActionCard variant="primary" icon="📝" label="Create Event Request" desc="Submit new permission request" />
          <ActionCard variant="secondary" icon="📅" label="View Calendar" desc="Check venue availability" />
          <ActionCard variant="outline" icon="🏛️" label="Browse Venues" desc="Explore campus venues" />
          <ActionCard variant="outline" icon="⚠️" label="Conflict Center" desc="Resolve scheduling conflicts" />
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: C.secLight,
        border: `1.5px solid rgba(255,113,0,.4)`,
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "rgba(255,113,0,.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.secondary,
          fontSize: "18px",
          flexShrink: 0,
        }}>
          ⚠️
        </div>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: "0 0 4px",
            fontSize: "13px",
            fontWeight: "700",
            color: "#7A3300",
            fontFamily: FONT,
          }}>
            {notif} Pending Approvals
          </p>
          <p style={{
            margin: 0,
            fontSize: "12px",
            color: "#A05000",
            fontFamily: FONT,
          }}>
            Your requests need admin review. Check back in 3-5 working days.
          </p>
        </div>
        <button
          onClick={() => navigate('/my-events')}
          style={{
            flexShrink: 0,
            padding: "8px 16px",
            background: C.secondary,
            color: C.white,
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: FONT,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(255,113,0,.3)",
          }}
        >
          View Requests
        </button>
        <button style={{
          background: "none",
          border: "none",
          color: "#A05000",
          cursor: "pointer",
          fontSize: "18px",
          flexShrink: 0,
          lineHeight: 1,
        }}>
          ×
        </button>
      </div>
    </div>
  );
}
