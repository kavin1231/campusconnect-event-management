import { useState } from "react";
import { C, FONT, Icon } from "../designSystem";
import { CUR_YEAR, CUR_MONTH, MONTH_NAMES, WEEK_DAYS, CAL_EVENTS, CONFLICTS_DATA, CAL_TYPE_COLORS, VENUE_NAMES_CAL } from "../data";

const TODAY_D = new Date();

export default function CalendarPage({ onBack }) {
  const [year, setYear] = useState(CUR_YEAR);
  const [month, setMonth] = useState(CUR_MONTH);
  const [selEvent, setSelEvent] = useState(null);
  const [venueFilter, setVF] = useState(null);

  const prevMonth = () => (month === 0 ? (setYear((y) => y - 1), setMonth(11)) : setMonth((m) => m - 1));
  const nextMonth = () => (month === 11 ? (setYear((y) => y + 1), setMonth(0)) : setMonth((m) => m + 1));

  const days = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const todayD = TODAY_D.getFullYear() === year && TODAY_D.getMonth() === month ? TODAY_D.getDate() : -1;
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: C.text, margin: "0 0 4px", fontFamily: FONT, letterSpacing: "-0.02em" }}>Academic Calendar</h1>
            <p style={{ fontSize: "13px", color: C.secondary, margin: 0, fontFamily: FONT, fontWeight: "600" }}>Scheduling & conflict detection for {MONTH_NAMES[month]} {year}.</p>
          </div>
          <button onClick={onBack} style={{ padding: "9px 18px", background: C.primaryLight, color: C.primary, border: `1px solid ${C.border}`, borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}>← Back</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={prevMonth} style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <span style={{ fontSize: "14px", fontWeight: "700", color: C.text, minWidth: "140px", textAlign: "center", fontFamily: FONT }}>{MONTH_NAMES[month]} {year}</span>
            <button onClick={nextMonth} style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </div>
          <button onClick={() => { setYear(CUR_YEAR); setMonth(CUR_MONTH); }} style={{ padding: "6px 14px", background: C.white, color: C.primary, border: `1px solid ${C.border}`, borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}>Today</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: "11px", color: C.textDim, fontFamily: FONT }}>{Object.values(CAL_EVENTS).flat().length} events · <span style={{ color: C.secondary, fontWeight: "700" }}>{CONFLICTS_DATA.length} conflicts</span></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {[ ["Approved", C.primary], ["Conflict", C.secondary], ["Workshop", "#059669"], ["Cultural", "#D97706"] ].map(([l, col]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: col }} />
              <span style={{ fontSize: "11px", color: C.textMuted, fontFamily: FONT, fontWeight: "500" }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: C.textMuted, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>Filter:</span>
          {VENUE_NAMES_CAL.map((v) => (
            <button key={v} onClick={() => setVF(v === "All Venues" ? null : v)} style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontFamily: FONT, cursor: "pointer", fontWeight: (v === "All Venues" && !venueFilter) || venueFilter === v ? "700" : "400", border: "1.5px solid", borderColor: (v === "All Venues" && !venueFilter) || venueFilter === v ? C.primary : C.border, background: (v === "All Venues" && !venueFilter) || venueFilter === v ? C.primaryLight : C.white, color: (v === "All Venues" && !venueFilter) || venueFilter === v ? C.primary : C.textMuted, flexShrink: 0, whiteSpace: "nowrap" }}>{v}</button>
          ))}
        </div>

        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: "4px" }}>
            {WEEK_DAYS.map((d) => <div key={d} style={{ textAlign: "center", padding: "7px 4px", fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>{d}</div>)}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", marginBottom: "2px" }}>
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di];
                const raw = day ? CAL_EVENTS[day] || [] : [];
                const evts = venueFilter ? raw.filter((e) => e.venue === venueFilter) : raw;
                const hasCon = evts.some((e) => e.conflict);
                const isToday = day === todayD;

                return (
                  <div key={di} style={{ minHeight: "82px", padding: "5px", border: `1px solid ${C.border}`, borderRadius: "5px", cursor: day ? "pointer" : "default", background: day ? C.white : C.neutral, opacity: day ? 1 : 0.3, transition: "all .15s" }} onMouseEnter={(e) => { if (day) e.currentTarget.style.borderColor = C.primary + "60"; }} onMouseLeave={(e) => { if (day) e.currentTarget.style.borderColor = C.border; }}>
                    {day && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
                          <span style={{ fontSize: "12px", fontWeight: isToday ? "800" : "600", fontFamily: FONT, width: isToday ? "22px" : "auto", height: isToday ? "22px" : "auto", background: isToday ? C.primary : "transparent", color: isToday ? C.white : hasCon ? C.secondary : C.text, borderRadius: isToday ? "50%" : "0", display: "flex", alignItems: "center", justifyContent: "center" }}>{day}</span>
                          {hasCon && <span style={{ fontSize: "8px", background: "#FFF4EC", color: C.secondary, padding: "1px 4px", borderRadius: "100px", fontWeight: "700", fontFamily: FONT }}>!</span>}
                        </div>

                        {evts.slice(0, 2).map((ev, ei) => {
                          const col = CAL_TYPE_COLORS[ev.type] || { bg: C.primaryLight, text: C.primary, dot: C.primary };
                          return <div key={ei} onClick={(e) => { e.stopPropagation(); setSelEvent(ev); }} style={{ background: ev.conflict ? "#FFF4EC" : col.bg, color: ev.conflict ? "#7A3300" : col.text, borderLeft: `3px solid ${ev.conflict ? C.secondary : col.dot}`, borderRadius: "3px", padding: "2px 5px", fontSize: "10px", fontWeight: "600", cursor: "pointer", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT }}>{ev.title}</div>;
                        })}

                        {evts.length > 2 && <div style={{ fontSize: "9px", color: C.textMuted, fontFamily: FONT }}>+{evts.length - 2} more</div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: "264px", flexShrink: 0, borderLeft: `1px solid ${C.border}`, background: C.neutral, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ display: "flex", color: C.secondary }}><Icon.Conflict /></span>
            <span style={{ fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: FONT }}>Active Conflicts</span>
            <span style={{ marginLeft: "auto", background: "#FFF4EC", color: C.secondary, fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "100px", border: "1px solid rgba(255,113,0,.3)", fontFamily: FONT }}>{CONFLICTS_DATA.length}</span>
          </div>

          {CONFLICTS_DATA.map((c, i) => (
            <div key={i} style={{ background: "#FFF4EC", border: "1px solid rgba(255,113,0,.3)", borderRadius: "8px", padding: "11px", marginBottom: "8px" }}>
              <p style={{ margin: "0 0 2px", fontSize: "10px", fontWeight: "700", color: C.secondary, fontFamily: FONT }}>{c.date} · {c.time}</p>
              <p style={{ margin: "0 0 3px", fontSize: "12px", fontWeight: "700", color: C.text, fontFamily: FONT, lineHeight: 1.4 }}>{c.title}</p>
              <p style={{ margin: "0 0 9px", fontSize: "11px", color: C.textMuted, fontFamily: FONT, lineHeight: 1.5 }}>{c.desc}</p>
              <button style={{ width: "100%", padding: "6px", background: C.secondary, color: C.white, border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}>Reschedule</button>
            </div>
          ))}
        </div>

        {selEvent && (
          <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", color: C.secondary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: FONT }}>Selected Event</p>
              <button onClick={() => setSelEvent(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: "16px", lineHeight: 1 }}>×</button>
            </div>
            <p style={{ fontSize: "13px", fontWeight: "800", color: C.text, margin: "0 0 10px", fontFamily: FONT }}>{selEvent.title}</p>
            {[ ["Type", selEvent.type], ["Venue", selEvent.venue], ["Organizer", selEvent.org] ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}`, fontSize: "12px" }}>
                <span style={{ color: C.textMuted, fontFamily: FONT }}>{k}</span>
                <span style={{ color: C.text, fontWeight: "600", fontFamily: FONT }}>{v}</span>
              </div>
            ))}
            {selEvent.conflict && <div style={{ marginTop: "8px", background: "#FFF4EC", border: "1px solid rgba(255,113,0,.3)", borderRadius: "6px", padding: "7px 10px", fontSize: "11px", color: "#7A3300", fontFamily: FONT }}>⚠ Venue conflict on this date.</div>}
          </div>
        )}

        <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #0a4f96 100%)`, borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: C.secondary, margin: "0 0 5px", fontFamily: FONT }}><span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Icon.Bot size={14} /> Smart Scheduler</span></p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,.7)", margin: "0 0 12px", lineHeight: 1.5, fontFamily: FONT }}>{CONFLICTS_DATA.length} optimized alternatives available to resolve conflicts.</p>
          <button style={{ width: "100%", padding: "8px", background: C.secondary, color: C.white, border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}>Review Suggestions</button>
        </div>
      </div>
    </div>
  );
}
