import { C, FONT, Icon, StatusBadge, Card, SectionHead } from "../designSystem";
import { getEventImage } from "../imageUtils";

export default function PendingPage({ event, onBack }) {
  const steps = ["Submitted", "Under Review", "Decision", "Published"];
  const currentStep = 1;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: FONT }}>
      {/* Header with Image Background */}
      <div style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 100%), url('${getEventImage(event.id, event.type)}')`, backgroundSize: "cover", backgroundPosition: "center", padding: "24px 36px", flexShrink: 0, position: "relative", overflow: "hidden", minHeight: "280px" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.15)", border: "none", cursor: "pointer", color: "rgba(255,255,255,.9)", fontSize: "12px", fontFamily: FONT, fontWeight: "600", padding: "6px 12px", borderRadius: "6px", marginBottom: "14px", backdropFilter: "blur(8px)" }}>
          <Icon.ArrowLeft size={14} /> My Events
        </button>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", position: "relative", zIndex: 10 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: "100px", padding: "6px 14px", marginBottom: "12px", backdropFilter: "blur(8px)" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.warning, display: "block" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,.95)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: FONT }}>Pending • Under Review</span>
            </div>
            <h1 style={{ margin: "0 0 6px", fontSize: "32px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.3)", fontFamily: FONT }}>{event.title}</h1>
            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,.9)", textShadow: "0 1px 4px rgba(0,0,0,0.2)", fontFamily: FONT }}>{event.date} • {event.venue}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: "14px", padding: "16px 24px", textAlign: "center", flexShrink: 0, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: C.warning, lineHeight: 1, fontFamily: FONT }}>{currentStep}/{steps.length - 1}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "6px 0 10px", fontWeight: "600", fontFamily: FONT }}>In Review</div>
            <div style={{ background: "rgba(255,255,255,.15)", borderRadius: "100px", height: "5px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(currentStep / (steps.length - 1)) * 100}%`, background: C.warning, borderRadius: "100px", transition: "width 0.3s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px", display: "flex", flexDirection: "column", gap: "24px", background: C.neutral }}>
        {/* Review Progress Card */}
        <Card>
          <SectionHead label="Review Progress" />
          <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative" }}>
            {steps.map((step, i) => {
              const done = i < currentStep;
              const current = i === currentStep;
              return (
                <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {i < steps.length - 1 && <div style={{ position: "absolute", top: "18px", left: "50%", width: "100%", height: "2px", background: done ? C.primary : C.border, zIndex: 0, transition: "background .3s" }} />}
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: done ? C.primary : current ? C.white : C.neutral, border: `2px solid ${done ? C.primary : current ? C.primary : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, position: "relative", boxShadow: current ? `0 0 0 4px ${C.primaryLight}` : "none", transition: "all .3s" }}>
                    {done ? <span style={{ color: C.white, display: "flex" }}><Icon.Check size={14} /></span> : current ? <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: C.secondary, display: "block" }} /> : <span style={{ fontSize: "11px", fontWeight: "700", color: C.textDim, fontFamily: FONT }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: current ? "700" : "500", color: done || current ? C.text : C.textDim, fontFamily: FONT, marginTop: "8px", textAlign: "center" }}>{step}</span>
                  {current && <span style={{ fontSize: "9px", color: C.secondary, fontWeight: "700", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>In Progress</span>}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "20px", background: C.warningLight, border: `1px solid ${C.warning}25`, borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{ color: C.warning, display: "flex", marginTop: "1px" }}><Icon.Info size={15} /></span>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: "700", color: C.warning, fontFamily: FONT }}>Estimated review time: 3-5 working days</p>
              <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>Submitted on {event.date}. Check your university email for updates from the administration.</p>
            </div>
          </div>
        </Card>

        {/* Submitted Details & What Happens Next */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
          {/* Submitted Request Details */}
          <Card>
            <SectionHead label="Submitted Request Details" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                ["Event Title", event.title],
                ["Type", event.type],
                ["Date", event.date],
                ["Time", event.time],
                ["Venue", event.venue],
                ["Category", event.category],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "13px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT, flexShrink: 0, minWidth: "130px" }}>{k}</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: C.text, fontFamily: FONT, textAlign: "right" }}>{v}</span>
                </div>
              ))}
              <div style={{ padding: "13px 0" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT, display: "block", marginBottom: "8px" }}>Description</span>
                <p style={{ margin: 0, fontSize: "13px", color: C.text, fontFamily: FONT, lineHeight: 1.8 }}>{event.description}</p>
              </div>
            </div>
          </Card>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Read-only View Info */}
            <Card style={{ background: C.neutral }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ color: C.textDim, display: "flex", flexShrink: 0 }}><Icon.AlertCircle size={18} /></span>
                <div>
                  <p style={{ margin: "0 0 5px", fontSize: "12px", fontWeight: "700", color: C.text, fontFamily: FONT }}>Read-only View</p>
                  <p style={{ margin: 0, fontSize: "12px", color: C.textMuted, fontFamily: FONT, lineHeight: 1.6 }}>Editing is disabled while your event is under review. Once approved, you will be able to add event details, tickets, and merchandise.</p>
                </div>
              </div>
            </Card>

            {/* What Happens Next */}
            <Card>
              <p style={{ margin: "0 0 14px", fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: FONT }}>What Happens Next</p>
              {[
                { icon: <Icon.Check size={12} />, title: "Decision Notification", desc: "You will receive an email when approved or rejected.", color: C.success },
                { icon: <Icon.CheckCircle size={12} />, title: "Event Setup Unlocked", desc: "After approval, set up your event details, tickets, and merch.", color: C.primary },
                { icon: <Icon.BarChart size={12} />, title: "Publish & Go Live", desc: "Once everything is ready, publish for attendees.", color: C.secondary },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", marginBottom: i < 2 ? "16px" : "0" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: item.color + "15", display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ margin: "0 0 3px", fontSize: "12px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
