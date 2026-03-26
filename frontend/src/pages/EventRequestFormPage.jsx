import { useState } from "react";
import { C, FONT } from "../constants/colors";
import { Icon } from "../components/common/Icon";
import { Lbl, Inp, Txta, Sel, Pills, SecHead, InfoBox, InnerCard, Toggle, Btn, Grid2 } from "../components/common/Primitives";
import { EVENT_TYPES, PURPOSES, AUDIENCES, VENUES_LIST, FUND_SOURCES, FORM_STEPS, VENUE_DATA, EVENTS_BY_DAY } from "../constants/staticData";
import { checkVenueConflict, getVenueStatus } from "../utils/helpers";

function Step1({ d, set }) {
  const wc = d.purpose_desc ? d.purpose_desc.trim().split(/\s+/).filter(Boolean).length : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SecHead icon={<Icon.FileText />} title="Basic Event Information" subtitle="Give the administration a clear snapshot of your event." />
      <div><Lbl required>Event Title</Lbl><Inp placeholder="e.g. IEEE Annual Tech Symposium 2026" value={d.title||""} onChange={e => set({...d, title:e.target.value})} /></div>
      <div>
        <Lbl required>Type of Event</Lbl>
        <Pills options={EVENT_TYPES} value={d.event_type} onChange={v => set({...d, event_type:v, event_type_other:""})} />
        {d.event_type === "Other" && <div style={{ marginTop:"12px" }}><Lbl>Specify Event Type</Lbl><Inp placeholder="Describe your event type..." value={d.event_type_other||""} onChange={e => set({...d, event_type_other:e.target.value})} /></div>}
      </div>
      <div>
        <Lbl required>Purpose / Objective</Lbl>
        <Pills options={PURPOSES} value={d.purpose_tag} onChange={v => set({...d, purpose_tag:v})} />
        <div style={{ marginTop:"14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"7px" }}>
            <Lbl>Brief Description</Lbl>
            <span style={{ fontSize:"10px", fontFamily:FONT, color:wc>200?C.error:wc>0&&wc<20?C.secondary:C.textDim }}>{wc}/200</span>
          </div>
          <Txta rows={3} placeholder="Explain the goals and expected outcomes of this event..." value={d.purpose_desc||""} onChange={e => set({...d, purpose_desc:e.target.value})} style={{ borderColor:wc>200?C.error:C.border }} />
          {wc>0&&wc<20 && <p style={{ fontSize:"11px", color:C.secondary, marginTop:"5px", fontFamily:FONT }}>Min. 20 words recommended.</p>}
          {wc>200 && <p style={{ fontSize:"11px", color:C.error, marginTop:"5px", fontFamily:FONT }}>Exceeds 200-word limit.</p>}
        </div>
      </div>
      <div>
        <Lbl required>Date & Time</Lbl>
        <Grid2>
          <div><Lbl>Event Date</Lbl><Inp type="date" value={d.date||""} onChange={e => set({...d, date:e.target.value})} /></div>
          <div><Lbl>Start Time</Lbl><Inp type="time" value={d.start_time||""} onChange={e => set({...d, start_time:e.target.value})} /></div>
          <div><Lbl>End Time</Lbl><Inp type="time" value={d.end_time||""} onChange={e => set({...d, end_time:e.target.value})} /></div>
          <div><Lbl>Setup Start</Lbl><Inp type="time" value={d.setup_time||""} onChange={e => set({...d, setup_time:e.target.value})} /></div>
        </Grid2>
        <div style={{ marginTop:"14px", maxWidth:"50%" }}><Lbl>Teardown End Time</Lbl><Inp type="time" value={d.teardown_time||""} onChange={e => set({...d, teardown_time:e.target.value})} /></div>
      </div>
      <div><Lbl required>Target Audience</Lbl><Pills options={AUDIENCES} value={d.audience} onChange={v => set({...d, audience:v})} /></div>
    </div>
  );
}

function Step2({ d, set }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      <SecHead icon={<Icon.Users />} title="Organizer Details" subtitle="The university needs to know who is accountable for this event." />
      <div><Lbl required>Name of Organizing Body</Lbl><Inp placeholder="e.g. IEEE Student Branch, Student Council, Drama Society" value={d.org_name||""} onChange={e => set({...d, org_name:e.target.value})} /></div>
      <InnerCard>
        <p style={{ margin:"0 0 14px", fontSize:"10px", fontWeight:"700", color:C.primary, textTransform:"uppercase", letterSpacing:"0.07em", fontFamily:FONT }}>Primary Contact Person</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <div><Lbl required>Full Name</Lbl><Inp placeholder="e.g. Kavindu Perera" value={d.contact_name||""} onChange={e => set({...d, contact_name:e.target.value})} /></div>
          <Grid2>
            <div><Lbl required>Student / Staff ID</Lbl><Inp placeholder="e.g. S/21/234" value={d.contact_id||""} onChange={e => set({...d, contact_id:e.target.value})} /></div>
            <div><Lbl required>Phone Number</Lbl><Inp type="tel" placeholder="077 123 4567" value={d.contact_phone||""} onChange={e => set({...d, contact_phone:e.target.value})} /></div>
          </Grid2>
          <div><Lbl>Email Address</Lbl><Inp type="email" placeholder="kavindu@university.lk" value={d.contact_email||""} onChange={e => set({...d, contact_email:e.target.value})} /></div>
        </div>
      </InnerCard>
      <InnerCard>
        <p style={{ margin:"0 0 12px", fontSize:"10px", fontWeight:"700", color:C.primary, textTransform:"uppercase", letterSpacing:"0.07em", fontFamily:FONT }}>Supervising Faculty / Staff Member</p>
        <InfoBox>Most universities require a Teacher-in-Charge to co-sign the event request.</InfoBox>
        <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginTop:"16px" }}>
          <div><Lbl required>Supervisor Name</Lbl><Inp placeholder="e.g. Dr. Nimali Fernando" value={d.supervisor_name||""} onChange={e => set({...d, supervisor_name:e.target.value})} /></div>
          <Grid2>
            <div><Lbl required>Department</Lbl><Inp placeholder="e.g. Faculty of Engineering" value={d.supervisor_dept||""} onChange={e => set({...d, supervisor_dept:e.target.value})} /></div>
            <div><Lbl>Contact Number</Lbl><Inp type="tel" placeholder="011 234 5678" value={d.supervisor_phone||""} onChange={e => set({...d, supervisor_phone:e.target.value})} /></div>
          </Grid2>
        </div>
      </InnerCard>
    </div>
  );
}

function Step3({ d, set, onOpenCalendar }) {
  const conflicts = checkVenueConflict(d.venue, d.date);
  const venueInfo = VENUE_DATA.find(v => v.name === d.venue);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      <SecHead icon={<Icon.Venue />} title="Venue & Logistics" subtitle="Help the facilities team manage campus schedules and resources." />
      <div>
        <Lbl required>Proposed Venue</Lbl>
        <Sel value={d.venue||""} onChange={e => set({...d, venue:e.target.value})}>
          <option value="" disabled>Select a venue on campus...</option>
          {VENUES_LIST.map(v => <option key={v} value={v}>{v}</option>)}
        </Sel>
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
      <div><Lbl required>Expected Attendance</Lbl><Inp type="number" placeholder="e.g. 250" value={d.attendance||""} onChange={e => set({...d, attendance:e.target.value})} /><p style={{ fontSize:"11px", color:C.textMuted, marginTop:"5px", fontFamily:FONT }}>Must not exceed venue fire safety capacity.</p></div>
    </div>
  );
}

function Step4({ d, set }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      <SecHead icon={<Icon.Finance />} title="Financials & Sponsorship" subtitle="Be transparent about how funds are managed and sourced." />
      <InfoBox>All financial information is subject to review. External sponsorships may require separate approval from the Legal or Marketing department.</InfoBox>
      <div><Lbl required>Estimated Total Budget (LKR)</Lbl><Inp type="number" placeholder="e.g. 150000" value={d.budget||""} onChange={e => set({...d, budget:e.target.value})} /></div>
      <div><Lbl>Budget Breakdown</Lbl><Txta rows={4} placeholder={"e.g.\nVenue setup — LKR 20,000\nSound & lighting — LKR 45,000\nPrinting & banners — LKR 15,000"} value={d.budget_breakdown||""} onChange={e => set({...d, budget_breakdown:e.target.value})} /></div>
      <div><Lbl required>Source of Funding</Lbl><Pills options={FUND_SOURCES} value={d.fund_source} multi onChange={v => set({...d, fund_source:v})} /></div>
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}><Lbl>External Sponsors?</Lbl><Toggle value={!!d.has_sponsors} onChange={v => set({...d, has_sponsors:v})} /></div>
        {d.has_sponsors && (
          <InnerCard>
            <InfoBox>External sponsors require separate approval. Provide details for each sponsor.</InfoBox>
            <div style={{ marginTop:"14px", display:"flex", flexDirection:"column", gap:"14px" }}>
              <div><Lbl>Sponsor Names & Details</Lbl><Txta rows={3} placeholder={"1. Dialog Axiata — Cash LKR 50,000\n2. McDonald's — Food provision"} value={d.sponsor_details||""} onChange={e => set({...d, sponsor_details:e.target.value})} /></div>
            </div>
          </InnerCard>
        )}
      </div>
    </div>
  );
}

function Step5({ d, set }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      <SecHead icon={<Icon.Shield />} title="Risk Management & Safety" subtitle="This section determines whether your request is approved or flagged." />
      <InfoBox warn>Incomplete safety information is the most common reason event requests are rejected. Please fill this carefully.</InfoBox>
      <div>
        <Lbl required>Security Plan</Lbl>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginTop:"8px", marginBottom:"12px" }}>
          {["Campus Security","Private Security","Volunteer Marshals","No Security Needed"].map(o => (
            <button key={o} type="button" onClick={() => set({...d, security:o})} style={{ padding:"6px 14px", borderRadius:"6px", fontSize:"12px", fontFamily:FONT, cursor:"pointer", border:`1.5px solid ${d.security===o?C.primary:C.border}`, background:d.security===o?C.primaryLight:C.white, color:d.security===o?C.primary:C.textMuted, fontWeight:d.security===o?"700":"400" }}>{o}</button>
          ))}
        </div>
        <Txta rows={2} placeholder="Describe your crowd management and security plan..." value={d.security_plan||""} onChange={e => set({...d, security_plan:e.target.value})} />
      </div>
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}><Lbl>Food & Beverage Involved?</Lbl><Toggle value={!!d.has_food} onChange={v => set({...d, has_food:v})} /></div>
        {d.has_food && <InnerCard><InfoBox>Food vendors must hold a valid health permit.</InfoBox><div style={{ marginTop:"14px" }}><Lbl>Vendor Names & Permit Status</Lbl><Txta rows={3} placeholder={"1. Cafe Delight — Permit valid Dec 2026\n2. Homemade goods — Permit pending"} value={d.food_vendors||""} onChange={e => set({...d, food_vendors:e.target.value})} /></div></InnerCard>}
      </div>
      <div style={{ background:C.primaryLight, borderRadius:"12px", padding:"20px", border:`1px solid ${C.border}` }}>
        <p style={{ margin:"0 0 12px", fontSize:"10px", fontWeight:"700", color:C.primary, textTransform:"uppercase", letterSpacing:"0.07em", fontFamily:FONT }}>Declaration</p>
        <label style={{ display:"flex", alignItems:"flex-start", gap:"12px", cursor:"pointer" }}>
          <input type="checkbox" checked={!!d.declaration} onChange={e => set({...d, declaration:e.target.checked})} style={{ width:"16px", height:"16px", marginTop:"2px", accentColor:C.primary, cursor:"pointer", flexShrink:0 }} />
          <span style={{ fontSize:"13px", color:C.text, lineHeight:1.6, fontFamily:FONT }}>I confirm that all information provided is accurate and complete. I understand that submitting false or misleading information may result in rejection and disciplinary action.</span>
        </label>
      </div>
    </div>
  );
}

function ReviewStep({ s1, s2, s3, s4, s5 }) {
  const sections = [
    { title:"Basic Event Info",  rows:[["Title",s1.title],["Type",s1.event_type],["Date",s1.date],["Time",s1.start_time&&s1.end_time?`${s1.start_time} – ${s1.end_time}`:null],["Audience",s1.audience]] },
    { title:"Organizer",         rows:[["Org. Body",s2.org_name],["Contact",s2.contact_name],["Supervisor",s2.supervisor_name]] },
    { title:"Venue & Logistics", rows:[["Venue",s3.venue],["Attendance",s3.attendance?`${s3.attendance} people`:null],["Power",s3.power]] },
    { title:"Financials",        rows:[["Budget",s4.budget?`LKR ${parseInt(s4.budget).toLocaleString()}`:null],["Funding",Array.isArray(s4.fund_source)?s4.fund_source.join(", "):s4.fund_source],["Sponsors",s4.has_sponsors?"Yes":"No"]] },
    { title:"Risk & Safety",     rows:[["Security",s5.security],["Food & Bev",s5.has_food?"Yes":"No"],["Declaration",s5.declaration?"✓ Confirmed":"⚠ Pending"]] },
  ];
  const allRows = sections.flatMap(s => s.rows);
  const pct = Math.round((allRows.filter(([,v]) => v && v!=="No").length / allRows.length) * 100);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
      <SecHead icon={<Icon.Review />} title="Request Summary" subtitle="Review all information before submitting for administrative review." />
      {sections.map(sec => (
        <div key={sec.title} style={{ borderRadius:"10px", border:`1px solid ${C.border}`, overflow:"hidden" }}>
          <div style={{ background:C.primaryLight, padding:"8px 16px", borderBottom:`1px solid ${C.border}` }}>
            <p style={{ margin:0, fontSize:"10px", fontWeight:"700", color:C.primary, textTransform:"uppercase", letterSpacing:"0.06em", fontFamily:FONT }}>{sec.title}</p>
          </div>
          {sec.rows.filter(([,v]) => v).map(([k,v], i, a) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px", borderBottom:i<a.length-1?`1px solid ${C.border}`:"none", background:C.white }}>
              <span style={{ fontSize:"10px", color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.06em", fontFamily:FONT }}>{k}</span>
              <span style={{ fontSize:"12px", fontWeight:"600", fontFamily:FONT, color:v==="✓ Confirmed"?"#2E8B57":v==="⚠ Pending"?C.secondary:C.text }}>{v}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={{ background:C.primary, borderRadius:"12px", padding:"20px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
          <span style={{ fontSize:"10px", color:"rgba(255,255,255,.55)", textTransform:"uppercase", letterSpacing:"0.06em", fontFamily:FONT }}>Completion</span>
          <span style={{ fontSize:"10px", color:C.secondary, background:"rgba(255,113,0,.15)", padding:"2px 10px", borderRadius:"100px", border:"1px solid rgba(255,113,0,.4)", fontFamily:FONT }}>Draft</span>
        </div>
        <div style={{ fontSize:"28px", fontWeight:"700", color:C.white, fontFamily:FONT, marginBottom:"8px" }}>{pct}%</div>
        <div style={{ background:"rgba(255,255,255,.15)", borderRadius:"100px", height:"5px", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:C.secondary, borderRadius:"100px" }} />
        </div>
      </div>
      {!s5.declaration && <InfoBox warn>You must confirm the declaration in Step 5 before submitting.</InfoBox>}
    </div>
  );
}

export default function EventRequestFormPage({ onOpenCalendar, onBack }) {
  const [step, setStep] = useState(1);
  const [s1, setS1] = useState({});
  const [s2, setS2] = useState({});
  const [s3, setS3] = useState({});
  const [s4, setS4] = useState({});
  const [s5, setS5] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [anim, setAnim] = useState(false);
  const TOTAL = 6;

  const goTo = n => { setAnim(true); setTimeout(() => { setStep(n); setAnim(false); }, 180); };

  const titles = ["Basic Event Information","Organizer Details","Venue & Logistics","Financials & Sponsorship","Risk Management & Safety","Review & Submit"];
  const badges = ["BASIC EVENT INFO","ORGANIZER DETAILS","VENUE & LOGISTICS","FINANCIALS","RISK & SAFETY","FINAL REVIEW"];
  const pct = Math.round(((step - 1) / TOTAL) * 100);

  if (submitted) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
      <div style={{ textAlign:"center", maxWidth:"460px" }}>
        <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:C.primaryLight, border:`2px solid ${C.primary}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", color:C.primary }}><Icon.Check /></div>
        <h2 style={{ fontSize:"28px", fontWeight:"800", color:C.primary, marginBottom:"12px", fontFamily:FONT }}>Request Submitted!</h2>
        <p style={{ color:C.textMuted, fontSize:"14px", lineHeight:1.7, marginBottom:"20px", fontFamily:FONT }}>Your permission request for <strong style={{ color:C.primary }}>{s1.title || "your event"}</strong> has been submitted for administrative review.</p>
        <div style={{ background:C.tertiary, border:`1px solid ${C.terDark}`, borderRadius:"10px", padding:"14px 18px", fontSize:"13px", color:"#7A6200", marginBottom:"28px", textAlign:"left", lineHeight:1.6, fontFamily:FONT }}><strong>3–5 working days.</strong> Check your university email for updates.</div>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
          <Btn onClick={() => { setSubmitted(false); setStep(1); setS1({}); setS2({}); setS3({}); setS4({}); setS5({}); }}>+ Submit Another</Btn>
          <Btn variant="outline" onClick={onBack}>← Dashboard</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${C.primary} 0%, #0a4f96 100%)`, padding:"28px 40px", flexShrink:0, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(255,255,255,.04)" }} />
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"10px" }}>
          {["Dashboard","Events","Request Permission"].map((b, i) => (
            <span key={b} style={{ fontSize:"12px", fontFamily:FONT, color:i===2?C.secondary:"rgba(255,255,255,.45)", fontWeight:i===2?"600":"400" }}>
              {i>0 && <span style={{ marginRight:"6px", color:"rgba(255,255,255,.3)" }}>›</span>}{b}
            </span>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"16px" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,113,0,.18)", border:"1px solid rgba(255,113,0,.35)", borderRadius:"100px", padding:"4px 14px", marginBottom:"10px" }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.secondary, display:"block" }} />
              <span style={{ fontSize:"10px", fontWeight:"700", color:C.secondary, fontFamily:FONT, letterSpacing:"0.1em", textTransform:"uppercase" }}>{badges[step-1]}</span>
            </div>
            <h1 style={{ fontSize:"26px", fontWeight:"800", color:C.white, margin:"0 0 6px", lineHeight:1.2, fontFamily:FONT, letterSpacing:"-0.02em" }}>{titles[step-1]}</h1>
          </div>
          <div style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)", borderRadius:"14px", padding:"16px 22px", textAlign:"center", minWidth:"120px" }}>
            <div style={{ fontSize:"30px", fontWeight:"800", color:C.white, fontFamily:FONT, lineHeight:1 }}>{pct}%</div>
            <div style={{ fontSize:"10px", color:"rgba(255,255,255,.5)", fontFamily:FONT, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:"4px" }}>Complete</div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"28px 40px" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <div style={{ background:C.white, borderRadius:"16px", padding:"36px", border:`1px solid ${C.border}`, boxShadow:"0 4px 24px rgba(5,54,104,.07)", opacity:anim?0:1, transform:anim?"translateY(8px)":"translateY(0)", transition:"opacity .18s, transform .18s" }}>
            {step===1 && <Step1 d={s1} set={setS1} />}
            {step===2 && <Step2 d={s2} set={setS2} />}
            {step===3 && <Step3 d={s3} set={setS3} onOpenCalendar={onOpenCalendar} />}
            {step===4 && <Step4 d={s4} set={setS4} />}
            {step===5 && <Step5 d={s5} set={setS5} />}
            {step===6 && <ReviewStep s1={s1} s2={s2} s3={s3} s4={s4} s5={s5} />}
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
        {step<5  && <Btn onClick={() => goTo(step+1)}>Next →</Btn>}
        {step===5 && <Btn onClick={() => goTo(6)}>Review Request →</Btn>}
        {step===6 && <Btn variant={s5.declaration?"secondary":"disabled"} disabled={!s5.declaration} onClick={() => s5.declaration && setSubmitted(true)}><span style={{display:"flex",alignItems:"center",gap:"7px"}}><Icon.Review /> Submit Request</span></Btn>}
      </div>
    </div>
  );
}
