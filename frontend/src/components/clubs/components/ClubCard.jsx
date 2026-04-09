export default function ClubCard({ club }) {
  return (
    <section className="club-hero-card" style={{ borderColor: `${club.color}55` }}>
      <div className="club-hero-banner-wrap">
        <img src={club.banner} alt={`${club.name} banner`} className="club-hero-banner" loading="lazy" />
        <div className="club-hero-overlay" />
        <div className="club-hero-content">
          <span style={{ backgroundColor: club.color }}>{club.name}</span>
          <h2>{club.name}</h2>
        </div>
      </div>

      <div className="club-hero-body">
        <p>{club.description}</p>
        <div className="club-mission" style={{ borderColor: `${club.color}55` }}>
          <strong>Mission:</strong> {club.mission}
        </div>
      </div>
    </section>
  );
}
