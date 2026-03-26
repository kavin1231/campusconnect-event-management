import React from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  primary: "#053668",
  secondary: "#FF7100",
  tertiary: "#F7ECB5",
  neutral: "#F9FAFB",
  white: "#FFFFFF",
  primaryLight: "#EBF1F9",
  border: "#D1DCE8",
  text: "#0D1F33",
  textMuted: "#5A7494",
  textDim: "#A3B8CC",
  pending: "#FF7100",
  approved: "#1B7F4B",
  published: "#053668",
  error: "#D93025",
};

const FONT = "'Montserrat', sans-serif";

const StatusBadge = ({ status }) => {
  const colors = {
    pending: { bg: "rgba(255,113,0,.1)", text: "#FF7100" },
    approved: { bg: "rgba(27,127,75,.1)", text: "#1B7F4B" },
    published: { bg: "rgba(5,54,104,.1)", text: "#053668" }
  };
  const color = colors[status];

  return (
    <span style={{
      background: color.bg,
      color: color.text,
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "capitalize",
      fontFamily: FONT,
      border: `1px solid ${color.text}20`,
    }}>
      • {status}
    </span>
  );
};

const EventCard = ({ event, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: "12px",
      padding: "18px 20px",
      cursor: "pointer",
      transition: "all .3s ease",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "12px",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 6px 24px rgba(5,54,104,.12)";
      e.currentTarget.style.transform = "translateX(4px)";
      e.currentTarget.style.borderColor = C.secondary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,54,104,.05)";
      e.currentTarget.style.transform = "translateX(0)";
      e.currentTarget.style.borderColor = C.border;
    }}
  >
    <div style={{
      width: "4px",
      height: "60px",
      borderRadius: "8px",
      background: event.status === "pending" ? C.secondary : event.status === "approved" ? C.approved : C.primary,
      flexShrink: 0,
    }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{
        margin: "0 0 6px",
        fontSize: "14px",
        fontWeight: "700",
        color: C.text,
        fontFamily: FONT,
      }}>
        {event.title}
      </p>
      <div style={{
        display: "flex",
        gap: "16px",
        fontSize: "12px",
        color: C.textMuted,
        fontFamily: FONT,
      }}>
        <span>📅 {event.date}</span>
        <span>⏰ {event.time}</span>
        <span>📍 {event.venue}</span>
      </div>
    </div>
    <StatusBadge status={event.status} />
    <div style={{
      fontSize: "18px",
      color: C.secondary,
      opacity: 0.6,
      transition: "all .2s",
    }}>
      →
    </div>
  </div>
);

export default function MyEventsPage() {
  const navigate = useNavigate();

  const mockEvents = [
    { id: 1, title: 'Tech Summit 2026', date: '15 Apr 2026', time: '09:00 AM', venue: 'Main Auditorium', status: 'pending' },
    { id: 2, title: 'AI Workshop', date: '20 Apr 2026', time: '02:00 PM', venue: 'Lab A', status: 'approved' },
    { id: 3, title: 'Web Dev Bootcamp', date: '25 Apr 2026', time: '10:00 AM', venue: 'IT Center', status: 'published' },
    { id: 4, title: 'Mobile Dev Meetup', date: '30 Apr 2026', time: '03:00 PM', venue: 'Room 101', status: 'pending' },
    { id: 5, title: 'Cloud Computing Seminar', date: '05 May 2026', time: '11:00 AM', venue: 'Auditorium B', status: 'published' }
  ];

  const handleEventClick = (event) => {
    if (event.status === 'pending') {
      navigate(`/my-events/${event.id}/pending`);
    } else if (event.status === 'approved') {
      navigate(`/my-events/${event.id}/setup`);
    } else if (event.status === 'published') {
      navigate(`/my-events/${event.id}/published`);
    }
  };

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "28px 32px",
      background: C.neutral,
      fontFamily: FONT,
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
        }}>
          <div>
            <p style={{
              margin: "0 0 6px",
              fontSize: "11px",
              fontWeight: "700",
              color: C.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}>
              ORGANIZER
            </p>
            <h1 style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "800",
              color: C.text,
              letterSpacing: "-0.02em",
            }}>
              My Events
            </h1>
          </div>
          <button
            style={{
              padding: "12px 24px",
              background: C.secondary,
              color: C.white,
              border: "none",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: FONT,
              boxShadow: "0 4px 12px rgba(255,113,0,.25)",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e06200";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.secondary;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            + New Event
          </button>
        </div>

        {/* Events Cards */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {mockEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </div>

        {/* Info Box */}
        {mockEvents.length === 0 && (
          <div style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
          }}>
            <p style={{
              fontSize: "28px",
              margin: "0 0 12px",
            }}>
              📭
            </p>
            <p style={{
              margin: "0 0 8px",
              fontSize: "16px",
              fontWeight: "700",
              color: C.text,
            }}>
              No events yet
            </p>
            <p style={{
              margin: 0,
              fontSize: "13px",
              color: C.textMuted,
            }}>
              Create your first event to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
