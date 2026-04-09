import { useState } from "react";
import ProfileCard from "./ProfileCard";

export default function MembersSection({ members, color }) {
  const [mobileIndex, setMobileIndex] = useState(0);

  const current = members[mobileIndex] || null;

  return (
    <section className="club-members-wrap">
      <div className="club-members-grid">
        {members.map((member) => (
          <ProfileCard
            key={`${member.name}-${member.role}`}
            person={member}
            label={member.role}
            color={color}
          />
        ))}
      </div>

      <div className="club-members-mobile-slider">
        {current ? <ProfileCard person={current} label={current.role} color={color} /> : null}
        <div className="club-members-mobile-controls">
          <button
            type="button"
            onClick={() => setMobileIndex((prev) => (prev - 1 + members.length) % members.length)}
            aria-label="Previous member"
          >
            {"<"}
          </button>
          <span>{members.length ? `${mobileIndex + 1}/${members.length}` : "0/0"}</span>
          <button
            type="button"
            onClick={() => setMobileIndex((prev) => (prev + 1) % members.length)}
            aria-label="Next member"
          >
            {">"}
          </button>
        </div>
      </div>
    </section>
  );
}
