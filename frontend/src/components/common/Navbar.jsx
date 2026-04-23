import { useState } from "react";
import { C, FONT } from "../../constants/colors";
import { Icon } from "./Icon";
import { NOTIFICATIONS } from "../../constants/staticData";

export function Navbar({ page, onNavigate, notifOpen, setNotifOpen }) {
  return (
    <div
      style={{
        height: "56px",
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: "24px",
        boxShadow: "0 1px 4px rgba(5,54,104,.06)",
        flexShrink: 0,
        position: "relative",
        zIndex: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "8px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: C.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.white,
          }}
        >
          <Icon.Logo size={17} />
        </div>
        <span style={{ fontSize: "16px", fontWeight: "800", color: C.primary, fontFamily: FONT, letterSpacing: "-0.02em" }}>
          NEXORA
        </span>
      </div>
      {[["dashboard", "Dashboard"], ["create", "Events"], ["clubs", "Clubs"], ["venues", "Logistics"], ["requests", "Reports"]].map(([key, label]) => (
        <a
          key={key}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(key);
          }}
          style={{
            fontSize: "14px",
            fontWeight: page === key ? "700" : "500",
            color: page === key ? C.primary : C.textMuted,
            textDecoration: "none",
            borderBottom: page === key ? `2px solid ${C.secondary}` : "none",
            paddingBottom: "2px",
          }}
        >
          {label}
        </a>
      ))}

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: C.neutral,
          border: `1px solid ${C.border}`,
          borderRadius: "8px",
          padding: "7px 14px",
          width: "180px",
        }}
      >
        <span style={{ color: C.textDim, display: "flex" }}>
          <Icon.Search size={14} />
        </span>
        <span style={{ fontSize: "13px", color: C.textDim, fontFamily: FONT }}>Search events...</span>
      </div>

      <div style={{ position: "relative" }}>
        <button
          onClick={() => setNotifOpen((o) => !o)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            border: `1px solid ${C.border}`,
            background: notifOpen ? C.primaryLight : C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: notifOpen ? C.primary : C.textMuted,
          }}
        >
          <Icon.Bell size={16} />
        </button>
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: C.secondary,
            color: C.white,
            fontSize: "9px",
            fontWeight: "700",
            fontFamily: FONT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${C.white}`,
          }}
        >
          {NOTIFICATIONS.length}
        </span>
      </div>

      <button
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          border: `1px solid ${C.border}`,
          background: C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: C.textMuted,
        }}
      >
        <Icon.Settings size={16} />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer" }}>
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: C.primaryLight,
            border: `2px solid ${C.primary}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.primary,
          }}
        >
          <Icon.User size={16} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: C.text, fontFamily: FONT, lineHeight: 1.2 }}>
            Kavindu P.
          </p>
          <p style={{ margin: 0, fontSize: "10px", color: C.textMuted, fontFamily: FONT }}>Organizer</p>
        </div>
        <span style={{ color: C.textDim, display: "flex" }}>
          <Icon.ChevronDown size={12} />
        </span>
      </div>
    </div>
  );
}

export function NotificationPanel({ open }) {
  if (!open) return null;
  const icons = { conflict: "⚠", approved: "✓", reminder: "◷", rejected: "✕" };
  const colors = {
    conflict: { bg: C.secLight, icon: C.secondary },
    approved: { bg: C.successLight, icon: C.success },
    reminder: { bg: C.primaryLight, icon: C.primary },
    rejected: { bg: C.errorLight, icon: C.error },
  };
  return (
    <div
      style={{
        position: "fixed",
        top: "64px",
        right: "80px",
        width: "320px",
        background: C.white,
        borderRadius: "12px",
        border: `1px solid ${C.border}`,
        boxShadow: "0 8px 32px rgba(5,54,104,.14)",
        zIndex: 300,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>Notifications</span>
        <span
          style={{
            fontSize: "10px",
            color: C.secondary,
            fontWeight: "700",
            fontFamily: FONT,
            background: C.secLight,
            padding: "2px 8px",
            borderRadius: "100px",
          }}
        >
          {NOTIFICATIONS.length} new
        </span>
      </div>
      {NOTIFICATIONS.map((n) => {
        const col = colors[n.type];
        return (
          <div
            key={n.id}
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.neutral)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: col.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                color: col.icon,
                flexShrink: 0,
              }}
            >
              {icons[n.type]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 3px", fontSize: "12px", color: C.text, fontFamily: FONT, lineHeight: 1.4 }}>
                {n.text}
              </p>
              <p style={{ margin: 0, fontSize: "10px", color: C.textDim, fontFamily: FONT }}>{n.time}</p>
            </div>
          </div>
        );
      })}
      <div style={{ padding: "10px 16px", textAlign: "center" }}>
        <button
          style={{
            fontSize: "12px",
            color: C.primary,
            fontWeight: "700",
            fontFamily: FONT,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
