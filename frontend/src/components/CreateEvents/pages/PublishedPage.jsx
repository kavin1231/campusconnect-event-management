import { useState } from "react";
import { C, FONT, Icon, StatusBadge, TypeBadge, Card, SectionHead } from "../designSystem";
import { getEventImage } from "../imageUtils";

export default function PublishedPage({ event, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const totalRevenue = event.revenue;
  const registrationPct = Math.round((event.registered / event.capacity) * 100);
  const TABS = [{ key: "overview", label: "Overview" }, { key: "orders", label: "Orders" }, { key: "analytics", label: "Analytics" }];

  const mockOrders = [
    { id: "ORD-001", name: "Ashan Fernando", item: "General Admission", qty: 2, amount: 0, status: "confirmed", date: "Mar 10" },
    { id: "ORD-002", name: "Dilani Perera", item: "VIP Access", qty: 1, amount: 1500, status: "confirmed", date: "Mar 11" },
    { id: "ORD-003", name: "Kavinda Rajapaksa", item: "IEEE T-Shirt", qty: 1, amount: 750, status: "confirmed", date: "Mar 12" },
    { id: "ORD-004", name: "Nadeesha Silva", item: "General Admission", qty: 1, amount: 0, status: "confirmed", date: "Mar 13" },
    { id: "ORD-005", name: "Thisara Bandara", item: "General Admission", qty: 3, amount: 0, status: "confirmed", date: "Mar 14" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: FONT }}>
      <div style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 100%), url('${getEventImage(event.id, "Conference")}')`, backgroundSize: "cover", backgroundPosition: "center", padding: "24px 36px", flexShrink: 0, position: "relative", overflow: "hidden", minHeight: "280px" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.15)", border: "none", cursor: "pointer", color: "rgba(255,255,255,.9)", fontSize: "12px", fontWeight: "600", padding: "6px 12px", borderRadius: "6px", marginBottom: "14px", backdropFilter: "blur(8px)" }}>
          <Icon.ArrowLeft size={14} /> My Events
        </button>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", position: "relative", zIndex: 10 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: "100px", padding: "6px 14px", marginBottom: "12px", backdropFilter: "blur(8px)" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "block" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,.95)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Published • Live</span>
            </div>
            <h1 style={{ margin: "0 0 6px", fontSize: "32px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{event.title}</h1>
            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,.9)", textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>{event.date} • {event.venue}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: "14px", padding: "16px 24px", textAlign: "center", flexShrink: 0, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#4ade80", lineHeight: 1 }}>{registrationPct}%</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "6px 0 10px", fontWeight: "600" }}>Registered</div>
            <div style={{ background: "rgba(255,255,255,.15)", borderRadius: "100px", height: "5px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${registrationPct}%`, background: "#4ade80", borderRadius: "100px", transition: "width 0.3s ease" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "2px", marginTop: "20px" }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 18px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: activeTab === tab.key ? "700" : "500", background: activeTab === tab.key ? C.white : "rgba(255,255,255,.08)", color: activeTab === tab.key ? C.success : "rgba(255,255,255,.6)" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px", display: "flex", flexDirection: "column", gap: "20px", background: C.neutral }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {[
          { label: "Registered", value: event.registered, sub: `of ${event.capacity} capacity`, color: C.primary, icon: <Icon.Users size={16} />, bg: C.primaryLight },
          { label: "Registration", value: `${registrationPct}%`, sub: "capacity filled", color: C.success, icon: <Icon.BarChart size={16} />, bg: C.successLight },
          { label: "Total Orders", value: event.orders, sub: "across all items", color: C.primary, icon: <Icon.Package size={16} />, bg: C.primaryLight },
          { label: "Revenue (LKR)", value: totalRevenue.toLocaleString(), sub: "total collected", color: C.warning, icon: <Icon.Tag size={16} />, bg: C.warningLight },
        ].map((s) => (
          <div key={s.label} style={{ background: C.white, borderRadius: "12px", padding: "18px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(5,54,104,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: C.text, fontFamily: FONT, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: C.text, fontFamily: FONT, marginTop: "4px" }}>{s.label}</div>
            <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <Card>
            <SectionHead label="Ticket Performance" />
            {event.tickets.map((t, i) => (
              <div key={i} style={{ marginBottom: i < event.tickets.length - 1 ? "16px" : "0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>{t.price === 0 ? "Free" : `LKR ${t.price.toLocaleString()}`}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{t.sold} / {t.inventory}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: C.success, fontFamily: FONT, fontWeight: "600" }}>{Math.round((t.sold / t.inventory) * 100)}% sold</p>
                  </div>
                </div>
                <div style={{ background: C.border, borderRadius: "100px", height: "5px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(t.sold / t.inventory) * 100}%`, background: t.price === 0 ? C.primary : C.secondary, borderRadius: "100px" }} />
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <SectionHead label="Merchandise" />
            {event.merch.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: C.textDim }}>
                <p style={{ margin: 0, fontSize: "13px", fontFamily: FONT }}>No merchandise for this event.</p>
              </div>
            ) : event.merch.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: i < event.merch.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary, flexShrink: 0 }}><Icon.Package size={14} /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{m.name}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>LKR {m.price.toLocaleString()} · {m.sold} sold</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: "700", color: C.success, fontFamily: FONT }}>LKR {(m.price * m.sold).toLocaleString()}</p>
                  <span style={{ fontSize: "10px", fontFamily: FONT, padding: "2px 8px", borderRadius: "100px", background: m.enabled ? C.successLight : C.neutral, color: m.enabled ? C.success : C.textMuted, fontWeight: "600" }}>{m.enabled ? "Active" : "Paused"}</span>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <SectionHead label="Attendance" />
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ position: "relative", width: "90px", height: "90px", flexShrink: 0 }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke={C.border} strokeWidth="8" />
                  <circle cx="45" cy="45" r="38" fill="none" stroke={C.success} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 38}`} strokeDashoffset={`${2 * Math.PI * 38 * (1 - registrationPct / 100)}`} strokeLinecap="round" transform="rotate(-90 45 45)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: C.text, fontFamily: FONT, lineHeight: 1 }}>{registrationPct}%</span>
                  <span style={{ fontSize: "9px", color: C.textMuted, fontFamily: FONT }}>filled</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {[["Registered", event.registered, C.success], ["Remaining", event.capacity - event.registered, C.textMuted]].map(([label, val, col]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT }}>{label}</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: col, fontFamily: FONT }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT }}>Total Capacity</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{event.capacity}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHead label="Event Details" />
            <p style={{ margin: "0 0 14px", fontSize: "13px", color: C.textMuted, fontFamily: FONT, lineHeight: 1.8 }}>{event.description}</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <TypeBadge type={event.type} />
                <span style={{ fontSize: "10px", fontFamily: FONT, padding: "3px 9px", borderRadius: "100px", background: C.primaryLight, color: C.text, fontWeight: "600" }}>{event.category}</span>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "orders" && (
        <Card pad="0">
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>Recent Orders</h3>
            <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT }}>{mockOrders.length} orders shown</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 0.8fr 1fr 1fr", padding: "10px 20px", background: C.neutral, borderBottom: `1px solid ${C.border}` }}>
            {["Attendee", "Item", "Qty", "Amount", "Date"].map((h) => <span key={h} style={{ fontSize: "10px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: FONT }}>{h}</span>)}
          </div>
          {mockOrders.map((o, i) => (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 0.8fr 1fr 1fr", padding: "13px 20px", borderBottom: i < mockOrders.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "600", color: C.text, fontFamily: FONT }}>{o.name}</p>
                <p style={{ margin: 0, fontSize: "10px", color: C.textDim, fontFamily: FONT }}>{o.id}</p>
              </div>
              <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT }}>{o.item}</span>
              <span style={{ fontSize: "12px", color: C.text, fontFamily: FONT, fontWeight: "600" }}>×{o.qty}</span>
              <span style={{ fontSize: "12px", color: C.text, fontFamily: FONT, fontWeight: "700" }}>{o.amount === 0 ? "Free" : `LKR ${o.amount.toLocaleString()}`}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", background: C.successLight, color: C.success, padding: "2px 8px", borderRadius: "100px", fontFamily: FONT }}>{o.status}</span>
              </div>
            </div>
          ))}
        </Card>
      )}

      {activeTab === "analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { label: "Registrations this week", value: 47, sub: "+12% vs last week", color: C.success, chart: [20, 35, 28, 47, 40, 47, 47] },
            { label: "Page Views", value: "1,284", sub: "Since published", color: C.primary, chart: [180, 220, 290, 310, 280, 340, 400] },
            { label: "Conversion Rate", value: "22.3%", sub: "Views -> Registrations", color: C.secondary, chart: [18, 20, 22, 19, 23, 21, 22] },
          ].map((s) => (
            <Card key={s.label}>
              <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>{s.label}</p>
              <p style={{ margin: "0 0 2px", fontSize: "28px", fontWeight: "800", color: C.text, fontFamily: FONT, lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: "0 0 16px", fontSize: "11px", color: s.color, fontWeight: "600", fontFamily: FONT }}>{s.sub}</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "48px" }}>
                {s.chart.map((v, i) => {
                  const max = Math.max(...s.chart);
                  return <div key={i} style={{ flex: 1, background: i === s.chart.length - 1 ? s.color : s.color + "30", borderRadius: "3px 3px 0 0", height: `${(v / max) * 100}%`, transition: "height .3s" }} />;
                })}
              </div>
            </Card>
          ))}
          <Card style={{ gridColumn: "span 3" }}>
            <SectionHead label="Revenue Breakdown" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
              {[
                { label: "Ticket Revenue", value: event.tickets.reduce((a, t) => a + t.price * t.sold, 0), color: C.primary },
                { label: "Merch Revenue", value: event.merch.reduce((a, m) => a + m.price * m.sold, 0), color: C.secondary },
                { label: "Total Revenue", value: event.revenue, color: C.success },
                { label: "Avg. Order Value", value: event.orders > 0 ? Math.round(event.revenue / event.orders) : 0, color: C.warning },
              ].map((s) => (
                <div key={s.label} style={{ background: C.neutral, borderRadius: "10px", padding: "16px", border: `1px solid ${C.border}` }}>
                  <p style={{ margin: "0 0 6px", fontSize: "11px", color: C.textMuted, fontFamily: FONT, fontWeight: "600" }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: s.color, fontFamily: FONT }}>LKR {s.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
