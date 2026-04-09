export default function ProfileCard({ person, label, color }) {
  return (
    <article className="club-profile-card" style={{ borderColor: `${color}55` }}>
      <img src={person.image} alt={person.name} className="club-profile-image" loading="lazy" />
      <div>
        {label ? <p className="club-profile-label">{label}</p> : null}
        <h4>{person.name}</h4>
        <p>{person.designation || person.role}</p>
      </div>
    </article>
  );
}
