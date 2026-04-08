import { useState } from "react";
import { C, FONT, Icon } from "./designSystem";
import styles from "./SidebarFull.module.css";

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
    <div className={styles.sidebar} style={{ width: open ? "216px" : "60px", background: C.neutral }}>
      <div className={`${styles.sidebarHeader} ${open ? styles.sidebarHeaderOpen : styles.sidebarHeaderClosed}`} style={{ borderColor: C.border }}>
        {open && (
          <div className={styles.sidebarTitle}>
            <p className={styles.sidebarTitleMain} style={{ color: C.primary }}>Event Manager</p>
            <p className={styles.sidebarTitleSub} style={{ color: C.textMuted }}>University Logistics</p>
          </div>
        )}
        <button onClick={() => setOpen((o) => !o)} className={styles.toggleBtn} style={{ background: C.white, color: C.text }}>
          <span>{open ? "<" : ">"}</span>
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ key, icon, label, highlight }) => {
          const isActive = activePage === key;
          return (
            <div
              key={key}
              title={!open ? label : undefined}
              onClick={() => onNavigate(key)}
              className={`${styles.navItem} ${open ? styles.navItemOpen : styles.navItemClosed} ${isActive ? styles.navItemActive : ""}`}
              style={{
                background: isActive ? C.white : highlight ? C.primaryLight : "transparent",
                border: highlight && !isActive ? `1px solid ${C.primary}` : "1px solid transparent",
              }}
            >
              {isActive && <div style={{ background: C.primary }} />}
              <span className={styles.navItemIcon} style={{ color: highlight ? C.primary : isActive ? C.text : C.textMuted }}>{icon}</span>
              {open && <span className={styles.navItemText} style={{ fontWeight: isActive || highlight ? "700" : "500", color: highlight ? C.primary : isActive ? C.text : C.text }}>{label}</span>}
              {open && highlight && <span className={styles.navItemAccent} style={{ background: C.primaryLight, color: C.white }}>NEW</span>}
            </div>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter} style={{ borderColor: C.border }}>
        <div className={styles.sidebarFooterContent}>
          <button className={`${styles.signoutBtn} ${!open ? styles.signoutBtnClosed : ""}`} style={{ color: C.textMuted }}>
            <span className={styles.signoutIcon}><Icon.LogOut /></span>
            {open && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
