import { useMemo, useState } from "react";
import Header from "../common/Header";
import ClubCard from "./components/ClubCard";
import ProfileCard from "./components/ProfileCard";
import MembersSection from "./components/MembersSection";
import EventCarousel from "./components/EventCarousel";
import { CLUBS } from "./clubsData";
import "./ClubsPage.css";

function ClubTabs({ clubs, activeClubId, onSelect }) {
  return (
    <div className="club-tabs">
      {clubs.map((club) => (
        <button
          key={club.id}
          type="button"
          className={`club-tab ${club.id === activeClubId ? "active" : ""}`}
          style={club.id === activeClubId ? { backgroundColor: club.color } : {}}
          onClick={() => onSelect(club.id)}
        >
          {club.name}
        </button>
      ))}
    </div>
  );
}

export default function ClubsPage() {
  const [activeClubId, setActiveClubId] = useState(CLUBS[0]?.id || "");
  const [query, setQuery] = useState("");

  const filteredClubs = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return CLUBS;
    return CLUBS.filter((club) => club.name.toLowerCase().includes(lower));
  }, [query]);

  const activeClub = useMemo(() => {
    const source = filteredClubs.length ? filteredClubs : CLUBS;
    return source.find((club) => club.id === activeClubId) || source[0];
  }, [activeClubId, filteredClubs]);

  return (
    <div className="clubs-page-root">
      <Header />

      <main className="clubs-page-main">
        <header className="clubs-page-header">
          <h1>Clubs Module</h1>
          <p>Explore clubs, leadership teams, committee members, and signature events.</p>
        </header>

        <section className="clubs-toolbar">
          <input
            type="text"
            placeholder="Search clubs..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p>{filteredClubs.length} clubs</p>
        </section>

        <ClubTabs clubs={filteredClubs.length ? filteredClubs : CLUBS} activeClubId={activeClub?.id} onSelect={setActiveClubId} />

        {activeClub ? (
          <>
            <ClubCard club={activeClub} />

            <section className="clubs-section">
              <h3>Leadership Team</h3>
              <div className="clubs-leadership-grid">
                <ProfileCard person={activeClub.leadership.president} label="President" color={activeClub.color} />
                <ProfileCard person={activeClub.leadership.vicePresident} label="Vice President" color={activeClub.color} />
                <ProfileCard person={activeClub.leadership.secretary} label="Secretary" color={activeClub.color} />
                <ProfileCard person={activeClub.leadership.treasurer} label="Treasurer" color={activeClub.color} />
              </div>
            </section>

            <section className="clubs-section">
              <h3>Members / Committee</h3>
              <MembersSection members={activeClub.members} color={activeClub.color} />
            </section>

            <section className="clubs-section">
              <h3>Events</h3>
              <EventCarousel events={activeClub.events} color={activeClub.color} />
            </section>
          </>
        ) : (
          <div className="clubs-empty">No clubs matched your search.</div>
        )}
      </main>
    </div>
  );
}
