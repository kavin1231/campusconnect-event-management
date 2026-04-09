import { C, FONT } from "./designSystem";
import { Icon } from "./designSystem";

export function ValidatedInput({ 
  label, 
  required, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  error = null,
  hint = null,
  maxLength = null,
  style = {}
}) {
  const hasError = !!error;
  
  return (
    <div>
      <label style={{ display: "block", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: hasError ? C.error : C.textMuted, fontFamily: FONT, marginBottom: "7px" }}>
        {label}
        {required && <span style={{ color: C.secondary, marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        maxLength={maxLength}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: `1.5px solid ${hasError ? C.error : C.border}`,
          fontSize: "13px",
          fontFamily: FONT,
          backgroundColor: hasError ? "rgba(239, 68, 68, 0.08)" : C.white,
          color: C.text,
          transition: "all 0.2s",
          outline: "none",
          ...style
        }}
        onFocus={(e) => e.target.style.borderColor = C.primary}
        onBlur={(e) => e.target.style.borderColor = hasError ? C.error : C.border}
      />
      <div style={{ marginTop: "6px", minHeight: "20px" }}>
        {error && (
          <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
            <span style={{ color: C.error, display: "flex", flexShrink: 0, marginTop: "1px" }}><Icon.AlertCircle size={12} /></span>
            <span style={{ fontSize: "11px", color: C.error, lineHeight: 1.4, fontFamily: FONT }}>{error}</span>
          </div>
        )}
        {!error && hint && (
          <p style={{ fontSize: "11px", color: C.textMuted, margin: 0, fontFamily: FONT }}>{hint}</p>
        )}
      </div>
    </div>
  );
}

export function ValidatedTextarea({
  label,
  required,
  value,
  onChange,
  placeholder,
  rows = 3,
  error = null,
  hint = null,
  wordCount = null,
  minWords = null,
  maxWords = null,
  style = {}
}) {
  const hasError = !!error;
  const wc = wordCount || 0;
  const warningColor = wc > 0 && minWords && wc < minWords ? C.secondary : wc > 0 && maxWords && wc > maxWords ? C.error : wc > 0 && minWords && wc >= minWords && (!maxWords || wc <= maxWords) ? C.success || "#22a96d" : C.textDim;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "7px" }}>
        <label style={{ display: "block", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: hasError ? C.error : C.textMuted, fontFamily: FONT }}>
          {label}
          {required && <span style={{ color: C.secondary, marginLeft: 3 }}>*</span>}
        </label>
        {wordCount !== null && (
          <span style={{ fontSize: "10px", fontFamily: FONT, color: warningColor, fontWeight: "600" }}>
            {wc}{maxWords ? `/${maxWords}` : minWords ? ` (min ${minWords})` : ""}
          </span>
        )}
      </div>
      <textarea
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        rows={rows}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: `1.5px solid ${hasError ? C.error : C.border}`,
          fontSize: "13px",
          fontFamily: FONT,
          backgroundColor: hasError ? "rgba(239, 68, 68, 0.08)" : C.white,
          color: C.text,
          transition: "all 0.2s",
          outline: "none",
          resize: "vertical",
          ...style
        }}
        onFocus={(e) => e.target.style.borderColor = C.primary}
        onBlur={(e) => e.target.style.borderColor = hasError ? C.error : C.border}
      />
      <div style={{ marginTop: "6px", minHeight: "20px" }}>
        {error && (
          <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
            <span style={{ color: C.error, display: "flex", flexShrink: 0, marginTop: "1px" }}><Icon.AlertCircle size={12} /></span>
            <span style={{ fontSize: "11px", color: C.error, lineHeight: 1.4, fontFamily: FONT }}>{error}</span>
          </div>
        )}
        {!error && hint && (
          <p style={{ fontSize: "11px", color: C.textMuted, margin: 0, fontFamily: FONT }}>{hint}</p>
        )}
      </div>
    </div>
  );
}

export function ValidatedSelect({
  label,
  required,
  value,
  onChange,
  options,
  error = null,
  hint = null,
  style = {}
}) {
  const hasError = !!error;

  return (
    <div>
      <label style={{ display: "block", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: hasError ? C.error : C.textMuted, fontFamily: FONT, marginBottom: "7px" }}>
        {label}
        {required && <span style={{ color: C.secondary, marginLeft: 3 }}>*</span>}
      </label>
      <select
        value={value || ""}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: `1.5px solid ${hasError ? C.error : C.border}`,
          fontSize: "13px",
          fontFamily: FONT,
          backgroundColor: C.neutral,
          color: value ? C.text : C.textMuted,
          transition: "all 0.2s",
          outline: "none",
          cursor: "pointer",
          ...style
        }}
        onFocus={(e) => e.target.style.borderColor = C.primary}
        onBlur={(e) => e.target.style.borderColor = hasError ? C.error : C.border}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div style={{ marginTop: "6px", minHeight: "20px" }}>
        {error && (
          <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
            <span style={{ color: C.error, display: "flex", flexShrink: 0, marginTop: "1px" }}><Icon.AlertCircle size={12} /></span>
            <span style={{ fontSize: "11px", color: C.error, lineHeight: 1.4, fontFamily: FONT }}>{error}</span>
          </div>
        )}
        {!error && hint && (
          <p style={{ fontSize: "11px", color: C.textMuted, margin: 0, fontFamily: FONT }}>{hint}</p>
        )}
      </div>
    </div>
  );
}

export function FieldValidationFeedback({ error, hint, success = false, wordCount = null, maxWords = null, minWords = null }) {
  if (!error && !hint && !success && wordCount === null) return null;

  let displayColor = C.textMuted;
  let displayText = hint;
  let displayIcon = null;

  if (error) {
    displayColor = C.error;
    displayText = error;
    displayIcon = <Icon.AlertCircle size={12} />;
  } else if (success && wordCount !== null) {
    displayColor = "#22a96d";
    displayIcon = <Icon.Check size={12} />;
    displayText = `Valid (${wordCount}${maxWords ? `/${maxWords}` : ""} words)`;
  } else if (wordCount !== null && minWords && wordCount < minWords) {
    displayColor = C.secondary;
    displayText = `${wordCount}/${minWords} words minimum`;
  } else if (wordCount !== null && maxWords && wordCount > maxWords) {
    displayColor = C.error;
    displayText = `${wordCount}/${maxWords} words (exceeds limit)`;
  }

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginTop: "6px" }}>
      {displayIcon && <span style={{ color: displayColor, display: "flex", flexShrink: 0, marginTop: "1px" }}>{displayIcon}</span>}
      <span style={{ fontSize: "11px", color: displayColor, lineHeight: 1.4, fontFamily: FONT }}>{displayText}</span>
    </div>
  );
}
