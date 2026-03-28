import { C, FONT } from "../../constants/colors";
import { Icon } from "./Icon";

// Primitive input styles
const iBase = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: `1.5px solid ${C.border}`,
  background: C.white,
  color: C.text,
  fontSize: "14px",
  fontFamily: FONT,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color .2s, box-shadow .2s",
};

const focusStyle = { borderColor: C.primary, boxShadow: "0 0 0 3px rgba(5,54,104,.1)" };
const blurStyle = { borderColor: C.border, boxShadow: "none" };

export function Lbl({ children, required }) {
  return (
    <label style={{ display: "block", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: C.textMuted, marginBottom: "7px", fontFamily: FONT }}>
      {children}
      {required && <span style={{ color: C.secondary, marginLeft: 3 }}>*</span>}
    </label>
  );
}

export function Inp({ style = {}, ...p }) {
  return (
    <input
      style={{ ...iBase, ...style }}
      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
      onBlur={(e) => Object.assign(e.target.style, blurStyle)}
      {...p}
    />
  );
}

export function Txta({ style = {}, ...p }) {
  return (
    <textarea
      style={{ ...iBase, resize: "vertical", ...style }}
      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
      onBlur={(e) => Object.assign(e.target.style, blurStyle)}
      {...p}
    />
  );
}

export function Sel({ children, style = {}, ...p }) {
  return (
    <select
      style={{ ...iBase, cursor: "pointer", ...style }}
      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
      onBlur={(e) => Object.assign(e.target.style, blurStyle)}
      {...p}
    >
      {children}
    </select>
  );
}

export function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>{children}</div>;
}

export function Pills({ options, value, onChange, multi = false }) {
  const isSelected = (o) => (multi ? (value || []).includes(o) : value === o);
  const toggle = (o) => {
    if (multi) {
      const arr = value || [];
      onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
    } else {
      onChange(o);
    }
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: FONT,
            transition: "all .15s",
            border: `1.5px solid ${isSelected(o) ? C.primary : C.border}`,
            background: isSelected(o) ? C.primaryLight : C.white,
            color: isSelected(o) ? C.primary : C.textMuted,
            fontWeight: isSelected(o) ? "700" : "400",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function SecHead({ icon, title, subtitle }) {
  return (
    <div style={{ paddingBottom: "14px", marginBottom: "4px", borderBottom: `2px solid ${C.tertiary}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: C.primary, display: "flex" }}>{icon}</span>
        <span style={{ fontSize: "15px", fontWeight: "800", color: C.primary, fontFamily: FONT }}>{title}</span>
      </div>
      {subtitle && (
        <p style={{ margin: "6px 0 0 24px", fontSize: "12px", color: C.textMuted, lineHeight: 1.6, fontFamily: FONT }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function InfoBox({ warn = false, children }) {
  return (
    <div
      style={{
        background: warn ? C.secLight : C.tertiary,
        border: `1px solid ${warn ? "rgba(255,113,0,.35)" : C.terDark}`,
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "12px",
        color: warn ? "#7A3300" : "#7A6200",
        display: "flex",
        gap: "8px",
        alignItems: "flex-start",
        lineHeight: 1.6,
        fontFamily: FONT,
      }}
    >
      <span style={{ display: "flex", marginTop: "1px" }}>{warn ? <Icon.Warning /> : <Icon.Info />}</span>
      <span>{children}</span>
    </div>
  );
}

export function InnerCard({ children }) {
  return <div style={{ background: C.neutral, borderRadius: "12px", padding: "20px", border: `1px solid ${C.border}` }}>{children}</div>;
}

export function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        borderRadius: "100px",
        background: value ? C.primary : C.border,
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background .2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "4px",
          left: value ? "22px" : "4px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: C.white,
          transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        }}
      />
    </button>
  );
}

export function Btn({ children, onClick, variant = "primary", disabled = false, style = {} }) {
  const base = {
    padding: "11px 26px",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: FONT,
    fontWeight: "700",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "all .2s",
    ...style,
  };
  const v =
    disabled
      ? { background: C.border, color: C.textDim, boxShadow: "none" }
      : variant === "primary"
      ? { background: C.primary, color: C.white, boxShadow: "0 4px 12px rgba(5,54,104,.25)" }
      : variant === "secondary"
      ? { background: C.secondary, color: C.white, boxShadow: "0 4px 16px rgba(255,113,0,.35)" }
      : variant === "outline"
      ? { background: C.white, color: C.primary, border: `1.5px solid ${C.primary}` }
      : { background: "transparent", color: C.textDim, border: "none", boxShadow: "none" };
  return (
    <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...v }}>
      {children}
    </button>
  );
}

export function StatusBadge({ status }) {
  const map = {
    approved: { bg: C.successLight, text: C.success, label: "Approved" },
    pending: { bg: C.tertiary, text: "#7A6200", label: "Pending" },
    rejected: { bg: C.errorLight, text: C.error, label: "Rejected" },
    conflicted: { bg: C.secLight, text: C.secondary, label: "Conflicted" },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: "700",
        fontFamily: FONT,
        padding: "3px 10px",
        borderRadius: "100px",
        letterSpacing: "0.05em",
        background: s.bg,
        color: s.text,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
      }}
    >
      {s.label}
    </span>
  );
}

export function TypeBadge({ type }) {
  const TYPE_COLORS = {
    Workshop: { bg: "#EBF1F9", text: "#053668" },
    Exhibition: { bg: "#FFF0E3", text: "#7A3300" },
    "Cultural Show": { bg: "#FEF3C7", text: "#7A5F00" },
    "Guest Speaker": { bg: "#E6F4ED", text: "#1B7F4B" },
    "Sports Meet": { bg: "#F0FDF4", text: "#166534" },
    Networking: { bg: "#EBF1F9", text: "#053668" },
    Hackathon: { bg: "#EBF1F9", text: "#053668" },
    Concert: { bg: "#FDF2F8", text: "#7E22CE" },
    "Charity Drive": { bg: "#FEF2F2", text: "#D93025" },
    Seminar: { bg: "#F0F9FF", text: "#0369A1" },
    Conference: { bg: "#EBF1F9", text: "#053668" },
  };
  const col = TYPE_COLORS[type] || { bg: C.primaryLight, text: C.primary };
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: "600",
        fontFamily: FONT,
        padding: "3px 9px",
        borderRadius: "100px",
        background: col.bg,
        color: col.text,
        whiteSpace: "nowrap",
      }}
    >
      {type}
    </span>
  );
}
