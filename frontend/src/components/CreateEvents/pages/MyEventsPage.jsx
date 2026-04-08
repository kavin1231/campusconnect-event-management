import { useState } from "react";
import { C, FONT, Icon, StatusBadge, TypeBadge } from "../designSystem";
import { getEventImage } from "../imageUtils";
import styles from "./MyEventsPage.module.css";

export default function MyEventsPage({ events, onSelectEvent, onNavigate }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = events.filter((e) => {
    const matchStatus = filter === "all" || e.status === filter;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <p className={styles.headerLabel} style={{ color: C.secondary }}>ORGANIZER PORTAL</p>
          <h1 className={styles.headerTitle} style={{ color: C.text }}>My Events</h1>
          <p className={styles.headerDescription} style={{ color: C.textMuted }}>Track and manage all events you have created and submitted.</p>
        </div>
        <button onClick={() => onNavigate("create")} className={styles.newEventBtn} style={{ background: C.primary, color: C.white }}>
          <Icon.Plus size={15} /> New Event Request
        </button>
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox} style={{ borderColor: C.border }}>
          <span className={styles.searchIcon}><Icon.Search /></span>
          <input placeholder="Search events..." className={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} style={{ color: C.text }} />
        </div>
        <div className={styles.filterButtons}>
          {["all", "pending", "approved", "published"].map((k) => (
            <button key={k} onClick={() => setFilter(k)} className={`${styles.filterBtn} ${filter === k ? styles.filterBtnActive : ""}`} style={{ 
              borderColor: filter === k ? C.primary : C.border, 
              background: filter === k ? C.primaryLight : C.white, 
              color: filter === k ? C.primary : C.textMuted 
            }}>
              {k[0].toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.eventsGrid}>
        {filtered.map((ev) => (
          <div key={ev.id} onClick={() => onSelectEvent(ev)} className={styles.eventCard} style={{ borderColor: C.border }}>
            <div className={styles.eventCardImage}>
              <img src={getEventImage(ev.id, ev.type)} alt={ev.title} onError={(e) => { e.target.style.opacity = "0.2"; }} />
              <div className={styles.eventCardBadges}>
                <TypeBadge type={ev.type} />
              </div>
              <div className={styles.eventCardDate}>
                <span className={styles.eventCardDateLabel} style={{ color: C.textMuted }}>{ev.date.split(" ")[0]}</span>
                <span className={styles.eventCardDateDay} style={{ color: C.primary }}>{ev.date.split(" ")[1].replace(",", "")}</span>
              </div>
            </div>
            <div className={styles.eventCardContent}>
              <div className={styles.eventCardInfo}>
                <h3 className={styles.eventCardTitle} style={{ color: C.text }}>{ev.title}</h3>
                <div className={styles.eventCardMeta} style={{ color: C.textMuted }}>
                  <span className={styles.eventCardMetaItem}><Icon.Clock size={11} />{ev.time}</span>
                  <span className={styles.eventCardMetaItem}><Icon.MapPin size={11} />{ev.venue}</span>
                </div>
              </div>
              <div className={styles.eventCardFooter}>
                <div className={styles.eventCardStatus}>
                  <StatusBadge status={ev.status} />
                </div>
                <span className={styles.eventCardChevron}><Icon.ChevronRight size={16} /></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
