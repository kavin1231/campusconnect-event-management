import { useState } from "react";
import {
  C,
  FONT,
  Icon,
  Inp,
  Txta,
  Sel,
  Lbl,
  Grid2,
  Pills,
  SecHead,
  InfoBox,
  InnerCard,
  FormToggle,
  FormBtn,
} from "../designSystem";
import {
  EVENT_TYPES,
  PURPOSES,
  AUDIENCES,
  VENUES_LIST,
  FUND_SOURCES,
  FORM_STEPS,
  VENUE_DATA,
  checkVenueConflict,
} from "../data";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  wordCount,
  isValidPhoneNumber,
  isValidStudentStaffId,
  isValidEmail,
  isPositiveNumber,
} from "../validationUtils";
import {
  ValidatedInput,
  ValidatedTextarea,
  ValidatedSelect,
  FieldValidationFeedback,
} from "../inlineValidationComponents";

function FStep1({ d, set }) {
  const wc = wordCount(d.purpose_desc);
  const titleError = !d.title?.trim() ? "Event title is required." : d.title.trim().length < 5 ? "Title must be at least 5 characters." : null;
  const typeError = !d.event_type ? "Type of event is required." : null;
  const typeOtherError = d.event_type === "Other" && !d.event_type_other?.trim() ? "Please specify the event type." : null;
  const purposeError = !d.purpose_tag ? "Purpose is required." : null;
  const descError = wc === 0 ? "Description is required." : wc < 20 ? `Description needs ${20 - wc} more words (min 20).` : null;
  const dateError = !d.date ? "Event date is required." : null;
  const startTimeError = !d.start_time ? "Start time is required." : null;
  const endTimeError = !d.end_time ? "End time is required." : d.start_time && d.end_time && d.start_time >= d.end_time ? "End time must be after start time." : null;
  const setupError = !d.setup_time ? "Setup time is required." : d.setup_time && d.start_time && d.setup_time >= d.start_time ? "Setup must be before event start." : null;
  const teardownError = d.teardown_time && d.end_time && d.teardown_time <= d.end_time ? "Teardown must be after event end." : null;
  const audienceError = !d.audience ? "Target audience is required." : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SecHead icon={<Icon.FileText />} title="Basic Event Information" subtitle="Give the administration a clear snapshot of your event." />
      
      <ValidatedInput label="Event Title" required value={d.title} onChange={(e) => set({ ...d, title: e.target.value })} placeholder="e.g. IEEE Annual Tech Symposium 2026" error={titleError} maxLength={100} />
      
      <div>
        <Lbl required>Type of Event</Lbl>
        <Pills options={EVENT_TYPES} value={d.event_type} onChange={(v) => set({ ...d, event_type: v, event_type_other: "" })} />
        <FieldValidationFeedback error={typeError} />
        {d.event_type === "Other" && <div style={{ marginTop: "12px" }}><ValidatedInput label="Specify Event Type" required value={d.event_type_other} onChange={(e) => set({ ...d, event_type_other: e.target.value })} placeholder="Describe your event type..." error={typeOtherError} /></div>}
      </div>

      <div>
        <Lbl required>Purpose / Objective</Lbl>
        <Pills options={PURPOSES} value={d.purpose_tag} onChange={(v) => set({ ...d, purpose_tag: v })} />
        <FieldValidationFeedback error={purposeError} />
      </div>

      <div>
        <ValidatedTextarea label="Brief Description" required value={d.purpose_desc} onChange={(e) => set({ ...d, purpose_desc: e.target.value })} placeholder="Explain the goals and expected outcomes of this event..." error={descError} wordCount={wc} minWords={20} maxWords={200} hint="Must be between 20-200 words" />
      </div>

      <div>
        <Lbl required>Date & Time</Lbl>
        <Grid2>
          <ValidatedInput label="Event Date" type="date" value={d.date} onChange={(e) => set({ ...d, date: e.target.value })} error={dateError} />
          <ValidatedInput label="Start Time" type="time" value={d.start_time} onChange={(e) => set({ ...d, start_time: e.target.value })} error={startTimeError} />
          <ValidatedInput label="End Time" type="time" value={d.end_time} onChange={(e) => set({ ...d, end_time: e.target.value })} error={endTimeError} />
          <ValidatedInput label="Setup Start" type="time" value={d.setup_time} onChange={(e) => set({ ...d, setup_time: e.target.value })} error={setupError} />
        </Grid2>
        <div style={{ marginTop: "14px", maxWidth: "50%" }}>
          <ValidatedInput label="Teardown End" type="time" value={d.teardown_time} onChange={(e) => set({ ...d, teardown_time: e.target.value })} error={teardownError} hint="When cleanup will be finished" />
        </div>
      </div>

      <div>
        <Lbl required>Target Audience</Lbl>
        <Pills options={AUDIENCES} value={d.audience} onChange={(v) => set({ ...d, audience: v })} />
        <FieldValidationFeedback error={audienceError} />
      </div>
    </div>
  );
}

function FStep2({ d, set }) {
  const orgNameError = !d.org_name?.trim() ? "Organization name is required." : d.org_name.trim().length < 3 ? "Name must be at least 3 characters." : null;
  const contactNameError = !d.contact_name?.trim() ? "Contact name is required." : d.contact_name.trim().length < 3 ? "Name must be at least 3 characters." : null;
  const contactIdError = !d.contact_id?.trim() ? "Student/Staff ID is required." : !isValidStudentStaffId(d.contact_id) ? "Invalid ID format. Use S/21/234." : null;
  const contactPhoneError = !d.contact_phone?.trim() ? "Phone number is required." : !isValidPhoneNumber(d.contact_phone) ? "Invalid phone format. Use 077 123 4567." : null;
  const contactEmailError = d.contact_email && !isValidEmail(d.contact_email) ? "Invalid email format." : null;
  const supervisorNameError = !d.supervisor_name?.trim() ? "Supervisor name is required." : d.supervisor_name.trim().length < 3 ? "Name must be at least 3 characters." : null;
  const supervisorDeptError = !d.supervisor_dept?.trim() ? "Department is required." : d.supervisor_dept.trim().length < 3 ? "Department name must be at least 3 characters." : null;
  const supervisorPhoneError = d.supervisor_phone && !isValidPhoneNumber(d.supervisor_phone) ? "Invalid phone format. Use 011 234 5678." : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SecHead icon={<Icon.Users />} title="Organizer Details" subtitle="The university needs to know who is accountable for this event." />
      
      <ValidatedInput label="Name of Organizing Body" required value={d.org_name} onChange={(e) => set({ ...d, org_name: e.target.value })} placeholder="e.g. IEEE Student Branch, Student Council" error={orgNameError} hint="The official name of your club or organization" />
      
      <InnerCard>
        <p style={{ margin: "0 0 14px", fontSize: "10px", fontWeight: "700", color: C.primary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: FONT }}>Primary Contact Person</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <ValidatedInput label="Full Name" required value={d.contact_name} onChange={(e) => set({ ...d, contact_name: e.target.value })} placeholder="e.g. Kavindu Perera" error={contactNameError} />
          <Grid2>
            <ValidatedInput label="Student / Staff ID" required value={d.contact_id} onChange={(e) => set({ ...d, contact_id: e.target.value })} placeholder="e.g. S/21/234" error={contactIdError} hint="Format: S/YY/XXX or E/YY/XXX" />
            <ValidatedInput label="Phone Number" required type="tel" value={d.contact_phone} onChange={(e) => set({ ...d, contact_phone: e.target.value })} placeholder="077 123 4567" error={contactPhoneError} hint="Include country code or 0 prefix" />
          </Grid2>
          <ValidatedInput label="Email Address" type="email" value={d.contact_email} onChange={(e) => set({ ...d, contact_email: e.target.value })} placeholder="kavindu@university.lk" error={contactEmailError} />
        </div>
      </InnerCard>

      <InnerCard>
        <p style={{ margin: "0 0 12px", fontSize: "10px", fontWeight: "700", color: C.primary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: FONT }}>Supervising Faculty / Staff Member</p>
        <InfoBox>Most universities require a Teacher-in-Charge to co-sign the event request.</InfoBox>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
          <ValidatedInput label="Supervisor Name" required value={d.supervisor_name} onChange={(e) => set({ ...d, supervisor_name: e.target.value })} placeholder="e.g. Dr. Nimali Fernando" error={supervisorNameError} />
          <Grid2>
            <ValidatedInput label="Department" required value={d.supervisor_dept} onChange={(e) => set({ ...d, supervisor_dept: e.target.value })} placeholder="e.g. Faculty of Engineering" error={supervisorDeptError} hint="Which faculty or department" />
            <ValidatedInput label="Contact Number" type="tel" value={d.supervisor_phone} onChange={(e) => set({ ...d, supervisor_phone: e.target.value })} placeholder="011 234 5678" error={supervisorPhoneError} />
          </Grid2>
        </div>
      </InnerCard>
    </div>
  );
}

function FStep3({ d, set }) {
  const conflicts = checkVenueConflict(d.venue, d.date);
  const venueInfo = VENUE_DATA.find((v) => v.name === d.venue);
  const sc = (s) => s === "available" ? { bg: "#E6F4ED", color: C.success, border: "#A7D7BE" } : s === "booked" ? { bg: C.primaryLight, color: C.text, border: C.border } : { bg: "#FFF4EC", color: C.secondary, border: "rgba(255,113,0,.3)" };
  
  const venueCapacityMap = {};
  if (VENUE_DATA) {
    VENUE_DATA.forEach((venue) => {
      const capacity = parseInt(venue.capacity);
      if (venue.name && capacity) {
        venueCapacityMap[venue.name] = capacity;
      }
    });
  }
  
  const venueError = !d.venue ? "Venue selection is required." : null;
  const venueOtherError = d.venue === "Other" && !d.venue_other?.trim() ? "Please describe the venue." : null;
  const attendanceError = !d.attendance ? "Expected attendance is required." : !isPositiveNumber(d.attendance) ? "Attendance must be a positive number." : d.venue && d.venue !== "Other" && venueCapacityMap[d.venue] && Number(d.attendance) > venueCapacityMap[d.venue] ? `Exceeds venue capacity of ${venueCapacityMap[d.venue]}.` : null;
  const powerDescError = (d.power === "High Voltage" || d.power === "Outdoor Extension") && !d.power_desc?.trim() ? "Power details required for this type." : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SecHead icon={<Icon.Venue />} title="Venue & Logistics" subtitle="Help the facilities team manage campus schedules and resources." />
      <div>
        <Lbl required>Proposed Venue</Lbl>
        <Sel value={d.venue || ""} onChange={(e) => set({ ...d, venue: e.target.value })} style={{ borderColor: venueError ? C.error : C.border }}>
          <option value="" disabled>Select a venue on campus...</option>
          {VENUES_LIST.map((v) => <option key={v} value={v}>{v}</option>)}
        </Sel>
        <FieldValidationFeedback error={venueError} />
        {venueInfo && (
          <div style={{ marginTop: "12px", background: C.neutral, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: C.primary, fontFamily: FONT }}>{venueInfo.name}</span>
              <span style={{ fontSize: "10px", fontWeight: "700", fontFamily: FONT, padding: "3px 10px", borderRadius: "100px", letterSpacing: "0.06em", ...(() => { const s = sc(venueInfo.status); return { background: s.bg, color: s.color, border: `1px solid ${s.border}` }; })() }}>{venueInfo.status.toUpperCase()}</span>
            </div>
            <div style={{ display: "flex", gap: "14px", marginBottom: "10px", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: C.textMuted, fontFamily: FONT }}><Icon.Capacity />Cap: <strong style={{ color: C.text }}>{venueInfo.capacity}</strong></span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: C.textMuted, fontFamily: FONT }}><Icon.Building />{venueInfo.block}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: C.textMuted, fontFamily: FONT }}><Icon.Tag />{venueInfo.type}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{venueInfo.features.map((f) => <span key={f} style={{ fontSize: "10px", fontFamily: FONT, padding: "3px 9px", borderRadius: "100px", background: C.primaryLight, color: C.text, fontWeight: "600" }}>{f}</span>)}</div>
          </div>
        )}
        {d.venue === "Other" && <div style={{ marginTop: "12px" }}><Lbl>Specify Venue</Lbl><Inp placeholder="Describe the venue..." value={d.venue_other || ""} onChange={(e) => set({ ...d, venue_other: e.target.value })} /></div>}
        {conflicts && conflicts.length > 0 ? (
          <div style={{ marginTop: "12px", background: "rgba(239,68,68,.08)", border: "1.5px solid rgba(239,68,68,.3)", borderRadius: "10px", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ color: C.secondary, display: "flex" }}><Icon.AlertCircle /></span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#7A3300", fontFamily: FONT }}>Conflict Detected - {conflicts.length} event{conflicts.length > 1 ? "s" : ""} already booked</span>
            </div>
            {conflicts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "rgba(255,113,0,.08)", borderRadius: "6px", marginBottom: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.secondary, flexShrink: 0 }} />
                <div><p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: C.text, fontFamily: FONT }}>{c.title}</p><p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: FONT }}>{c.org}</p></div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: "12px", background: C.primaryLight, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: C.primary, display: "flex" }}><Icon.CheckCircle size={16} /></span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: C.primary, fontFamily: FONT }}>{d.venue && d.date ? `No conflicts on this date - ${d.venue} is available` : "Select a venue and date to check availability."}</span>
          </div>
        )}
      </div>
      <div>
        <ValidatedInput label="Expected Attendance" required type="number" value={d.attendance} onChange={(e) => set({ ...d, attendance: e.target.value })} placeholder="e.g. 250" error={attendanceError} hint={d.venue && venueCapacityMap[d.venue] ? `Venue capacity: ${venueCapacityMap[d.venue]} people` : "Must not exceed venue fire safety capacity."} />
      </div>
      <div>
        <Lbl>Equipment Requirements</Lbl>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          {[ ["eq_projector", "Projector / Screen"], ["eq_sound", "Sound System / Microphones"], ["eq_chairs", "Extra Chairs / Tables"], ["eq_stage", "Stage / Podium"], ["eq_lighting", "Event Lighting"], ["eq_recording", "Recording / Streaming Setup"] ].map(([k, l]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={!!d[k]} onChange={(e) => set({ ...d, [k]: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: C.primary, cursor: "pointer" }} />
              <span style={{ fontSize: "13px", color: C.text, fontFamily: FONT }}>{l}</span>
            </label>
          ))}
        </div>
        <div style={{ marginTop: "12px" }}><Lbl>Other Equipment</Lbl><Inp placeholder="e.g. Tents, generators..." value={d.eq_other || ""} onChange={(e) => set({ ...d, eq_other: e.target.value })} /></div>
      </div>
      <div>
        <Lbl>Power Requirements</Lbl>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px", marginBottom: "10px" }}>
          {["Standard", "High Voltage", "Outdoor Extension", "None"].map((o) => (
            <button key={o} type="button" onClick={() => set({ ...d, power: o })} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontFamily: FONT, cursor: "pointer", border: `1.5px solid ${d.power === o ? C.primary : C.border}`, background: d.power === o ? C.primaryLight : C.white, color: d.power === o ? C.primary : C.textMuted, fontWeight: d.power === o ? "700" : "400" }}>{o}</button>
          ))}
        </div>
        {(d.power === "High Voltage" || d.power === "Outdoor Extension") && <ValidatedTextarea label="Power Details" value={d.power_desc} onChange={(e) => set({ ...d, power_desc: e.target.value })} placeholder="Describe power requirements in detail..." error={powerDescError} hint="Include voltage, amperage, cable length needed" rows={2} />}
      </div>
    </div>
  );
}

function FStep4({ d, set }) {
  const budgetError = !d.budget ? "Budget is required." : !isPositiveNumber(d.budget) ? "Budget must be positive." : Number(d.budget) < 1000 ? "Budget must be at least LKR 1,000." : Number(d.budget) > 1000000 ? "Budget exceeds 1M limit. Request special approval." : null;
  const fundSourceError = !Array.isArray(d.fund_source) || d.fund_source.length === 0 ? "Select at least one funding source." : null;
  const sponsorDetailsError = d.has_sponsors && !d.sponsor_details?.trim() ? "Sponsor details required." : d.has_sponsors && wordCount(d.sponsor_details) < 5 ? "Add more detail about sponsors (min 5 words)." : null;
  const sponsorBrandingError = d.has_sponsors && !d.sponsor_branding ? "Branding option required for sponsors." : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SecHead icon={<Icon.Finance />} title="Financials & Sponsorship" subtitle="Be transparent about how funds are managed and sourced." />
      <InfoBox>All financial information is subject to review. External sponsorships may require separate approval.</InfoBox>
      <ValidatedInput label="Estimated Total Budget (LKR)" required type="number" value={d.budget} onChange={(e) => set({ ...d, budget: e.target.value })} placeholder="e.g. 150000" error={budgetError} hint="Range: LKR 1,000 - 1,000,000" />
      <ValidatedTextarea label="Budget Breakdown" value={d.budget_breakdown} onChange={(e) => set({ ...d, budget_breakdown: e.target.value })} placeholder={"e.g.\nVenue setup - LKR 20,000\nSound & lighting - LKR 45,000\nPrinting - LKR 15,000"} hint="Itemize major expenses (optional)" rows={4} wordCount={wordCount(d.budget_breakdown)} minWords={5} />
      <div>
        <Lbl required>Source of Funding</Lbl>
        <Pills options={FUND_SOURCES} value={d.fund_source} multi onChange={(v) => set({ ...d, fund_source: v })} />
        <FieldValidationFeedback error={fundSourceError} />
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}><Lbl>External Sponsors?</Lbl><FormToggle value={!!d.has_sponsors} onChange={(v) => set({ ...d, has_sponsors: v })} /></div>
        {d.has_sponsors && (
          <InnerCard>
            <InfoBox>External sponsors require separate approval. Provide details for each sponsor.</InfoBox>
            <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <ValidatedTextarea label="Sponsor Names & Details" value={d.sponsor_details} onChange={(e) => set({ ...d, sponsor_details: e.target.value })} placeholder={"1. Dialog Axiata - Cash LKR 50,000\n2. McDonald's - Food provision"} error={sponsorDetailsError} wordCount={wordCount(d.sponsor_details)} minWords={5} rows={3} />
              <div>
                <Lbl>Sponsor Branding?</Lbl>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                  {["Yes - banners/logos", "Yes - digital only", "No branding"].map((o) => (
                    <button key={o} type="button" onClick={() => set({ ...d, sponsor_branding: o })} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontFamily: FONT, cursor: "pointer", border: `1.5px solid ${d.sponsor_branding === o ? C.primary : C.border}`, background: d.sponsor_branding === o ? C.primaryLight : C.white, color: d.sponsor_branding === o ? C.primary : C.textMuted, fontWeight: d.sponsor_branding === o ? "700" : "400" }}>{o}</button>
                  ))}
                </div>
                <FieldValidationFeedback error={sponsorBrandingError} />
              </div>
            </div>
          </InnerCard>
        )}
      </div>
    </div>
  );
}

function FStep5({ d, set }) {
  const securityError = !d.security ? "Security plan type is required." : null;
  const securityPlanError = !d.security_plan?.trim() ? "Security plan description is required." : wordCount(d.security_plan) < 10 ? `Add more detail (min 10 words, currently ${wordCount(d.security_plan)}).` : null;
  const foodVendorsError = d.has_food && !d.food_vendors?.trim() ? "Vendor details required." : d.has_food && wordCount(d.food_vendors) < 5 ? `Add more detail (min 5 words, currently ${wordCount(d.food_vendors)}).` : null;
  const speakerBiosError = d.has_speakers && !d.speaker_bios?.trim() ? "Speaker bios required." : d.has_speakers && wordCount(d.speaker_bios) < 10 ? `Add more detail (min 10 words, currently ${wordCount(d.speaker_bios)}).` : null;
  const emergencyPlanError = d.emergency_plan && d.emergency_plan.trim() && wordCount(d.emergency_plan) < 10 ? `Emergency plan needs ${10 - wordCount(d.emergency_plan)} more words.` : null;
  const declarationError = !d.declaration ? "You must confirm the declaration to proceed." : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SecHead icon={<Icon.Shield />} title="Risk Management & Safety" subtitle="This section determines whether your request is approved or flagged." />
      <InfoBox warn>Incomplete safety information is the most common reason event requests are rejected.</InfoBox>
      
      <div>
        <Lbl required>Security Plan</Lbl>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px", marginBottom: "12px" }}>
          {["Campus Security", "Private Security", "Volunteer Marshals", "No Security Needed"].map((o) => (
            <button key={o} type="button" onClick={() => set({ ...d, security: o })} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontFamily: FONT, cursor: "pointer", border: `1.5px solid ${d.security === o ? C.primary : C.border}`, background: d.security === o ? C.primaryLight : C.white, color: d.security === o ? C.primary : C.textMuted, fontWeight: d.security === o ? "700" : "400" }}>{o}</button>
          ))}
        </div>
        <FieldValidationFeedback error={securityError} />
        <ValidatedTextarea label="Security Plan Description" required rows={2} placeholder="Describe your crowd management and security plan..." value={d.security_plan} onChange={(e) => set({ ...d, security_plan: e.target.value })} error={securityPlanError} wordCount={wordCount(d.security_plan)} minWords={10} />
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}><Lbl>Food & Beverage Involved?</Lbl><FormToggle value={!!d.has_food} onChange={(v) => set({ ...d, has_food: v })} /></div>
        {d.has_food && <InnerCard><InfoBox>Food vendors must hold a valid health permit.</InfoBox><div style={{ marginTop: "14px" }}><ValidatedTextarea label="Vendor Names & Permit Status" required value={d.food_vendors} onChange={(e) => set({ ...d, food_vendors: e.target.value })} placeholder={"1. Cafe Delight - Permit valid Dec 2026"} error={foodVendorsError} wordCount={wordCount(d.food_vendors)} minWords={5} rows={3} /></div></InnerCard>}
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}><Lbl>External Guest Speakers / VIPs?</Lbl><FormToggle value={!!d.has_speakers} onChange={(v) => set({ ...d, has_speakers: v })} /></div>
        {d.has_speakers && <InnerCard><InfoBox>External VIPs are vetted by administration.</InfoBox><div style={{ marginTop: "14px" }}><ValidatedTextarea label="Speaker Bios" required value={d.speaker_bios} onChange={(e) => set({ ...d, speaker_bios: e.target.value })} placeholder={"1. Mr. Ashan Silva - CTO of TechCorp..."} error={speakerBiosError} wordCount={wordCount(d.speaker_bios)} minWords={10} rows={4} /></div></InnerCard>}
      </div>

      <div>
        <ValidatedTextarea label="Emergency / Evacuation Plan" value={d.emergency_plan} onChange={(e) => set({ ...d, emergency_plan: e.target.value })} placeholder="Describe what happens in case of a medical emergency, fire, or crowd incident..." error={emergencyPlanError} wordCount={d.emergency_plan ? wordCount(d.emergency_plan) : null} minWords={10} rows={3} hint="Recommended: describe medical response, fire evacuation, crowd issues" />
      </div>

      <div style={{ background: C.primaryLight, borderRadius: "12px", padding: "20px", border: `1px solid ${C.border}`, borderColor: declarationError ? C.error : C.border }}>
        <p style={{ margin: "0 0 12px", fontSize: "10px", fontWeight: "700", color: declarationError ? C.error : C.primary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: FONT }}>Declaration {!d.declaration && <span style={{ color: C.error }}>*</span>}</p>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
          <input type="checkbox" checked={!!d.declaration} onChange={(e) => set({ ...d, declaration: e.target.checked })} style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: C.primary, cursor: "pointer", flexShrink: 0, borderColor: declarationError ? C.error : C.border }} />
          <span style={{ fontSize: "13px", color: C.text, lineHeight: 1.6, fontFamily: FONT }}>I confirm that all information provided is accurate and complete. I understand that submitting false or misleading information may result in rejection and disciplinary action.</span>
        </label>
        <FieldValidationFeedback error={declarationError} />
      </div>
    </div>
  );
}

function FReview({ s1, s2, s3, s4, s5 }) {
  const sections = [
    { title: "Basic Event Info", rows: [["Title", s1.title], ["Type", s1.event_type === "Other" && s1.event_type_other ? `Other - ${s1.event_type_other}` : s1.event_type], ["Date", s1.date], ["Time", s1.start_time && s1.end_time ? `${s1.start_time} - ${s1.end_time}` : null], ["Audience", s1.audience]] },
    { title: "Organizer", rows: [["Org. Body", s2.org_name], ["Contact", s2.contact_name], ["Supervisor", s2.supervisor_name]] },
    { title: "Venue & Logistics", rows: [["Venue", s3.venue], ["Attendance", s3.attendance ? `${s3.attendance} people` : null], ["Power", s3.power]] },
    { title: "Financials", rows: [["Budget", s4.budget ? `LKR ${parseInt(s4.budget, 10).toLocaleString()}` : null], ["Funding", Array.isArray(s4.fund_source) ? s4.fund_source.join(", ") : s4.fund_source], ["Sponsors", s4.has_sponsors ? "Yes" : "No"]] },
    { title: "Risk & Safety", rows: [["Security", s5.security], ["Food & Bev", s5.has_food ? "Yes" : "No"], ["Speakers", s5.has_speakers ? "Yes" : "No"], ["Declaration", s5.declaration ? "Confirmed" : "Pending"]] },
  ];

  const allRows = sections.flatMap((s) => s.rows);
  const pct = Math.round((allRows.filter(([, v]) => v && v !== "No").length / allRows.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <SecHead icon={<Icon.Review />} title="Request Summary" subtitle="Review all information before submitting for administrative review." />
      {sections.map((sec) => (
        <div key={sec.title} style={{ borderRadius: "10px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ background: C.primaryLight, padding: "8px 16px", borderBottom: `1px solid ${C.border}` }}><p style={{ margin: 0, fontSize: "10px", fontWeight: "700", color: C.primary, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>{sec.title}</p></div>
          {sec.rows.filter(([, v]) => v).map(([k, v], i, a) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : "none", background: C.white }}>
              <span style={{ fontSize: "10px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>{k}</span>
              <span style={{ fontSize: "12px", fontWeight: "600", fontFamily: FONT, color: v === "Confirmed" ? "#2E8B57" : v === "Pending" ? C.secondary : C.text }}>{v}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={{ background: C.primary, borderRadius: "12px", padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}><span style={{ fontSize: "10px", color: "rgba(255,255,255,.55)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>Completion</span><span style={{ fontSize: "10px", color: C.secondary, background: "rgba(255,113,0,.15)", padding: "2px 10px", borderRadius: "100px", border: "1px solid rgba(255,113,0,.4)", fontFamily: FONT }}>Draft</span></div>
        <div style={{ fontSize: "28px", fontWeight: "700", color: C.white, fontFamily: FONT, marginBottom: "8px" }}>{pct}%</div>
        <div style={{ background: "rgba(255,255,255,.15)", borderRadius: "100px", height: "5px", overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: C.secondary, borderRadius: "100px", transition: "width .4s" }} /></div>
      </div>
      {!s5.declaration && <InfoBox warn>You must confirm the declaration in Step 5 before submitting.</InfoBox>}
    </div>
  );
}

export default function PermissionFormPage({ onBack, onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [s1, setS1] = useState({});
  const [s2, setS2] = useState({});
  const [s3, setS3] = useState({});
  const [s4, setS4] = useState({});
  const [s5, setS5] = useState({});
  const [stepErrors, setStepErrors] = useState([]);
  const [anim, setAnim] = useState(false);
  const TOTAL = 6;

  const goTo = (n) => {
    setStepErrors([]);
    setAnim(true);
    setTimeout(() => {
      setStep(n);
      setAnim(false);
    }, 180);
  };

  const wordCount = (txt) => (txt ? txt.trim().split(/\s+/).filter(Boolean).length : 0);

  // Build venue capacity map for validation
  const venueCapacityMap = {};
  if (VENUE_DATA) {
    VENUE_DATA.forEach((venue) => {
      const capacity = parseInt(venue.capacity);
      if (venue.name && capacity) {
        venueCapacityMap[venue.name] = capacity;
      }
    });
  }

  const validateStep = (n) => {
    if (n === 1) {
      return validateStep1(s1, venueCapacityMap);
    }
    if (n === 2) {
      return validateStep2(s2);
    }
    if (n === 3) {
      return validateStep3(s3, venueCapacityMap);
    }
    if (n === 4) {
      return validateStep4(s4);
    }
    if (n === 5) {
      return validateStep5(s5);
    }
    return [];
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (errs.length > 0) {
      setStepErrors(errs);
      return;
    }
    goTo(step + 1);
  };

  const handleSubmit = () => {
    const allErrs = [...validateStep(1), ...validateStep(2), ...validateStep(3), ...validateStep(4), ...validateStep(5)];
    if (allErrs.length > 0) {
      setStepErrors(allErrs);
      return;
    }
    onSubmitSuccess(s1.title);
  };

  const titles = ["Basic Event Information", "Organizer Details", "Venue & Logistics", "Financials & Sponsorship", "Risk Management & Safety", "Review & Submit"];
  const subs = ["Give administration a clear snapshot of your event.", "Establish accountability - who is responsible for this event.", "Help the facilities team manage campus resources.", "Be transparent about how funds are handled.", "This section determines whether your request is approved or flagged.", "Review all information before submitting."];
  const badges = ["BASIC EVENT INFO", "ORGANIZER DETAILS", "VENUE & LOGISTICS", "FINANCIALS", "RISK & SAFETY", "FINAL REVIEW"];
  const pct = Math.round(((step - 1) / TOTAL) * 100);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, padding: "12px 40px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.5)", fontSize: "11px", fontFamily: FONT, fontWeight: "600", padding: 0, display: "flex", alignItems: "center", gap: "5px" }}><Icon.ArrowLeft size={13} /> My Events</button>
          <span style={{ color: "rgba(255,255,255,.25)", fontSize: "11px" }}>›</span>
          <span style={{ fontSize: "11px", fontFamily: FONT, color: C.secondary, fontWeight: "600" }}>Request Permission</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(6,182,212,.12)", border: "1px solid rgba(6,182,212,.3)", borderRadius: "100px", padding: "3px 12px", marginBottom: "6px" }}><span style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.secondary, display: "block" }} /><span style={{ fontSize: "9px", fontWeight: "700", color: C.secondary, fontFamily: FONT, letterSpacing: "0.08em", textTransform: "uppercase" }}>{badges[step - 1]}</span></div>
            <h1 style={{ fontSize: "18px", fontWeight: "800", color: C.white, margin: "0 0 2px", lineHeight: 1, fontFamily: FONT, letterSpacing: "-0.02em" }}>{titles[step - 1]}</h1>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,.7)", margin: 0, fontFamily: FONT }}>{subs[step - 1]}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "10px", padding: "10px 14px", textAlign: "center", flexShrink: 0, minWidth: "90px" }}>
            <div style={{ fontSize: "20px", fontWeight: "800", color: C.white, fontFamily: FONT, lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: "8px", color: "rgba(255,255,255,.5)", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>Complete</div>
            <div style={{ marginTop: "6px", background: "rgba(255,255,255,.15)", borderRadius: "100px", height: "3px", overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: C.secondary, borderRadius: "100px", transition: "width .4s" }} /></div>
            <div style={{ fontSize: "8px", color: "rgba(255,255,255,.4)", marginTop: "2px", fontFamily: FONT }}>Step {step}/{TOTAL}</div>
          </div>
        </div>
      </div>

      {step <= 5 && (
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 40px", display: "flex", alignItems: "center", overflowX: "auto", flexShrink: 0 }}>
          {FORM_STEPS.map((s, i) => {
            const done = s.id < step;
            const active = s.id === step;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "13px 14px", borderBottom: `3px solid ${active ? C.secondary : "transparent"}` }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", fontFamily: FONT, background: done ? C.primary : active ? C.primaryLight : "transparent", color: done ? C.white : active ? C.primary : C.textDim, border: `2px solid ${done ? C.primary : active ? C.primary : C.border}` }}>{done ? <Icon.Check size={11} /> : s.num}</div>
                  <span style={{ fontSize: "12px", fontWeight: active ? "700" : "500", color: active ? C.primary : done ? C.textMuted : C.textDim, fontFamily: FONT, whiteSpace: "nowrap" }}>{s.label}</span>
                </div>
                {i < FORM_STEPS.length - 1 && <div style={{ width: "12px", height: "1px", background: C.border, flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 40px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          {stepErrors.length > 0 && (
            <div style={{ background: C.errorLight, border: `1px solid ${C.error}30`, borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: C.error, fontFamily: FONT }}>Please fix the following before continuing:</p>
              <ul style={{ margin: 0, paddingLeft: "18px", color: C.error, fontSize: "12px", lineHeight: 1.5, fontFamily: FONT }}>
                {stepErrors.map((err, i) => <li key={`${err}-${i}`}>{err}</li>)}
              </ul>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px", gap: "10px" }}>
            <button style={{ background: "none", border: `1px solid ${C.border}`, color: C.textMuted, fontSize: "12px", fontFamily: FONT, cursor: "pointer", padding: "7px 14px", borderRadius: "6px", fontWeight: "600" }}><span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Icon.Save /> Save Draft</span></button>
            <button style={{ background: "none", border: "none", color: C.textDim, fontSize: "12px", fontFamily: FONT, cursor: "pointer", padding: "7px 10px" }} onClick={onBack}>Exit</button>
          </div>
          <div style={{ background: C.white, borderRadius: "16px", padding: "36px", border: `1px solid ${C.border}`, boxShadow: "0 4px 24px rgba(5,54,104,.07)", opacity: anim ? 0 : 1, transform: anim ? "translateY(8px)" : "translateY(0)", transition: "opacity .18s, transform .18s" }}>
            {step === 1 && <FStep1 d={s1} set={setS1} />}
            {step === 2 && <FStep2 d={s2} set={setS2} />}
            {step === 3 && <FStep3 d={s3} set={setS3} />}
            {step === 4 && <FStep4 d={s4} set={setS4} />}
            {step === 5 && <FStep5 d={s5} set={setS5} />}
            {step === 6 && <FReview s1={s1} s2={s2} s3={s3} s4={s4} s5={s5} />}
          </div>
        </div>
      </div>

      <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 -4px 16px rgba(5,54,104,.06)" }}>
        <FormBtn variant={step === 1 ? "disabled" : "outline"} disabled={step === 1} onClick={() => goTo(step - 1)}>← Back</FormBtn>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => <div key={n} style={{ height: "6px", borderRadius: "100px", transition: "all .3s", width: n === step ? "24px" : "6px", background: n < step ? C.primary : n === step ? C.secondary : C.border }} />)}
        </div>
        {step < 5 && <FormBtn onClick={handleNext}>Next →</FormBtn>}
        {step === 5 && <FormBtn onClick={handleNext}>Review Request →</FormBtn>}
        {step === 6 && <FormBtn variant="secondary" onClick={handleSubmit}><span style={{ display: "flex", alignItems: "center", gap: "7px" }}><Icon.Review /> Submit Request</span></FormBtn>}
      </div>
    </div>
  );
}
