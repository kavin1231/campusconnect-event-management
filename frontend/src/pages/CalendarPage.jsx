import { useState } from "react";
import { C, FONT } from "../constants/colors";
import { Icon } from "../components/common/Icon";
import { MONTH_NAMES, WEEK_DAYS, EVENTS_BY_DAY, CONFLICTS, CUR_YEAR, CUR_MONTH, TODAY, VENUE_DATA } from "../constants/staticData";
import { getEventTypeColor } from "../utils/helpers";
import { Btn } from "../components/common/Primitives";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import "../components/dashboard/StudentDashboard.css";

export function CalendarPage() {
  const [year, setYear] = useState(CUR_YEAR);
  const [month, setMonth] = useState(CUR_MONTH);
  const [selectedEvent, setSel] = useState(null);
  const [selectedDay, setDay] = useState(null);
  const [venueFilter, setVF] = useState(null);

  const prevMonth = () => (month === 0 ? (setYear((y) => y - 1), setMonth(11)) : setMonth((m) => m - 1));
  const nextMonth = () => (month === 11 ? (setYear((y) => y + 1), setMonth(0)) : setMonth((m) => m + 1));

  const days = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const todayD = TODAY.getFullYear() === year && TODAY.getMonth() === month ? TODAY.getDate() : -1;
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <>
      <Header />
      <div className="sd-layout">
        <Sidebar activePage="calendar" />
        <div className="sd-content-wrapper">
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Main calendar area */}
            <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontSize: "26px", fontWeight: "800", color: C.text, margin: "0 0 4px", fontFamily: FONT, letterSpacing: "-0.02em" }}>
                    Academic Calendar
                  </h1>
                  <p style={{ fontSize: "13px", color: C.secondary, margin: 0, fontFamily: FONT, fontWeight: "600" }}>
                    Scheduling & conflict detection for {MONTH_NAMES[month]} {year}.
                  </p>
                </div>
              </div>

              {/* Rest of the original calendar content... */}

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={prevMonth}
              style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: "16px" }}
            >
              ‹
            </button>
            <span style={{ fontSize: "14px", fontWeight: "700", color: C.text, minWidth: "140px", textAlign: "center", fontFamily: FONT }}>
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: "16px" }}
            >
              ›
            </button>
          </div>
          <button
            onClick={() => {
              setYear(CUR_YEAR);
              setMonth(CUR_MONTH);
            }}
            style={{ padding: "6px 14px", background: C.white, color: C.primary, border: `1px solid ${C.border}`, borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: FONT }}
          >
            Today
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: "11px", color: C.textDim, fontFamily: FONT }}>
            {Object.values(EVENTS_BY_DAY).flat().length} events · <span style={{ color: C.secondary, fontWeight: "700" }}>{CONFLICTS.length} conflicts</span>
          </span>
        </div>

        {/* Grid */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: "4px" }}>
            {WEEK_DAYS.map((d) => (
              <div key={d} style={{ textAlign: "center", padding: "8px 4px", fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>
                {d}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", marginBottom: "2px" }}>
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di];
                const raw = day ? EVENTS_BY_DAY[day] || [] : [];
                const evts = venueFilter ? raw.filter((e) => e.venue === venueFilter) : raw;
                const hasCon = evts.some((e) => e.conflict);
                const isToday = day === todayD;
                const isSelected = day === selectedDay;
                return (
                  <div
                    key={di}
                    onClick={() => day && setDay(day === selectedDay ? null : day)}
                    style={{
                      minHeight: "88px",
                      padding: "6px",
                      border: `1px solid ${isSelected ? C.primary : C.border}`,
                      borderRadius: "6px",
                      cursor: day ? "pointer" : "default",
                      background: isSelected ? C.primaryLight : day ? C.white : C.neutral,
                      opacity: day ? 1 : 0.3,
                      transition: "all .15s",
                    }}
                  >
                    {day && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: isToday ? "800" : "600",
                              fontFamily: FONT,
                              width: isToday ? "22px" : "auto",
                              height: isToday ? "22px" : "auto",
                              background: isToday ? C.primary : "transparent",
                              color: isToday ? C.white : hasCon ? C.secondary : C.text,
                              borderRadius: isToday ? "50%" : "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {day}
                          </span>
                          {hasCon && (
                            <span style={{ fontSize: "9px", background: C.secLight, color: C.secondary, padding: "1px 5px", borderRadius: "100px", fontWeight: "700", border: `1px solid rgba(255,113,0,.3)`, fontFamily: FONT }}>
                              !
                            </span>
                          )}
                        </div>
                        {evts.slice(0, 2).map((ev, ei) => {
                          const col = getEventTypeColor(ev.type);
                          return (
                            <div
                              key={ei}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSel(ev);
                              }}
                              style={{
                                background: ev.conflict ? C.secLight : col.bg,
                                color: ev.conflict ? "#7A3300" : col.text,
                                borderLeft: `3px solid ${ev.conflict ? C.secondary : col.dot}`,
                                borderRadius: "4px",
                                padding: "2px 6px",
                                fontSize: "10px",
                                fontWeight: "600",
                                cursor: "pointer",
                                marginBottom: "2px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontFamily: FONT,
                              }}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                        {evts.length > 2 && (
                          <div style={{ fontSize: "10px", color: C.textMuted, fontFamily: FONT }}>+{evts.length - 2} more</div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: "272px", flexShrink: 0, borderLeft: `1px solid ${C.border}`, background: C.neutral, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Conflicts */}
        <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "16px", boxShadow: "0 2px 8px rgba(5,54,104,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ display: "flex", color: C.secondary }}>
              <Icon.Conflict />
            </span>
            <span style={{ fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: FONT }}>Active Conflicts</span>
            <span
              style={{
                marginLeft: "auto",
                background: C.secLight,
                color: C.secondary,
                fontSize: "10px",
                fontWeight: "700",
                padding: "2px 8px",
                borderRadius: "100px",
                border: `1px solid rgba(255,113,0,.3)`,
                fontFamily: FONT,
              }}
            >
              {CONFLICTS.length}
            </span>
          </div>
          {CONFLICTS.map((c, i) => (
            <div key={i} style={{ background: C.secLight, border: "1px solid rgba(255,113,0,.3)", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", color: C.secondary, fontFamily: FONT }}>
                  {c.date} · {c.time}
                </span>
              </div>
              <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: "0 0 3px", fontFamily: FONT, lineHeight: 1.4 }}>
                {c.title}
              </p>
              <p style={{ fontSize: "11px", color: C.textMuted, margin: "0 0 10px", fontFamily: FONT, lineHeight: 1.5 }}>
                {c.desc}
              </p>
              <button
                style={{
                  width: "100%",
                  padding: "7px",
                  background: C.secondary,
                  color: C.white,
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                Reschedule Event
              </button>
            </div>
          ))}
        </div>

        {/* Selected event */}
        {selectedEvent && (
          <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: C.secondary, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: FONT }}>
                Selected Event
              </p>
              <button
                onClick={() => setSel(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim }}
              >
                <Icon.X size={14} />
              </button>
            </div>
            <p style={{ fontSize: "14px", fontWeight: "800", color: C.text, margin: "0 0 4px", fontFamily: FONT, lineHeight: 1.3 }}>
              {selectedEvent.title}
            </p>
            {[["Type", selectedEvent.type], ["Venue", selectedEvent.venue], ["Organizer", selectedEvent.org]].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: "12px",
                }}
              >
                <span style={{ color: C.textMuted, fontFamily: FONT }}>{k}</span>
                <span style={{ color: C.text, fontWeight: "600", fontFamily: FONT }}>{v}</span>
              </div>
            ))}
            {selectedEvent.conflict && (
              <div
                style={{
                  marginTop: "10px",
                  background: C.secLight,
                  border: "1px solid rgba(255,113,0,.3)",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  fontSize: "11px",
                  color: "#7A3300",
                  fontFamily: FONT,
                }}
              >
                ⚠ Venue conflict detected on this date.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
    </>
  );
}
