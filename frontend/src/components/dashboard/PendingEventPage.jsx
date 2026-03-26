import React from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  primary: "#053668",
  secondary: "#FF7100",
  tertiary: "#F7ECB5",
  neutral: "#F9FAFB",
  white: "#FFFFFF",
  primaryLight: "#EBF1F9",
  secLight: "#FFF0E3",
  border: "#D1DCE8",
  text: "#0D1F33",
  textMuted: "#5A7494",
  textDim: "#A3B8CC",
  success: "#1B7F4B",
  error: "#D93025",
};

const FONT = "'Montserrat', sans-serif";

const TimelineStep = ({ label, done, current }) => (
  <div style={{
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    position: "relative",
  }}>
    <div
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        background: done ? C.success : current ? C.secondary : C.border,
        color: done || current ? C.white : C.textDim,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: "13px",
        fontWeight: "800",
        fontFamily: FONT,
        border: current ? `2px solid ${C.secondary}` : "none",
        boxShadow: current ? `0 0 0 3px rgba(255,113,0,.1)` : none,
      }}
    >
      {done ? "✓" : "○"}
    </div>
    <div style={{ flex: 1 }}>
      <p
        style={{
          margin: "0 0 2px",
          fontSize: "13px",
          fontWeight: "700",
          color: done || current ? C.text : C.textMuted,
          fontFamily: FONT,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "11px",
          color: C.textDim,
          fontFamily: FONT,
        }}
      >
        {current && "In progress..."}
        {done && "Completed"}
      </p>
    </div>
  </div>
);

export default function PendingEventPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        background: C.neutral,
        fontFamily: FONT,
      }}
    >
      {/* Main Content */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        <button
          onClick={() => navigate('/my-events')}
          style={{
            background: "none",
            border: "none",
            color: C.secondary,
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "13px",
            fontWeight: "700",
            fontFamily: FONT,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          ← Back
        </button>

        <div style={{ maxWidth: "600px" }}>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "28px",
              fontWeight: "800",
              color: C.text,
              letterSpacing: "-0.02em",
            }}
          >
            Tech Summit 2026
          </h1>
          <p
            style={{
              margin: "0 0 28px",
              fontSize: "13px",
              color: C.textMuted,
            }}
          >
            Awaiting administrator approval
          </p>

          {/* Alert Banner */}
          <div
            style={{
              background: C.secLight,
              border: `1.5px solid rgba(255,113,0,.3)`,
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              ⏳
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#7A3300",
                }}
              >
                Under Review
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#A05000",
                  lineHeight: "1.5",
                }}
              >
                Your event request is being reviewed by administrators. You'll receive an email notification once a decision is made.
              </p>
            </div>
          </div>

          {/* Event Details Card */}
          <div
            style={{
              background: C.white,
              borderRadius: "12px",
              border: `1px solid ${C.border}`,
              padding: "24px",
              boxShadow: "0 2px 8px rgba(5,54,104,.05)",
            }}
          >
            <h2
              style={{
                margin: "0 0 20px",
                fontWeight: "700",
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "11px",
              }}
            >
              Event Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: C.textDim,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                  }}
                >
                  Date & Time
                </label>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: "600",
                    color: C.text,
                  }}
                >
                  15 Apr 2026
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12px",
                    color: C.textMuted,
                  }}
                >
                  09:00 AM
                </p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: C.textDim,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                  }}
                >
                  Venue
                </label>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: "600",
                    color: C.text,
                  }}
                >
                  Main Auditorium
                </p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: C.textDim,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                  }}
                >
                  Expected Capacity
                </label>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: "600",
                    color: C.text,
                  }}
                >
                  500 Participants
                </p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: C.textDim,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                  }}
                >
                  Category
                </label>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: "600",
                    color: C.text,
                  }}
                >
                  Technology
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "24px",
                paddingTop: "24px",
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: C.textDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "10px",
                }}
              >
                Description
              </label>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: C.text,
                  lineHeight: "1.6",
                }}
              >
                Annual tech summit featuring industry leaders discussing emerging technologies,
                best practices, and future trends in technology and innovation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          width: "320px",
          background: C.white,
          borderLeft: `1px solid ${C.border}`,
          padding: "28px 24px",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            margin: "0 0 24px",
            fontSize: "11px",
            fontWeight: "700",
            color: C.textDim,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Approval Timeline
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <TimelineStep label="Request Submitted" done={true} />
          <TimelineStep label="Under Review" done={false} current={true} />
          <TimelineStep label="Final Approval" done={false} />
        </div>

        <div
          style={{
            marginTop: "32px",
            padding: "16px",
            background: C.primaryLight,
            borderRadius: "10px",
            border: `1px solid rgba(5,54,104,.1)`,
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "11px",
              fontWeight: "700",
              color: C.primary,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            💡 Tip
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: C.primary,
              lineHeight: "1.5",
            }}
          >
            Review typically completes within 3-5 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
