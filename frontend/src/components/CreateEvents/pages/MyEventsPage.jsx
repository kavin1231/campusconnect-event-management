import { useState } from "react";
import { C, FONT, Icon, StatusBadge, TypeBadge } from "../designSystem";
import { getEventImage } from "../imageUtils";

export default function MyEventsPage({ events, onSelectEvent, onNavigate }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = events.filter((e) => {
    const matchStatus = filter === "all" || e.status === filter;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: C.secondary, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>ORGANIZER PORTAL</p>
          <h1 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: "800", color: C.text, fontFamily: FONT, letterSpacing: "-0.03em", lineHeight: 1.1 }}>My Events</h1>
          <p style={{ margin: 0, fontSize: "13px", color: C.textMuted, fontFamily: FONT }}>Track and manage all events you have created and submitted.</p>
        </div>
        <button onClick={() => onNavigate("create")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 22px", background: C.primary, color: C.white, border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}>
          <Icon.Plus size={15} /> New Event Request
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: "8px", padding: "8px 14px", flex: 1, maxWidth: "360px" }}>
          <span style={{ color: C.textDim, display: "flex" }}><Icon.Search /></span>
          <input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: "none", outline: "none", fontSize: "13px", fontFamily: FONT, color: C.text, background: "transparent", width: "100%" }} />
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["all", "pending", "approved", "published"].map((k) => (
            <button key={k} onClick={() => setFilter(k)} style={{ padding: "7px 14px", borderRadius: "7px", fontSize: "12px", fontFamily: FONT, cursor: "pointer", fontWeight: filter === k ? "700" : "500", border: `1.5px solid ${filter === k ? C.primary : C.border}`, background: filter === k ? C.primaryLight : C.white, color: filter === k ? C.primary : C.textMuted }}>
              {k[0].toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "18px" }}>
        {filtered.map((ev) => (
          <div key={ev.id} onClick={() => onSelectEvent(ev)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: "160px", background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, position: "relative", overflow: "hidden" }}>
              <img src={getEventImage(ev.id, ev.type)} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.opacity = "0.2"; }} />
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "6px" }}>
                <TypeBadge type={ev.type} />
              </div>
              <div style={{ position: "absolute", top: "10px", left: "10px", background: C.white, padding: "6px 12px", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" }}>
                <span style={{ fontSize: "9px", fontWeight: "700", color: C.textMuted, fontFamily: FONT, textTransform: "uppercase" }}>{ev.date.split(" ")[0]}</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: C.primary, fontFamily: FONT, lineHeight: 1 }}>{ev.date.split(" ")[1].replace(",", "")}</span>
              </div>
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{ev.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: C.textMuted, fontFamily: FONT, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Icon.Clock size={11} />{ev.time}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Icon.MapPin size={11} />{ev.venue}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <StatusBadge status={ev.status} />
                <span style={{ color: C.textDim }}><Icon.ChevronRight size={16} /></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
