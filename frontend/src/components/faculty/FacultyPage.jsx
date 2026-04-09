import { useEffect, useMemo, useState } from "react";
import Header from "../common/Header";
import { FACULTIES } from "./facultyData";
import "./FacultyPage.css";

function FacultyTabs({ faculties, activeId, onSelect }) {
  return (
    <div className="faculty-tabs">
      {faculties.map((faculty) => (
        <button
          key={faculty.id}
          type="button"
          className={`faculty-tab ${activeId === faculty.id ? "active" : ""}`}
          style={activeId === faculty.id ? { backgroundColor: faculty.color } : {}}
          onClick={() => onSelect(faculty.id)}
        >
          {faculty.name}
        </button>
      ))}
    </div>
  );
}

function PersonCard({ person, label, color }) {
  return (
    <article className="person-card" style={{ borderColor: `${color}55` }}>
      <img src={person.image} alt={person.name} className="person-image" />
      <div className="person-details">
        {label ? <span className="person-label">{label}</span> : null}
        <h4>{person.name}</h4>
        <p>{person.designation || person.profession}</p>
      </div>
    </article>
  );
}

function FacultyEventSlider({ events, color }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!events.length) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [events]);

  if (!events.length) {
    return <div className="events-empty">No faculty events available.</div>;
  }

  return (
    <div className="faculty-event-slider">
      <div className="faculty-event-stage">
        {events.map((eventItem, eventIndex) => {
          const active = index === eventIndex;
          return (
            <article
              key={eventItem.id}
              className={`faculty-event-card ${active ? "active" : ""}`}
            >
              <img src={eventItem.image} alt={eventItem.title} />
              <div className="event-overlay" />
              <div className="event-content">
                <h4>{eventItem.title}</h4>
                <p>{eventItem.date} · {eventItem.venue}</p>
              </div>
            </article>
          );
        })}

        <button
          className="event-nav prev"
          type="button"
          onClick={() => setIndex((prev) => (prev - 1 + events.length) % events.length)}
        >
          {"<"}
        </button>
        <button
          className="event-nav next"
          type="button"
          onClick={() => setIndex((prev) => (prev + 1) % events.length)}
        >
          {">"}
        </button>
      </div>

      <div className="event-dots">
        {events.map((eventItem, eventIndex) => (
          <button
            key={eventItem.id}
            type="button"
            onClick={() => setIndex(eventIndex)}
            className={`dot ${index === eventIndex ? "active" : ""}`}
            style={index === eventIndex ? { backgroundColor: color } : {}}
          />
        ))}
      </div>
    </div>
  );
}

export default function FacultyPage() {
  const [activeFacultyId, setActiveFacultyId] = useState(FACULTIES[0]?.id || "");

  const activeFaculty = useMemo(() => {
    return FACULTIES.find((item) => item.id === activeFacultyId) || FACULTIES[0];
  }, [activeFacultyId]);

  if (!activeFaculty) return null;

  return (
    <div className="faculty-page-root">
      <Header />
      <main className="faculty-page-main">
        <header className="faculty-page-header">
          <h1>Faculty Module</h1>
          <p>Explore faculties, leadership, academic staff, and upcoming faculty events.</p>
        </header>

        <FacultyTabs
          faculties={FACULTIES}
          activeId={activeFaculty.id}
          onSelect={setActiveFacultyId}
        />

        <section className="faculty-overview-card" style={{ borderColor: `${activeFaculty.color}55` }}>
          <div className="faculty-banner-wrap">
            <img src={activeFaculty.banner} alt={`${activeFaculty.name} banner`} className="faculty-banner" />
            <div className="faculty-banner-overlay" />
            <div className="faculty-banner-content">
              <span style={{ backgroundColor: activeFaculty.color }}>{activeFaculty.name}</span>
              <h2>Faculty Overview</h2>
            </div>
          </div>

          <div className="faculty-overview-body">
            <p>{activeFaculty.description}</p>
            <ul>
              {activeFaculty.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="faculty-section">
          <h3>Head of Faculty</h3>
          <PersonCard person={activeFaculty.head} label="Leadership" color={activeFaculty.color} />
        </section>

        <section className="faculty-section">
          <h3>Staff Members</h3>
          <div className="staff-grid">
            {activeFaculty.staff.map((member) => (
              <PersonCard
                key={`${member.name}-${member.profession}`}
                person={member}
                color={activeFaculty.color}
              />
            ))}
          </div>
        </section>

        <section className="faculty-section">
          <h3>Faculty Events</h3>
          <FacultyEventSlider events={activeFaculty.events} color={activeFaculty.color} />
        </section>
      </main>
    </div>
  );
}
