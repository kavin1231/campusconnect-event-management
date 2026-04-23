import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./OrganizedEventsSection.css";

const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "---", full: "Date TBD" };
  }

  return {
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    full: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }),
  };
};

export default function OrganizedEventsSection({
  title = "Organized Events",
  subtitle = "Events curated for this organizer",
  events = [],
  loading = false,
  emptyText = "No events available",
}) {
  const navigate = useNavigate();

  const preparedEvents = useMemo(
    () =>
      (events || []).map((event) => ({
        ...event,
        image: resolveMediaUrl(event.image),
        formattedDate: formatDate(event.date),
      })),
    [events],
  );

  return (
    <section className="org-events-section">
      <div className="org-events-heading">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {loading ? (
        <div className="org-events-state">
          <div className="org-events-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : preparedEvents.length === 0 ? (
        <div className="org-events-state">
          <p>{emptyText}</p>
        </div>
      ) : (
        <div className="org-events-grid">
          {preparedEvents.map((event) => (
            <article
              key={event.id}
              className="org-event-card"
              onClick={() => navigate(`/event/${event.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/event/${event.id}`);
                }
              }}
            >
              <div className="org-event-image-wrap">
                <div className="org-event-image-layer">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="org-event-image" />
                  ) : (
                    <div className="org-event-image org-event-image-placeholder" aria-hidden="true" />
                  )}
                  <div className="org-event-image-overlay" />
                </div>

                <div className="org-event-date-badge">
                  <span className="day">{event.formattedDate.day}</span>
                  <span className="month">{event.formattedDate.month}</span>
                </div>

                <div className="org-event-category-badge">
                  <span>{event.category || "General"}</span>
                </div>
              </div>

              <div className="org-event-body">
                <h4 className="org-event-title">{event.title}</h4>
                <div className="org-event-meta">
                  <div className="org-event-meta-item">
                    <span>{event.formattedDate.full}</span>
                  </div>
                  <div className="org-event-meta-item">
                    <span>{event.location || "TBD"}</span>
                  </div>
                </div>

                <div className="org-event-footer">
                  <button
                    className="org-event-register-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/event/${event.id}`);
                    }}
                  >
                    <span>Register Now</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
