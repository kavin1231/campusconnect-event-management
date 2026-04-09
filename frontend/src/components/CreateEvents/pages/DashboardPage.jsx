import { useState } from "react";
import { C, FONT, Icon } from "../designSystem";
import { UPCOMING_EVENTS_DASH, RECENT_REQUESTS_DASH, DASH_STATUS_META, DASH_TYPE_COLORS } from "../data";
import { getEventImage } from "../imageUtils";
import styles from "./DashboardPage.module.css";

function DashStatusBadge({ status }) {
  const m = DASH_STATUS_META[status] || DASH_STATUS_META.pending;
  return <span style={{ fontSize: "10px", fontWeight: "700", fontFamily: FONT, padding: "4px 10px", borderRadius: "6px", background: m.bg, color: m.text, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em", border: `1px solid ${m.bg}` }}>{m.label}</span>;
}

function DashTypeBadge({ type }) {
  const c = DASH_TYPE_COLORS[type] || { bg: C.primaryLight, text: C.primary };
  return <span style={{ fontSize: "10px", fontWeight: "600", fontFamily: FONT, padding: "4px 9px", borderRadius: "6px", background: c.bg, color: c.text }}>{type}</span>;
}

function StatCard({ label, value, sub, trend, trendUp, icon, accent = false }) {
  return (
    <div style={{ background: accent ? C.primary : C.white, borderRadius: "12px", padding: "20px", border: `1px solid ${accent ? "transparent" : C.border}`, display: "flex", flexDirection: "column", gap: "12px", flex: 1, minWidth: 0, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: accent ? "rgba(255,255,255,.12)" : C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: accent ? C.white : C.primary }}>{icon}</div>
        {trend !== undefined && <div style={{ display: "flex", alignItems: "center", gap: "4px", color: trendUp ? C.success : C.error, fontSize: "11px", fontWeight: "700", fontFamily: FONT }}>{trendUp ? <Icon.ArrowUp size={11} /> : <Icon.ArrowDown size={11} />}{trend}%</div>}
      </div>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "800", color: accent ? C.white : C.text, fontFamily: FONT, lineHeight: 1 }}>{value}</p>
        <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: "600", color: accent ? "rgba(255,255,255,.8)" : C.text, fontFamily: FONT }}>{label}</p>
        {sub && <p style={{ margin: 0, fontSize: "11px", color: accent ? "rgba(255,255,255,.5)" : C.textMuted, fontFamily: FONT }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage({ onNavigate }) {
  const [dismissed, setDismissed] = useState(false);
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
  const EVENT_DAYS = [today.getDate(), today.getDate() + 2, today.getDate() + 5];

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <p className={styles.headerSubtitle} style={{ color: C.secondary }}>GOOD MORNING</p>
          <h1 className={styles.headerTitle} style={{ color: C.text }}>Welcome back, Kavindu 👋</h1>
          <p className={styles.headerDescription} style={{ color: C.textMuted }}>You have 2 pending requests and 1 upcoming event this week.</p>
        </div>
        <button onClick={() => onNavigate("create")} className={styles.newEventBtn} style={{ background: C.primary, color: C.white }}><Icon.Plus size={15} /> New Event Request</button>
      </div>

      {!dismissed && <div className={styles.alertBox}>
        <div className={styles.alertIcon} style={{ color: C.secondary }}><Icon.Warning size={18} /></div>
        <div className={styles.alertContent}>
          <p className={styles.alertTitle}>2 Venue Conflicts Detected</p>
          <p className={styles.alertMessage}>Music Night and Charity Gala are both booked at the Open Air Amphitheatre on Apr 20.</p>
        </div>
        <div className={styles.alertButtons}>
          <button onClick={() => onNavigate("calendar")} className={styles.alertBtn + " " + styles.alertBtnResolve}>Resolve Now</button>
          <button onClick={() => setDismissed(true)} className={styles.alertBtn + " " + styles.alertBtnClose}>×</button>
        </div>
      </div>}

      <div className={styles.statsGrid}>
        <StatCard label="Total Events" value="12" sub="This semester" trend={18} trendUp={true} icon={<Icon.Calendar size={18} />} accent={true} />
        <StatCard label="Pending Requests" value="2" sub="Awaiting review" trend={0} trendUp={false} icon={<Icon.FileText size={18} />} />
        <StatCard label="Approved Events" value="8" sub="Ready to run" trend={12} trendUp={true} icon={<Icon.Check size={18} />} />
        <StatCard label="Active Conflicts" value="2" sub="Need resolution" trend={100} trendUp={false} icon={<Icon.Conflict size={18} />} />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.mainContent}>
          <div className={styles.cardContainer} style={{ borderColor: C.border }}>
            <div className={styles.cardHeader} style={{ borderColor: C.border }}>
              <div>
                <p className={styles.cardTitle} style={{ color: C.text }}>Upcoming Events</p>
                <p className={styles.cardSubtitle} style={{ color: C.textMuted }}>Next 4 scheduled events</p>
              </div>
              <button onClick={() => onNavigate("events")} className={styles.cardHeaderBtn} style={{ color: C.primary }}>View all <Icon.ChevronRight size={12} /></button>
            </div>
            {UPCOMING_EVENTS_DASH.map((ev, i) => (
              <div key={ev.id} className={styles.eventItem} style={{ borderColor: i < UPCOMING_EVENTS_DASH.length - 1 ? C.border : "transparent" }}>
                <div className={styles.eventImage} style={{ borderColor: C.border }}>
                  <img src={getEventImage(ev.id, ev.type)} alt={ev.title} onError={(e) => { e.target.style.opacity = "0.2"; }} />
                </div>
                <div className={styles.eventContent}>
                  <p className={styles.eventTitle} style={{ color: C.text }}>{ev.title}</p>
                  <div className={styles.eventMeta}>
                    <span className={styles.eventMetaItem} style={{ color: C.textMuted }}><Icon.Clock size={11} />{ev.time}</span>
                    <span className={styles.eventMetaItem} style={{ color: C.textMuted }}><Icon.MapPin size={11} />{ev.venue}</span>
                  </div>
                </div>
                <div className={styles.eventBadges}><DashStatusBadge status={ev.status} /><DashTypeBadge type={ev.type} /></div>
              </div>
            ))}
          </div>

          <div className={styles.cardContainer} style={{ borderColor: C.border }}>
            <div className={styles.cardHeader} style={{ borderColor: C.border }}>
              <div>
                <p className={styles.cardTitle} style={{ color: C.text }}>Permission Requests</p>
                <p className={styles.cardSubtitle} style={{ color: C.textMuted }}>Track submitted requests</p>
              </div>
              <button onClick={() => onNavigate("requests")} className={styles.cardHeaderBtn} style={{ color: C.primary }}>View all <Icon.ChevronRight size={12} /></button>
            </div>
            <div className={styles.tableHeader} style={{ background: C.neutral, borderColor: C.border }}>{["Event Title", "Type", "Submitted", "Status"].map((h) => <span key={h} className={styles.tableHeaderCell} style={{ color: C.textMuted }}>{h}</span>)}</div>
            {RECENT_REQUESTS_DASH.map((req, i) => (
              <div key={req.id} className={styles.tableRow} style={{ borderColor: i < RECENT_REQUESTS_DASH.length - 1 ? C.border : "transparent" }}>
                <div>
                  <p className={styles.tableRequestTitle} style={{ color: C.text }}>{req.title}</p>
                  <span className={styles.tableRequestVenue} style={{ color: C.textMuted }}><Icon.MapPin size={10} />{req.venue}</span>
                </div>
                <DashTypeBadge type={req.type} />
                <span className={styles.tableRequestDate} style={{ color: C.textMuted }}>{req.submitted}</span>
                <DashStatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.weekWidget} style={{ borderColor: C.border }}>
            <div className={styles.weekWidgetHeader} style={{ borderColor: C.border }}>
              <p className={styles.weekWidgetTitle} style={{ color: C.text }}>This Week</p>
              <button onClick={() => onNavigate("calendar")} className={styles.cardHeaderBtn} style={{ color: C.primary }}>Calendar <Icon.ChevronRight size={11} /></button>
            </div>
            <div className={styles.weekDays}>
              {weekDays.map((d, i) => {
                const isToday = i === 0;
                const hasEvent = EVENT_DAYS.includes(d.getDate());
                return <div key={i} className={styles.dayColumn} style={{ background: isToday ? C.primary : "transparent" }}>
                  <span className={styles.dayColumnLabel} style={{ color: isToday ? "rgba(255,255,255,.6)" : C.textDim }}>{dayNames[d.getDay()]}</span>
                  <span className={styles.dayColumnDate} style={{ color: isToday ? C.white : C.text }}>{d.getDate()}</span>
                  {hasEvent ? <span className={styles.dayIndicator} style={{ background: isToday ? C.secondary : C.primary }} /> : <span className={styles.dayIndicator} />}
                </div>;
              })}
            </div>
          </div>

          <div className={styles.monthWidget} style={{ borderColor: C.border }}>
            <p className={styles.monthWidgetTitle} style={{ color: C.text }}>This Month</p>
            <p className={styles.monthWidgetSubtitle} style={{ color: C.textMuted }}>March 2026 · 5 requests</p>
            {[{ label: "Events Approved", value: 3, total: 5, color: C.success }, { label: "Pending Review", value: 1, total: 5, color: "#D97706" }, { label: "Conflicts", value: 2, total: 5, color: C.secondary }].map((s) => (
              <div key={s.label} className={styles.statItem}>
                <div className={styles.statLabel}>
                  <span className={styles.statLabelText} style={{ color: C.textMuted }}>{s.label}</span>
                  <span className={styles.statValue} style={{ color: C.text }}>{s.value}/{s.total}</span>
                </div>
                <div className={styles.statBar} style={{ borderColor: C.border }}>
                  <div className={styles.statFill} style={{ width: `${(s.value / s.total) * 100}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          <div onClick={() => onNavigate("merch")} className={styles.merchWidget} style={{ background: `linear-gradient(135deg, #0a4f96 0%, ${C.primary} 100%)` }}>
            <div className={styles.merchOverlay} />
            <div className={styles.merchContent}>
              <div className={styles.merchHeader}>
                <div className={styles.merchIcon} style={{ color: C.white }}><Icon.ShoppingBag size={14} /></div>
                <p className={styles.merchTitle}>Merch & Orders</p>
              </div>
              <p className={styles.merchDescription}>Manage merchandise, tickets, and student fulfillment.</p>
              <div className={styles.merchLink} style={{ color: C.secondary }}><Icon.ChevronRight size={12} /> Open Store</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
