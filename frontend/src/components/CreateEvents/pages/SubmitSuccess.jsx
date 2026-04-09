import { C, FONT, Icon, FormBtn } from "../designSystem";

export default function SubmitSuccess({ eventTitle, onBack }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: C.neutral }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: C.successLight, border: `2px solid ${C.success}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: C.success }}>
          <Icon.CheckCircle size={36} />
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: "800", color: C.text, marginBottom: "12px", fontFamily: FONT }}>Request Submitted!</h2>
        <p style={{ color: C.textMuted, fontSize: "14px", lineHeight: 1.8, marginBottom: "20px", fontFamily: FONT }}>
          Your permission request for <strong style={{ color: C.primary }}>{eventTitle || "your event"}</strong> has been submitted.
        </p>
        <FormBtn onClick={onBack}>Back to My Events</FormBtn>
      </div>
    </div>
  );
}
