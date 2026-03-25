// SVG Icon System
function Ic({ size = 16, sw = "1.75", children, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...style }}>
      {children}
    </svg>
  );
}

export const Icon = {
  Logo:         ({ size = 18 } = {}) => <Ic size={size}><path d="M12 3L2 8l10 5 10-5-10-5z" /><path d="M2 13l10 5 10-5" /><path d="M2 18l10 5 10-5" /></Ic>,
  Search:       ({ size = 15 } = {}) => <Ic size={size}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M16.5 16.5L21 21" /></Ic>,
  Bell:         ({ size = 16 } = {}) => <Ic size={size}><path d="M6 8a6 6 0 0 1 12 0c0 5 2.5 7 2.5 7H3.5S6 13 6 8z" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Ic>,
  ChevronLeft:  ({ size = 14 } = {}) => <Ic size={size} sw="2.25"><path d="M15 18l-6-6 6-6" /></Ic>,
  ChevronRight: ({ size = 14 } = {}) => <Ic size={size} sw="2.25"><path d="M9 18l6-6-6-6" /></Ic>,
  ChevronDown:  ({ size = 12 } = {}) => <Ic size={size} sw="2.25"><path d="M6 9l6 6 6-6" /></Ic>,
  X:            ({ size = 14 } = {}) => <Ic size={size} sw="2.25"><path d="M18 6L6 18M6 6l12 12" /></Ic>,
  Check:        ({ size = 20 } = {}) => <Ic size={size} sw="2.25"><path d="M20 6L9 17l-5-5" /></Ic>,
  Filter:       ({ size = 14 } = {}) => <Ic size={size}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></Ic>,
  Grid:         ({ size = 16 } = {}) => <Ic size={size}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Ic>,
  CalendarView: ({ size = 16 } = {}) => <Ic size={size}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></Ic>,
  Calendar:     ({ size = 15 } = {}) => <Ic size={size}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Ic>,
  Pin:          ({ size = 16 } = {}) => <Ic size={size}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></Ic>,
  Users:        ({ size = 16 } = {}) => <Ic size={size}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Ic>,
  Conflict:     ({ size = 16 } = {}) => <Ic size={size}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><circle cx="12" cy="17" r=".5" fill="currentColor" /></Ic>,
  Plus:         ({ size = 16 } = {}) => <Ic size={size} sw="2.25"><path d="M12 5v14M5 12h14" /></Ic>,
  FileText:     ({ size = 16 } = {}) => <Ic size={size}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></Ic>,
  Venue:        ({ size = 16 } = {}) => <Ic size={size}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></Ic>,
  Finance:      ({ size = 16 } = {}) => <Ic size={size}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Ic>,
  Shield:       ({ size = 16 } = {}) => <Ic size={size}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ic>,
  Review:       ({ size = 16 } = {}) => <Ic size={size}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Ic>,
  Warning:      ({ size = 15 } = {}) => <Ic size={size}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><circle cx="12" cy="17" r=".5" fill="currentColor" /></Ic>,
  Info:         ({ size = 15 } = {}) => <Ic size={size}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r=".5" fill="currentColor" /></Ic>,
  AlertCircle:  ({ size = 14 } = {}) => <Ic size={size}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r=".5" fill="currentColor" /></Ic>,
  Save:         ({ size = 14 } = {}) => <Ic size={size}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></Ic>,
  Building:     ({ size = 14 } = {}) => <Ic size={size}><path d="M3 22V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" /><path d="M2 22h20M9 22V12h6v10M9 7h.01M12 7h.01M15 7h.01" /></Ic>,
  Capacity:     ({ size = 14 } = {}) => <Ic size={size}><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" /></Ic>,
  Tag:          ({ size = 14 } = {}) => <Ic size={size}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></Ic>,
  Bot:          ({ size = 16 } = {}) => <Ic size={size}><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M12 8V4" /><circle cx="12" cy="4" r="1" /><path d="M9 13v2M15 13v2M1 13h2M21 13h2" /></Ic>,
  Flash:        ({ size = 12 } = {}) => <Ic size={size} sw="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Ic>,
  User:         ({ size = 16 } = {}) => <Ic size={size}><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></Ic>,
  ArrowUp:      ({ size = 11 } = {}) => <Ic size={size} sw="2.5"><path d="M18 15l-6-6-6 6" /></Ic>,
  ArrowDown:    ({ size = 11 } = {}) => <Ic size={size} sw="2.5"><path d="M6 9l6 6 6-6" /></Ic>,
  LogOut:       ({ size = 15 } = {}) => <Ic size={size}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Ic>,
  Clock:        ({ size = 11 } = {}) => <Ic size={size}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Ic>,
  MapPin:       ({ size = 11 } = {}) => <Ic size={size}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Ic>,
  Settings:     ({ size = 16 } = {}) => <Ic size={size}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Ic>,
};
