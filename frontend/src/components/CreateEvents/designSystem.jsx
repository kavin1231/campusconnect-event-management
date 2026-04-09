import React from "react";

// Theme definitions
export const THEMES = {
  light: {
    primary: "#053668",
    secondary: "#FF7100",
    tertiary: "#F7ECB5",
    neutral: "#F9FAFB",
    white: "#FFFFFF",
    primaryLight: "#E8ECFF",
    border: "#E5E7EB",
    borderDark: "#D1D5DB",
    text: "#1F2937",
    textMuted: "#6B7280",
    textDim: "#9CA3AF",
    secLight: "#FFF4E8",
    success: "#10B981",
    successLight: "#D1F4E8",
    warning: "#F59E0B",
    warningLight: "#FEF3C7",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    approvedBg: "#F59E0B",
    pendingBg: "#FF7100",
    publishedBg: "#10B981",
  },
  dark: {
    primary: "#053668",
    secondary: "#FF7100",
    tertiary: "#F7ECB5",
    neutral: "#1F2937",
    white: "#111827",
    primaryLight: "#1E3A8A",
    border: "#374151",
    borderDark: "#4B5563",
    text: "#F3F4F6",
    textMuted: "#D1D5DB",
    textDim: "#9CA3AF",
    secLight: "#7C2D12",
    success: "#10B981",
    successLight: "#064E3B",
    warning: "#F59E0B",
    warningLight: "#78350F",
    error: "#EF4444",
    errorLight: "#7F1D1D",
    approvedBg: "#B45309",
    pendingBg: "#EA580C",
    publishedBg: "#047857",
  },
};

// Default export for backward compatibility
export const C = THEMES.light;

export const FONT = "'Montserrat', sans-serif";

function Ic({ size = 16, sw = "1.75", children, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      {children}
    </svg>
  );
}

export const Icon = {
  Logo: () => (
    <Ic size={18}>
      <path d="M12 3L2 8l10 5 10-5-10-5z" />
      <path d="M2 13l10 5 10-5" />
      <path d="M2 18l10 5 10-5" />
    </Ic>
  ),
  Grid: () => (
    <Ic size={16}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Ic>
  ),
  Calendar: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Ic>
  ),
  Events: () => (
    <Ic size={16}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </Ic>
  ),
  Plus: ({ size = 16 } = {}) => (
    <Ic size={size} sw="2.25">
      <path d="M12 5v14M5 12h14" />
    </Ic>
  ),
  CalendarView: () => (
    <Ic size={16}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </Ic>
  ),
  FileText: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" />
    </Ic>
  ),
  Users: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Ic>
  ),
  Venue: () => (
    <Ic size={16}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </Ic>
  ),
  Bell: () => (
    <Ic size={16}>
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2.5 7 2.5 7H3.5S6 13 6 8z" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Ic>
  ),
  Settings: () => (
    <Ic size={16}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Ic>
  ),
  User: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </Ic>
  ),
  ChevronDown: ({ size = 12 } = {}) => (
    <Ic size={size} sw="2.25">
      <path d="M6 9l6 6 6-6" />
    </Ic>
  ),
  ChevronRight: ({ size = 14 } = {}) => (
    <Ic size={size} sw="2.25">
      <path d="M9 18l6-6-6-6" />
    </Ic>
  ),
  ChevronLeft: ({ size = 14 } = {}) => (
    <Ic size={size} sw="2.25">
      <path d="M15 18l-6-6 6-6" />
    </Ic>
  ),
  ArrowLeft: ({ size = 16 } = {}) => (
    <Ic size={size} sw="2">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </Ic>
  ),
  Clock: ({ size = 13 } = {}) => (
    <Ic size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Ic>
  ),
  MapPin: ({ size = 13 } = {}) => (
    <Ic size={size}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Ic>
  ),
  Check: ({ size = 14 } = {}) => (
    <Ic size={size} sw="2.25">
      <path d="M20 6L9 17l-5-5" />
    </Ic>
  ),
  CheckCircle: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </Ic>
  ),
  AlertCircle: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r=".5" fill="currentColor" />
    </Ic>
  ),
  Info: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </Ic>
  ),
  Image: ({ size = 20 } = {}) => (
    <Ic size={size}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </Ic>
  ),
  Tag: ({ size = 14 } = {}) => (
    <Ic size={size}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </Ic>
  ),
  Package: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </Ic>
  ),
  BarChart: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </Ic>
  ),
  Eye: ({ size = 14 } = {}) => (
    <Ic size={size}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Ic>
  ),
  LogOut: () => (
    <Ic size={15}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Ic>
  ),
  Ticket: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
    </Ic>
  ),
  Toggle: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <rect x="1" y="5" width="22" height="14" rx="7" />
      <circle cx="16" cy="12" r="3" fill="currentColor" stroke="none" />
    </Ic>
  ),
  Search: () => (
    <Ic size={15}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M16.5 16.5L21 21" />
    </Ic>
  ),
  Conflict: () => (
    <Ic size={16}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </Ic>
  ),
  ExternalLink: ({ size = 12 } = {}) => (
    <Ic size={size}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </Ic>
  ),
  Warning: ({ size = 15 } = {}) => (
    <Ic size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </Ic>
  ),
  Save: ({ size = 14 } = {}) => (
    <Ic size={size}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </Ic>
  ),
  Review: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </Ic>
  ),
  Shield: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Ic>
  ),
  Finance: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Ic>
  ),
  Building: ({ size = 14 } = {}) => (
    <Ic size={size}>
      <path d="M3 22V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" />
      <path d="M2 22h20M9 22V12h6v10M9 7h.01M12 7h.01M15 7h.01" />
    </Ic>
  ),
  Capacity: ({ size = 14 } = {}) => (
    <Ic size={size}>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" />
    </Ic>
  ),
  ArrowUp: ({ size = 11 } = {}) => (
    <Ic size={size} sw="2.5">
      <path d="M18 15l-6-6-6 6" />
    </Ic>
  ),
  ArrowDown: ({ size = 11 } = {}) => (
    <Ic size={size} sw="2.5">
      <path d="M6 9l6 6 6-6" />
    </Ic>
  ),
  Bot: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M12 8V4" />
      <circle cx="12" cy="4" r="1" />
      <path d="M9 13v2M15 13v2" />
    </Ic>
  ),
  Flash: ({ size = 12 } = {}) => (
    <Ic size={size} sw="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Ic>
  ),
  Filter: ({ size = 14 } = {}) => (
    <Ic size={size}>
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </Ic>
  ),
  ShoppingBag: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </Ic>
  ),
  QrCode: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
      <path d="M14 14h3v3M14 20h7M17 17h4" />
    </Ic>
  ),
  Pencil: ({ size = 14 } = {}) => (
    <Ic size={size}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Ic>
  ),
  Trash: ({ size = 14 } = {}) => (
    <Ic size={size}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </Ic>
  ),
  TrendingUp: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </Ic>
  ),
  Pin: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </Ic>
  ),
  Moon: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Ic>
  ),
  Sun: ({ size = 16 } = {}) => (
    <Ic size={size}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </Ic>
  ),
};

export const STATUS_META = {
  pending: { label: "Approval Pending", color: C.secondary, bg: "#0E5A8A", border: "rgba(6,182,212,.2)", dot: "#06B6D4" },
  approved: { label: "Approved", color: C.warning, bg: "#78350F", border: "rgba(217,119,6,.2)", dot: C.warning },
  published: { label: "Published", color: C.success, bg: C.successLight, border: "rgba(16,185,129,.2)", dot: C.success },
};

export const TYPE_COLORS = {
  Conference: { bg: "#312E81", text: C.primary },
  Workshop: { bg: "#064E3B", text: C.success },
  Concert: { bg: "#4C1D95", text: "#D8B4FE" },
  Hackathon: { bg: "#312E81", text: C.primary },
  Seminar: { bg: "#0E5A8A", text: "#06B6D4" },
  Exhibition: { bg: "#1F2937", text: C.warning },
};

const iBase = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: `1.5px solid ${C.border}`,
  background: C.white,
  color: C.text,
  fontSize: "13px",
  fontFamily: FONT,
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  fontWeight: 500,
};

export function Inp({ style = {}, ...p }) {
  return (
    <input
      style={{ ...iBase, ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = C.primary;
        e.target.style.boxShadow = `0 0 0 3px rgba(139, 92, 246, 0.1)`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = C.border;
        e.target.style.boxShadow = "none";
      }}
      {...p}
    />
  );
}

export function Txta({ style = {}, ...p }) {
  return (
    <textarea
      style={{ ...iBase, resize: "vertical", minHeight: "100px", ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = C.primary;
        e.target.style.boxShadow = `0 0 0 3px rgba(139, 92, 246, 0.1)`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = C.border;
        e.target.style.boxShadow = "none";
      }}
      {...p}
    />
  );
}

export function Sel({ children, style = {}, ...p }) {
  return (
    <select
      style={{ ...iBase, cursor: "pointer", ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = C.primary;
        e.target.style.boxShadow = `0 0 0 3px rgba(139, 92, 246, 0.1)`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = C.border;
        e.target.style.boxShadow = "none";
      }}
      {...p}
    >
      {children}
    </select>
  );
}

export function Lbl({ children, required, hint }) {
  return (
    <div style={{ marginBottom: "7px" }}>
      <label style={{ display: "block", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: C.textMuted, fontFamily: FONT }}>
        {children}
        {required && <span style={{ color: C.secondary, marginLeft: 3 }}>*</span>}
      </label>
      {hint && <p style={{ margin: "3px 0 0", fontSize: "11px", color: C.textDim, fontFamily: FONT }}>{hint}</p>}
    </div>
  );
}

export function StatusBadge({ status, size = "sm", glass = false }) {
  const m = STATUS_META[status];
  return (
    <span
      data-badge
      {...(glass && { "data-glass-badge": true })}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: size === "lg" ? "12px" : "10px",
        fontWeight: "700",
        fontFamily: FONT,
        padding: size === "lg" ? "8px 14px" : "5px 11px",
        borderRadius: "6px",
        background: glass ? "rgba(139, 92, 246, 0.15)" : m.bg,
        color: glass ? C.primary : m.color,
        border: glass ? "1px solid rgba(139, 92, 246, 0.3)" : `1.5px solid ${m.border}`,
        whiteSpace: "nowrap",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        transition: "all 0.2s ease",
        ...(glass && { backdropFilter: "blur(8px)", boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)" }),
        ...(!glass && { boxShadow: `0 2px 8px ${m.bg}30` }),
      }}
    >
      {!glass && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: m.dot, display: "block" }} />}
      {m.label}
    </span>
  );
}

export function TypeBadge({ type, glass = false }) {
  const col = TYPE_COLORS[type] || { bg: C.primaryLight, text: C.primary };
  return (
    <span
      data-badge
      {...(glass && { "data-glass-badge": true })}
      style={{
        fontSize: "11px",
        fontWeight: "700",
        fontFamily: FONT,
        padding: "5px 11px",
        borderRadius: "6px",
        background: glass ? "rgba(139, 92, 246, 0.15)" : col.bg,
        color: glass ? C.primary : col.text,
        whiteSpace: "nowrap",
        transition: "all 0.2s ease",
        border: glass ? "1px solid rgba(139, 92, 246, 0.3)" : `1px solid ${col.text}15`,
        display: "inline-block",
        textTransform: "capitalize",
        ...(glass && { backdropFilter: "blur(8px)", boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)" }),
      }}
    >
      {type}
    </span>
  );
}

export function Card({ children, style = {}, pad = "20px", hover = true, glass = false }) {
  return (
    <div
      data-card
      {...(glass && { "data-glass-card": true })}
      style={{
        background: glass ? "rgba(255, 255, 255, 0.12)" : C.white,
        borderRadius: "12px",
        border: glass ? "1px solid rgba(255, 255, 255, 0.2)" : `1px solid ${C.border}`,
        padding: pad,
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: hover ? "pointer" : "default",
        ...(glass && { backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionHead({ label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
      <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</h3>
      {children}
    </div>
  );
}

export function ToggleSwitch({ value, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button type="button" onClick={() => onChange(!value)} style={{ position: "relative", width: "40px", height: "22px", borderRadius: "100px", background: value ? C.primary : C.borderDark, border: "none", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
        <span style={{ position: "absolute", top: "3px", left: value ? "20px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: C.white, transition: "left .2s" }} />
      </button>
      {label && <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT }}>{label}</span>}
    </div>
  );
}

export function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>{children}</div>;
}

export function Pills({ options, value, onChange, multi = false }) {
  const sel = (o) => (multi ? (value || []).includes(o) : value === o);
  const tog = (o) => {
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
          onClick={() => tog(o)}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: sel(o) ? "700" : "500",
            cursor: "pointer",
            fontFamily: FONT,
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            border: `1.5px solid ${sel(o) ? C.primary : C.border}`,
            background: sel(o) ? C.primary : C.white,
            color: sel(o) ? C.white : C.textMuted,
            boxShadow: sel(o) ? `0 4px 12px ${C.primary}30` : "none",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => {
            if (!sel(o)) {
              e.target.style.borderColor = C.primary;
              e.target.style.background = C.primaryLight;
              e.target.style.color = C.primary;
              e.target.style.transform = "scale(1.03)";
            }
          }}
          onMouseLeave={(e) => {
            if (!sel(o)) {
              e.target.style.borderColor = C.border;
              e.target.style.background = C.white;
              e.target.style.color = C.textMuted;
              e.target.style.transform = "scale(1)";
            }
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
    <div style={{ paddingBottom: "14px", marginBottom: "4px", borderBottom: "2px solid #F7ECB5" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: C.primary, display: "flex" }}>{icon}</span>
        <span style={{ fontSize: "15px", fontWeight: "800", color: C.primary, fontFamily: FONT }}>{title}</span>
      </div>
      {subtitle && <p style={{ margin: "6px 0 0 24px", fontSize: "12px", color: C.textMuted, lineHeight: 1.6, fontFamily: FONT }}>{subtitle}</p>}
    </div>
  );
}

export function InfoBox({ warn = false, children }) {
  return (
    <div style={{ background: warn ? "#FFF4EC" : "#F7ECB5", border: `1px solid ${warn ? "rgba(255,113,0,.35)" : "#C9B94A"}`, borderRadius: "8px", padding: "12px 16px", fontSize: "12px", color: warn ? "#7A3300" : "#7A6200", display: "flex", gap: "8px", alignItems: "flex-start", lineHeight: 1.6, fontFamily: FONT }}>
      <span style={{ display: "flex", marginTop: "1px" }}>{warn ? <Icon.Warning /> : <Icon.Info />}</span>
      <span>{children}</span>
    </div>
  );
}

export function InnerCard({ children, glass = false }) {
  return (
    <div
      {...(glass && { "data-glass": true })}
      style={{
        background: glass ? "rgba(255, 255, 255, 0.15)" : C.neutral,
        borderRadius: "12px",
        padding: "20px",
        border: glass ? "1px solid rgba(255, 255, 255, 0.25)" : `1px solid ${C.border}`,
        ...(glass && { backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }),
      }}
    >
      {children}
    </div>
  );
}

export function FormToggle({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)} style={{ position: "relative", width: "44px", height: "24px", borderRadius: "100px", background: value ? C.primary : C.borderDark, border: "none", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
      <span style={{ position: "absolute", top: "4px", left: value ? "22px" : "4px", width: "16px", height: "16px", borderRadius: "50%", background: C.white, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
    </button>
  );
}

export function FormBtn({ children, onClick, variant = "primary", disabled = false, style = {} }) {
  const variantStyles = {
    primary: {
      bg: C.primary,
      text: C.white,
      hoverBg: "#7C3AED",
      activeBg: "#6D28D9",
      shadow: "0 4px 12px rgba(139, 92, 246, 0.25)",
      hoverShadow: "0 8px 20px rgba(139, 92, 246, 0.35)",
    },
    secondary: {
      bg: C.secondary,
      text: C.white,
      hoverBg: "#EA580C",
      activeBg: "#C2410C",
      shadow: "0 4px 12px rgba(255, 113, 0, 0.25)",
      hoverShadow: "0 8px 20px rgba(255, 113, 0, 0.35)",
    },
    outline: {
      bg: C.white,
      text: C.primary,
      hoverBg: C.primaryLight,
      activeBg: "#EDE9FE",
      shadow: "0 2px 8px rgba(139, 92, 246, 0.15)",
      hoverShadow: "0 4px 12px rgba(139, 92, 246, 0.25)",
    },
  };

  const v = disabled ? { bg: C.borderDark, text: C.textDim, shadow: "none" } : variantStyles[variant];
  const base = {
    padding: "12px 26px",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: FONT,
    fontWeight: "700",
    cursor: disabled ? "not-allowed" : "pointer",
    border: variant === "outline" ? `1.5px solid ${C.primary}` : "none",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    opacity: disabled ? 0.6 : 1,
    transform: "scale(1) translateY(0)",
    boxShadow: v.shadow,
    ...style,
  };

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      style={{
        ...base,
        background: v.bg,
        color: v.text,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.background = v.hoverBg;
          e.target.style.boxShadow = v.hoverShadow;
          e.target.style.transform = "scale(1.02) translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.background = v.bg;
          e.target.style.boxShadow = v.shadow;
          e.target.style.transform = "scale(1) translateY(0)";
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.target.style.background = v.activeBg;
          e.target.style.transform = "scale(0.98) translateY(1px)";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.target.style.background = v.hoverBg;
          e.target.style.transform = "scale(1.02) translateY(-2px)";
        }
      }}
    >
      {children}
    </button>
  );
}
