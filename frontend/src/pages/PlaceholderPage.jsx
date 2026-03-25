import { C, FONT } from "../constants/colors";
import { Icon } from "../components/common/Icon";
import { Btn } from "../components/common/Primitives";

export function PlaceholderPage({ title, icon, desc, action, onAction }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ textAlign: "center", maxWidth: "360px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: C.primary }}>
          {icon}
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: C.text, margin: "0 0 10px", fontFamily: FONT }}>
          {title}
        </h2>
        <p style={{ fontSize: "14px", color: C.textMuted, margin: "0 0 24px", fontFamily: FONT, lineHeight: 1.6 }}>
          {desc}
        </p>
        {action && <Btn onClick={onAction}>{action}</Btn>}
      </div>
    </div>
  );
}
