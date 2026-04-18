import { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { C, FONT } from "../constants/colors";
import { Icon } from "../components/common/Icon";
import { Lbl, Inp, Txta, Sel, Pills, SecHead, InfoBox, InnerCard, Toggle, Btn, Grid2 } from "../components/common/Primitives";
import { EVENT_TYPES, VENUES_LIST, VENUE_DATA, ORGANIZING_BODIES } from "../constants/staticData";
import { checkVenueConflict, getVenueStatus } from "../utils/helpers";
import { getUser } from "../utils/auth";
import { FeedbackToast } from "../components/common/FeedbackUI";
import { eventRequestAPI } from "../services/api";

function Step1({ d, set, onOpenCalendar, errors }) {
  const conflicts = checkVenueConflict(d.venue, d.date);
  const venueInfo = VENUE_DATA.find(v => v.name === d.venue);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SecHead icon={<Icon.FileText />} title="Core Event Info" subtitle="Fast essentials for a quick approval review." />
      <div>
        <Lbl required>Event Title</Lbl>
        <Inp placeholder="e.g. IEEE Annual Tech Symposium 2026" value={d.title||""} onChange={e => set({...d, title:e.target.value})} />
        {errors.title && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.title}</p>}
      </div>
      <div>
        <Lbl required>Type of Event</Lbl>
        <Pills options={EVENT_TYPES} value={d.event_type} onChange={v => set({...d, event_type:v, event_type_other:""})} />
        {errors.event_type && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.event_type}</p>}
        {d.event_type === "Other" && <div style={{ marginTop:"12px" }}><Lbl>Specify Event Type</Lbl><Inp placeholder="Describe your event type..." value={d.event_type_other||""} onChange={e => set({...d, event_type_other:e.target.value})} /></div>}
      </div>
      <div>
        <Lbl required>Date & Time</Lbl>
        <Grid2>
          <div><Lbl>Event Date</Lbl><Inp type="date" value={d.date||""} onChange={e => set({...d, date:e.target.value})} /></div>
          <div><Lbl>Start Time</Lbl><Inp type="time" value={d.start_time||""} onChange={e => set({...d, start_time:e.target.value})} /></div>
          <div><Lbl>End Time</Lbl><Inp type="time" value={d.end_time||""} onChange={e => set({...d, end_time:e.target.value})} /></div>
        </Grid2>
        {(errors.date || errors.start_time || errors.end_time) && (
          <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>
            {errors.date || errors.start_time || errors.end_time}
          </p>
        )}
      </div>
      <div>
        <Lbl required>Venue</Lbl>
        <Sel value={d.venue||""} onChange={e => set({...d, venue:e.target.value})}>
          <option value="" disabled>Select a venue on campus...</option>
          {VENUES_LIST.map(v => <option key={v} value={v}>{v}</option>)}
        </Sel>
        {errors.venue && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.venue}</p>}
        {venueInfo && (
          <div style={{ marginTop:"12px", background:C.neutral, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
              <span style={{ fontSize:"13px", fontWeight:"700", color:C.primary, fontFamily:FONT }}>{venueInfo.name}</span>
              <span style={{ fontSize:"10px", fontWeight:"700", fontFamily:FONT, padding:"3px 10px", borderRadius:"100px", letterSpacing:"0.06em", ...(() => { const sc = getVenueStatus(venueInfo.status); return { background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }; })() }}>{venueInfo.status.toUpperCase()}</span>
            </div>
            <div style={{ display:"flex", gap:"16px", marginBottom:"10px" }}>
              <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:C.textMuted, fontFamily:FONT }}><Icon.Capacity />Capacity: <strong style={{color:C.text}}>{venueInfo.capacity}</strong></span>
              <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:C.textMuted, fontFamily:FONT }}><Icon.Building />{venueInfo.block}</span>
              <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:C.textMuted, fontFamily:FONT }}><Icon.Tag />{venueInfo.type}</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {venueInfo.features.map(f => <span key={f} style={{ fontSize:"10px", fontFamily:FONT, padding:"3px 9px", borderRadius:"100px", background:C.primaryLight, color:C.primary, fontWeight:"600" }}>{f}</span>)}
            </div>
          </div>
        )}
        {conflicts && conflicts.length>0 ? (
          <div style={{ marginTop:"12px", background:C.secLight, border:`1.5px solid rgba(255,113,0,.4)`, borderRadius:"10px", padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
              <span style={{ color:C.secondary, display:"flex" }}><Icon.AlertCircle /></span>
              <span style={{ fontSize:"13px", fontWeight:"700", color:"#7A3300", fontFamily:FONT }}>Conflict Detected — {conflicts.length} event{conflicts.length>1?"s":""} already booked</span>
            </div>
            {conflicts.map((c, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 10px", background:"rgba(255,113,0,.08)", borderRadius:"6px", marginBottom:"6px" }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.secondary, flexShrink:0 }} />
                <div><p style={{ margin:0, fontSize:"12px", fontWeight:"700", color:C.text, fontFamily:FONT }}>{c.title}</p><p style={{ margin:0, fontSize:"11px", color:C.textMuted, fontFamily:FONT }}>{c.org}</p></div>
              </div>
            ))}
            <button onClick={onOpenCalendar} style={{ marginTop:"4px", width:"100%", padding:"8px", background:C.secondary, color:C.white, border:"none", borderRadius:"7px", fontSize:"12px", fontFamily:FONT, fontWeight:"700", cursor:"pointer" }}>
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"7px"}}><Icon.Calendar /> View Full Calendar</span>
            </button>
          </div>
        ) : (
          <div style={{ marginTop:"12px", background:C.primaryLight, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px" }}>
            <div>
              <p style={{ margin:0, fontSize:"13px", fontWeight:"700", color:C.primary, fontFamily:FONT }}>{d.venue&&d.date?"✓ No conflicts found on this date":"Check for Venue Conflicts"}</p>
              <p style={{ margin:"3px 0 0", fontSize:"12px", color:C.textMuted, fontFamily:FONT }}>{d.venue&&d.date?`${d.venue} is available`:"Select a venue and date to check availability."}</p>
            </div>
            <button onClick={onOpenCalendar} style={{ flexShrink:0, padding:"10px 20px", background:C.primary, color:C.white, border:"none", borderRadius:"8px", fontSize:"12px", fontFamily:FONT, fontWeight:"700", cursor:"pointer", whiteSpace:"nowrap", boxShadow:"0 4px 12px rgba(5,54,104,.25)" }}>
              <span style={{display:"flex",alignItems:"center",gap:"7px"}}><Icon.Calendar /> View Calendar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Step2({ d, set, prefillName, errors }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      <SecHead icon={<Icon.Users />} title="Organizer & Details" subtitle="Who is hosting, and what is the event about?" />
      <div>
        <Lbl required>Organizing Body</Lbl>
        <Sel value={d.org_name||""} onChange={e => set({...d, org_name:e.target.value})}>
          <option value="" disabled>Select a Club or Faculty...</option>
          {ORGANIZING_BODIES.map(org => <option key={org} value={org}>{org}</option>)}
        </Sel>
        {errors.org_name && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.org_name}</p>}
      </div>
      <div>
        <Lbl required>Contact Name</Lbl>
        <Inp
          placeholder="Logged-in user"
          value={d.contact_name||""}
          readOnly={!!prefillName}
          onChange={e => set({...d, contact_name:e.target.value})}
        />
        {!!prefillName && <p style={{ fontSize:"11px", color:C.textMuted, marginTop:"6px", fontFamily:FONT }}>Auto-filled from your profile.</p>}
        {errors.contact_name && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.contact_name}</p>}
      </div>
      <div>
        <Lbl required>Description</Lbl>
        <Txta rows={4} placeholder="One-paragraph summary of the event goals and flow..." value={d.description||""} onChange={e => set({...d, description:e.target.value})} />
        {errors.description && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.description}</p>}
      </div>
      <div>
        <Lbl required>Expected Attendance</Lbl>
        <Inp type="number" placeholder="e.g. 250" value={d.attendance||""} onChange={e => set({...d, attendance:e.target.value})} />
        <p style={{ fontSize:"11px", color:C.textMuted, marginTop:"5px", fontFamily:FONT }}>Estimate only. Exact count can be updated later.</p>
        {errors.attendance && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.attendance}</p>}
      </div>
    </div>
  );
}

function Step3({ d, set, errors }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      <SecHead icon={<Icon.Shield />} title="Optional Details" subtitle="These help reviewers but can be kept brief." />
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}><Lbl>Requires Sponsorship?</Lbl><Toggle value={!!d.has_sponsors} onChange={v => set({...d, has_sponsors:v})} /></div>
        {d.has_sponsors && (
          <InnerCard>
            <InfoBox>List sponsors or note if outreach is in progress.</InfoBox>
            <div style={{ marginTop:"14px" }}><Lbl>Sponsor Details</Lbl><Txta rows={3} placeholder={"1. Dialog Axiata — LKR 50,000 (pending)\n2. Brand X — In discussion"} value={d.sponsor_details||""} onChange={e => set({...d, sponsor_details:e.target.value})} /></div>
            {errors.sponsor_details && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.sponsor_details}</p>}
          </InnerCard>
        )}
      </div>
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}><Lbl>Includes Food & Beverage?</Lbl><Toggle value={!!d.has_food} onChange={v => set({...d, has_food:v})} /></div>
        {d.has_food && (
          <InnerCard>
            <InfoBox>Food vendors must hold a valid health permit.</InfoBox>
            <div style={{ marginTop:"14px" }}><Lbl>Vendor Details</Lbl><Txta rows={3} placeholder={"1. Cafe Delight — Permit valid Dec 2026\n2. Homemade goods — Permit pending"} value={d.food_vendors||""} onChange={e => set({...d, food_vendors:e.target.value})} /></div>
            {errors.food_vendors && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.food_vendors}</p>}
          </InnerCard>
        )}
      </div>
      <div style={{ background:C.primaryLight, borderRadius:"12px", padding:"20px", border:`1px solid ${C.border}` }}>
        <p style={{ margin:"0 0 12px", fontSize:"10px", fontWeight:"700", color:C.primary, textTransform:"uppercase", letterSpacing:"0.07em", fontFamily:FONT }}>Declaration</p>
        <label style={{ display:"flex", alignItems:"flex-start", gap:"12px", cursor:"pointer" }}>
          <input type="checkbox" checked={!!d.declaration} onChange={e => set({...d, declaration:e.target.checked})} style={{ width:"16px", height:"16px", marginTop:"2px", accentColor:C.primary, cursor:"pointer", flexShrink:0 }} />
          <span style={{ fontSize:"13px", color:C.text, lineHeight:1.6, fontFamily:FONT }}>I confirm that all information provided is accurate and complete. I understand that submitting false or misleading information may result in rejection and disciplinary action.</span>
        </label>
        {errors.declaration && <p style={{ fontSize:"11px", color:C.error, marginTop:"6px", fontFamily:FONT }}>{errors.declaration}</p>}
      </div>
    </div>
  );
}

export default function EventRequestFormPage({ onOpenCalendar, onBack }) {
  const user = getUser();
  const prefillName = user?.name || user?.fullName || user?.username || "";
  const prefillEmail = user?.email || "";
  const prefillPhone = user?.phone || user?.contact || "";
  const prefillId = user?.studentId || user?.staffId || user?.id || "";
  const [step, setStep] = useState(1);
  const [s1, setS1] = useState({});
  const [s2, setS2] = useState({ contact_name: prefillName });
  const [s3, setS3] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [anim, setAnim] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);
  const TOTAL = 3;

  const goTo = n => { setAnim(true); setTimeout(() => { setStep(n); setAnim(false); }, 180); };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const validateStep1 = () => {
    const errors = {};
    if (!s1.title) errors.title = "Event title is required.";
    if (!s1.event_type) errors.event_type = "Event type is required.";
    if (!s1.date) errors.date = "Event date is required.";
    if (!s1.start_time) errors.start_time = "Start time is required.";
    if (!s1.end_time) errors.end_time = "End time is required.";
    if (!s1.venue) errors.venue = "Venue is required.";
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!s2.org_name) errors.org_name = "Organizing body is required.";
    if (!s2.contact_name) errors.contact_name = "Contact name is required.";
    if (!s2.description) errors.description = "Description is required.";
    if (!s2.attendance) errors.attendance = "Expected attendance is required.";
    return errors;
  };

  const validateStep3 = () => {
    const errors = {};
    if (s3.has_sponsors && !s3.sponsor_details) {
      errors.sponsor_details = "Sponsor details are required when sponsorship is on.";
    }
    if (s3.has_food && !s3.food_vendors) {
      errors.food_vendors = "Vendor details are required when food is included.";
    }
    if (!s3.declaration) errors.declaration = "Please confirm the declaration.";
    return errors;
  };

  const handleNext = () => {
    let errors = {};
    if (step === 1) errors = validateStep1();
    if (step === 2) errors = validateStep2();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    goTo(step + 1);
  };

  const handleSubmit = async () => {
    const errors = validateStep3();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare data payload matching backend schema
      const payload = {
        // Step 1: Basic Event Information
        title: s1.title,
        eventType: s1.event_type,
        eventTypeOther: s1.event_type_other || null,
        purposeTag: "General",
        purposeDescription: s2.description,
        eventDate: s1.date,
        startTime: s1.start_time,
        endTime: s1.end_time,
        setupTime: s1.start_time,
        teardownTime: s1.end_time,
        audience: "All",
        
        // Step 2: Organizer Details
        organizingBody: s2.org_name,
        contactName: s2.contact_name,
        contactId: prefillId || "N/A",
        contactPhone: prefillPhone || "N/A",
        contactEmail: prefillEmail || "N/A",
        supervisorName: "N/A",
        supervisorDepartment: "N/A",
        supervisorPhone: "",
        
        // Step 3: Venue & Logistics
        venue: s1.venue,
        expectedAttendance: parseInt(s2.attendance) || 0,
        seatingArrangement: "General Seating",
        parkingRequired: false,
        
        // Step 4: Financials
        estimatedBudget: 1000,
        budgetBreakdown: "N/A",
        sponsorshipDetails: s3.sponsor_details || "",
        fundSource: ["Internal"],
        
        // Step 5: Risk Management & Safety
        riskAssessment: "Standard precautions",
        safetyMeasures: "Standard campus procedures",
        emergencyPlan: s3.food_vendors || "",
        contingency: s3.has_food ? "Food vendor permits required" : "",
      };
      
      const response = await eventRequestAPI.submitEventRequest(payload);
      
      if (response.success) {
        showToast("Event request submitted.", "success");
        setSubmitted(true);
      } else {
        setError(response.message || "Failed to submit request. Please try again.");
        showToast(response.message || "Failed to submit request.", "error");
      }
    } catch (err) {
      setError(err.message || "An error occurred while submitting your request.");
      showToast(err.message || "An error occurred while submitting your request.", "error");
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const pageContent = submitted ? (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
      <div style={{ textAlign:"center", maxWidth:"460px" }}>
        <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:C.primaryLight, border:`2px solid ${C.primary}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", color:C.primary }}><Icon.Check /></div>
        <h2 style={{ fontSize:"28px", fontWeight:"800", color:C.primary, marginBottom:"12px", fontFamily:FONT }}>Request Submitted!</h2>
        <p style={{ color:C.textMuted, fontSize:"14px", lineHeight:1.7, marginBottom:"20px", fontFamily:FONT }}>Your permission request for <strong style={{ color:C.primary }}>{s1.title || "your event"}</strong> has been submitted for administrative review.</p>
        <div style={{ background:C.tertiary, border:`1px solid ${C.terDark}`, borderRadius:"10px", padding:"14px 18px", fontSize:"13px", color:"#7A6200", marginBottom:"28px", textAlign:"left", lineHeight:1.6, fontFamily:FONT }}><strong>3–5 working days.</strong> Check your university email for updates.</div>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
          <Btn onClick={() => { setSubmitted(false); setStep(1); setS1({}); setS2({ contact_name: prefillName }); setS3({}); setFieldErrors({}); }}>+ Submit Another</Btn>
          <Btn variant="outline" onClick={handleBack}>← Dashboard</Btn>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <FeedbackToast toast={toast} onClose={() => setToast(null)} />
      <div style={{ width:"100%", maxWidth:"1320px", margin:"0 auto", padding:"0 40px" }}>
        {/* Organizer Dashboard Header */}
        <div
          className="rounded-3xl border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, rgba(255, 107, 53, 0.05), var(--bg-nav))",
          }}
        >
          <div className="flex justify-between items-start gap-4">
            <div>
              <p
                className="text-xs tracking-[0.18em] uppercase mb-2"
                style={{ color: "var(--primary-accent)", opacity: 0.8 }}
              >
                Organizer Workspace
              </p>
              <h1
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: "var(--text-main)" }}
              >
                Event Permission Request
              </h1>
              <p
                className="max-w-2xl"
                style={{ color: "var(--text-muted)" }}
              >
                Submit and track event permission requests. Follow the steps below to get approval for your event.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 40px 28px" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <div style={{ background:C.white, borderRadius:"16px", padding:"36px", border:`1px solid ${C.border}`, boxShadow:"0 4px 24px rgba(5,54,104,.07)", opacity:anim?0:1, transform:anim?"translateY(8px)":"translateY(0)", transition:"opacity .18s, transform .18s" }}>
            {step===1 && <Step1 d={s1} set={setS1} onOpenCalendar={onOpenCalendar} errors={fieldErrors} />}
            {step===2 && <Step2 d={s2} set={setS2} prefillName={prefillName} errors={fieldErrors} />}
            {step===3 && <Step3 d={s3} set={setS3} errors={fieldErrors} />}
          </div>
        </div>
      </div>

      <div style={{ background:C.white, borderTop:`1px solid ${C.border}`, padding:"14px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, boxShadow:"0 -4px 16px rgba(5,54,104,.06)" }}>
        <Btn variant={step===1?"disabled":"outline"} disabled={step===1} onClick={() => goTo(step-1)}>← Back</Btn>
        <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
          {Array.from({length:TOTAL}, (_, i) => i+1).map(n => (
            <div key={n} style={{ height:"6px", borderRadius:"100px", transition:"all .3s", width:n===step?"24px":"6px", background:n<step?C.primary:n===step?C.secondary:C.border }} />
          ))}
        </div>
        {step<TOTAL  && <Btn onClick={handleNext}>Next →</Btn>}
        {step===TOTAL && <Btn variant={s3.declaration?"secondary":"disabled"} disabled={!s3.declaration || isLoading} onClick={handleSubmit}><span style={{display:"flex",alignItems:"center",gap:"7px"}}><Icon.Review /> {isLoading ? "Submitting..." : "Submit Request"}</span></Btn>}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", backgroundColor: C.bg }}>
      <Sidebar activePage="create-events" isAdmin={true} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {pageContent}
      </div>
    </div>
  );
}
