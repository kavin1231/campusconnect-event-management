import { useEffect, useState } from "react";

export default function EventCarousel({ events, color }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!events.length) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [events]);

  if (!events.length) {
    return <div className="club-events-empty">No events available.</div>;
  }

  return (
    <div className="club-events-slider">
      <div className="club-events-stage">
        {events.map((eventItem, eventIndex) => (
          <article
            key={eventItem.id}
            className={`club-event-card ${eventIndex === index ? "active" : ""}`}
          >
            <img src={eventItem.image} alt={eventItem.title} loading="lazy" />
            <div className="club-event-overlay" />
            <div className="club-event-content">
              <h4>{eventItem.title}</h4>
              <p className="club-event-date">{eventItem.date}</p>
              <p>{eventItem.description}</p>
            </div>
          </article>
        ))}

        <button
          className="club-event-nav prev"
          type="button"
          onClick={() => setIndex((prev) => (prev - 1 + events.length) % events.length)}
          aria-label="Previous club event"
        >
          {"<"}
        </button>
        <button
          className="club-event-nav next"
          type="button"
          onClick={() => setIndex((prev) => (prev + 1) % events.length)}
          aria-label="Next club event"
        >
          {">"}
        </button>
      </div>

      <div className="club-event-dots">
        {events.map((eventItem, eventIndex) => (
          <button
            key={eventItem.id}
            type="button"
            className={`club-dot ${eventIndex === index ? "active" : ""}`}
            style={eventIndex === index ? { backgroundColor: color } : {}}
            onClick={() => setIndex(eventIndex)}
            aria-label={`View ${eventItem.title}`}
          />
        ))}
      </div>
    </div>
  );
}
