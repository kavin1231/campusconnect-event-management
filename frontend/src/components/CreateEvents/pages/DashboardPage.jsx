import { useState } from "react";
import { C, FONT, Icon } from "../designSystem";
import { UPCOMING_EVENTS_DASH, RECENT_REQUESTS_DASH, DASH_STATUS_META, DASH_TYPE_COLORS } from "../data";

function DashStatusBadge({ status }) {
  const m = DASH_STATUS_META[status] || DASH_STATUS_META.pending;
  return <span style={{ fontSize: "10px", fontWeight: "700", fontFamily: FONT, padding: "3px 10px", borderRadius: "100px", background: m.bg, color: m.text, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</span>;
}

function DashTypeBadge({ type }) {
  const c = DASH_TYPE_COLORS[type] || { bg: C.primaryLight, text: C.primary };
  return <span style={{ fontSize: "10px", fontWeight: "600", fontFamily: FONT, padding: "3px 9px", borderRadius: "100px", background: c.bg, color: c.text }}>{type}</span>;
}

function StatCard({ label, value, sub, trend, trendUp, icon, accent = false }) {
  return (
    <div style={{ background: accent ? C.primary : C.white, borderRadius: "14px", padding: "22px", border: `1px solid ${accent ? "transparent" : C.border}`, boxShadow: accent ? "0 6px 24px rgba(5,54,104,.2)" : "0 2px 8px rgba(5,54,104,.05)", display: "flex", flexDirection: "column", gap: "12px", flex: 1, minWidth: 0, position: "relative", overflow: "hidden" }}>
      {accent && (<><div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,.05)" }} /><div style={{ position: "absolute", bottom: "-30px", right: "40px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,113,0,.08)" }} /></>)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: accent ? "rgba(255,255,255,.12)" : C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: accent ? C.white : C.primary }}>{icon}</div>
        {trend !== undefined && <div style={{ display: "flex", alignItems: "center", gap: "4px", color: trendUp ? C.success : C.error, fontSize: "11px", fontWeight: "700", fontFamily: FONT }}>{trendUp ? <Icon.ArrowUp size={11} /> : <Icon.ArrowDown size={11} />}{trend}%</div>}
      </div>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: "800", color: accent ? C.white : C.text, fontFamily: FONT, lineHeight: 1 }}>{value}</p>
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
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: "22px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: C.secondary, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>GOOD MORNING</p>
          <h1 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "800", color: C.text, fontFamily: FONT, letterSpacing: "-0.02em" }}>Welcome back, Kavindu 👋</h1>
          <p style={{ margin: 0, fontSize: "13px", color: C.textMuted, fontFamily: FONT }}>You have 2 pending requests and 1 upcoming event this week.</p>
        </div>
        <button onClick={() => onNavigate("create")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 22px", background: C.primary, color: C.white, border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 16px rgba(5,54,104,.25)" }}><Icon.Plus size={15} /> New Event Request</button>
      </div>

      {!dismissed && <div style={{ background: "#FFF4EC", border: `1.5px solid rgba(255,113,0,.4)`, borderRadius: "12px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,113,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", color: C.secondary, flexShrink: 0 }}><Icon.Warning size={18} /></div>
        <div style={{ flex: 1 }}><p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "700", color: "#7A3300", fontFamily: FONT }}>2 Venue Conflicts Detected</p><p style={{ margin: 0, fontSize: "12px", color: "#A05000", fontFamily: FONT }}>Music Night and Charity Gala are both booked at the Open Air Amphitheatre on Apr 20.</p></div>
        <button onClick={() => onNavigate("calendar")} style={{ flexShrink: 0, padding: "8px 16px", background: C.secondary, color: C.white, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}>Resolve Now</button>
        <button onClick={() => setDismissed(true)} style={{ background: "none", border: "none", color: "#A05000", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>×</button>
      </div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        <StatCard label="Total Events" value="12" sub="This semester" trend={18} trendUp={true} icon={<Icon.Calendar size={18} />} accent={true} />
        <StatCard label="Pending Requests" value="2" sub="Awaiting review" trend={0} trendUp={false} icon={<Icon.FileText size={18} />} />
        <StatCard label="Approved Events" value="8" sub="Ready to run" trend={12} trendUp={true} icon={<Icon.Check size={18} />} />
        <StatCard label="Active Conflicts" value="2" sub="Need resolution" trend={100} trendUp={false} icon={<Icon.Conflict size={18} />} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: "20px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(5,54,104,.05)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "700", color: C.text, fontFamily: FONT }}>Upcoming Events</p><p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>Next 4 scheduled events</p></div>
              <button onClick={() => onNavigate("events")} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: "12px", fontWeight: "700", fontFamily: FONT }}>View all <Icon.ChevronRight size={12} /></button>
            </div>
            {UPCOMING_EVENTS_DASH.map((ev, i) => (
              <div key={ev.id} style={{ padding: "12px 20px", borderBottom: i < UPCOMING_EVENTS_DASH.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "46px", borderRadius: "8px", background: C.primaryLight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: "8px", fontWeight: "700", color: C.textMuted, fontFamily: FONT, textTransform: "uppercase" }}>{ev.date.split(" ")[0]}</span>
                  <span style={{ fontSize: "17px", fontWeight: "800", color: C.primary, fontFamily: FONT, lineHeight: 1.1 }}>{ev.date.split(" ")[1].replace(",", "")}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.title}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", color: C.textMuted, fontFamily: FONT }}><Icon.Clock size={11} />{ev.time}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", color: C.textMuted, fontFamily: FONT }}><Icon.MapPin size={11} />{ev.venue}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: 0 }}><DashStatusBadge status={ev.status} /><DashTypeBadge type={ev.type} /></div>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(5,54,104,.05)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "700", color: C.text, fontFamily: FONT }}>Permission Requests</p><p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>Track submitted requests</p></div>
              <button onClick={() => onNavigate("requests")} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: "12px", fontWeight: "700", fontFamily: FONT }}>View all <Icon.ChevronRight size={12} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr", padding: "8px 20px", background: C.neutral, borderBottom: `1px solid ${C.border}` }}>{["Event Title", "Type", "Submitted", "Status"].map((h) => <span key={h} style={{ fontSize: "10px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: FONT }}>{h}</span>)}</div>
            {RECENT_REQUESTS_DASH.map((req, i) => (
              <div key={req.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr", padding: "11px 20px", borderBottom: i < RECENT_REQUESTS_DASH.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
                <div><p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: "600", color: C.text, fontFamily: FONT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "8px" }}>{req.title}</p><span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", color: C.textMuted, fontFamily: FONT }}><Icon.MapPin size={10} />{req.venue}</span></div>
                <DashTypeBadge type={req.type} />
                <span style={{ fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>{req.submitted}</span>
                <DashStatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}><p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>This Week</p><button onClick={() => onNavigate("calendar")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: "11px", fontWeight: "700", fontFamily: FONT }}>Calendar <Icon.ChevronRight size={11} /></button></div>
            <div style={{ padding: "12px 14px", display: "flex", gap: "4px" }}>
              {weekDays.map((d, i) => {
                const isToday = i === 0;
                const hasEvent = EVENT_DAYS.includes(d.getDate());
                return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 0", borderRadius: "8px", background: isToday ? C.primary : "transparent" }}><span style={{ fontSize: "8px", fontWeight: "600", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em", color: isToday ? "rgba(255,255,255,.6)" : C.textDim }}>{dayNames[d.getDay()]}</span><span style={{ fontSize: "14px", fontWeight: "800", fontFamily: FONT, color: isToday ? C.white : C.text }}>{d.getDate()}</span>{hasEvent ? <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: isToday ? C.secondary : C.primary }} /> : <span style={{ width: "4px", height: "4px" }} />}</div>;
              })}
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "16px", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
            <p style={{ margin: "0 0 3px", fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>This Month</p>
            <p style={{ margin: "0 0 14px", fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>March 2026 · 5 requests</p>
            {[{ label: "Events Approved", value: 3, total: 5, color: C.success }, { label: "Pending Review", value: 1, total: 5, color: "#D97706" }, { label: "Conflicts", value: 2, total: 5, color: C.secondary }].map((s) => (
              <div key={s.label} style={{ marginBottom: "12px" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><span style={{ fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>{s.label}</span><span style={{ fontSize: "11px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{s.value}/{s.total}</span></div><div style={{ background: C.border, borderRadius: "100px", height: "4px", overflow: "hidden" }}><div style={{ height: "100%", width: `${(s.value / s.total) * 100}%`, background: s.color, borderRadius: "100px" }} /></div></div>
            ))}
          </div>

          <div onClick={() => onNavigate("merch")} style={{ background: `linear-gradient(135deg, #0a4f96 0%, ${C.primary} 100%)`, borderRadius: "14px", padding: "18px", cursor: "pointer", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-15px", right: "-15px", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}><div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", color: C.white }}><Icon.ShoppingBag size={14} /></div><p style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: C.white, fontFamily: FONT }}>Merch & Orders</p></div>
            <p style={{ margin: "0 0 12px", fontSize: "11px", color: "rgba(255,255,255,.6)", fontFamily: FONT }}>Manage merchandise, tickets, and student fulfillment.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: C.secondary, fontSize: "12px", fontWeight: "700", fontFamily: FONT }}><Icon.ChevronRight size={12} /> Open Store</div>
          </div>
        </div>
      </div>
    </div>
  );
}
