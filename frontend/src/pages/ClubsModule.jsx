import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/common/Header";
import { Icon } from "../components/common/Icon";
import OrganizedEventsSection from "../components/events/OrganizedEventsSection";
import { CLUBS_DATA } from "../constants/clubsData";
import { eventsAPI } from "../services/api";
import "./ClubsModule.css";

const CLUB_ORGANIZER_ALIASES = {
  "rotaract club": "Rotaract Club of SLIIT",
  "arts & culture": "SLIIT Arts Society",
  "photography club": "SLIIT Photography Club",
};

const normalizeOrganizerId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function ClubsModule() {
  const [selectedClub, setSelectedClub] = useState(CLUBS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const tabsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [organizedEventsLoading, setOrganizedEventsLoading] = useState(false);

  const getClubOrganizerId = (club) => {
    if (!club?.name) return "";
    const normalizedName = String(club.name).trim().toLowerCase();
    const organizerName = CLUB_ORGANIZER_ALIASES[normalizedName] || club.name;
    return normalizeOrganizerId(organizerName);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    try {
      const user = JSON.parse(storedUser);
      const role = user?.role?.toUpperCase();
      setCanEdit(["CLUB_PRESIDENT", "SYSTEM_ADMIN", "EVENT_ORGANIZER"].includes(role));
    } catch {
      setCanEdit(false);
    }
  }, []);

  const filteredClubs = useMemo(() => {
    return CLUBS_DATA.filter((club) => club.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  useEffect(() => {
    if (!filteredClubs.some((club) => club.id === selectedClub.id)) {
      setSelectedClub(filteredClubs[0] || CLUBS_DATA[0]);
    }
  }, [filteredClubs, selectedClub.id]);

  const handleScroll = () => {
    if (!tabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    handleScroll();

    const onResize = () => handleScroll();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [filteredClubs.length, selectedClub.id]);

  useEffect(() => {
    const fetchOrganizedEvents = async () => {
      if (!selectedClub?.id) {
        setOrganizedEvents([]);
        return;
      }

      setOrganizedEventsLoading(true);
      try {
        const response = await eventsAPI.listEvents({
          status: "PUBLISHED",
          organizerType: "CLUB",
          organizerId: getClubOrganizerId(selectedClub),
        });

        if (response?.success) {
          setOrganizedEvents(response.events || []);
        } else {
          setOrganizedEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch club organized events:", error);
        setOrganizedEvents([]);
      } finally {
        setOrganizedEventsLoading(false);
      }
    };

    fetchOrganizedEvents();
  }, [selectedClub.id]);

  const scrollTabs = (dir) => {
    if (!tabsRef.current) return;
    tabsRef.current.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  const handleEditClick = () => {
    setEditData({ ...selectedClub });
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    if (!editData) return;
    const idx = CLUBS_DATA.findIndex((c) => c.id === editData.id);
    if (idx >= 0) {
      CLUBS_DATA[idx] = { ...editData };
      setSelectedClub({ ...editData });
    }
    setEditMode(false);
    setEditData(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData(null);
  };

  const handleEditFieldChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="clubs-page" style={{ "--club-theme": selectedClub.themeColor }}>
      <Header />

      {editMode && editData && canEdit && (
        <div className="clubs-modal-backdrop">
          <div className="clubs-modal">
            <div className="clubs-modal-head">
              <h2>Edit Club Details</h2>
              <button onClick={handleCancelEdit} className="clubs-modal-close" aria-label="Close edit modal">
                x
              </button>
            </div>

            <div className="clubs-edit-form">
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleEditFieldChange("name", e.target.value)}
                className="clubs-input"
              />
              <textarea
                rows={3}
                value={editData.description}
                onChange={(e) => handleEditFieldChange("description", e.target.value)}
                className="clubs-textarea"
              />
              <textarea
                rows={2}
                value={editData.mission}
                onChange={(e) => handleEditFieldChange("mission", e.target.value)}
                className="clubs-textarea"
              />
              <div className="clubs-edit-inline">
                <input
                  type="number"
                  value={editData.memberCount}
                  onChange={(e) => handleEditFieldChange("memberCount", Number(e.target.value) || 0)}
                  className="clubs-input"
                />
                <input
                  type="color"
                  value={editData.themeColor}
                  onChange={(e) => handleEditFieldChange("themeColor", e.target.value)}
                  className="clubs-color-input"
                />
              </div>
            </div>

            <div className="clubs-modal-actions">
              <button onClick={handleSaveEdit} className="clubs-save-btn">
                Save Changes
              </button>
              <button onClick={handleCancelEdit} className="clubs-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="clubs-main">
        <section className="clubs-section-card">
          <div className="clubs-header">
            <div>
              <h1 className="clubs-title">Clubs Module</h1>
              <p className="clubs-subtitle">
                Explore clubs, leadership teams, committee members, and signature events.
              </p>
            </div>
            {canEdit && (
              <button onClick={handleEditClick} className="clubs-edit-btn">
                Edit Club
              </button>
            )}
          </div>

          <div className="clubs-search">
            <Icon.Search size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs by name..."
            />
          </div>

          <div className="clubs-tabs-wrap">
            {canScrollLeft && (
              <button onClick={() => scrollTabs("left")} className="clubs-scroll-btn" aria-label="Scroll left">
                <Icon.ChevronLeft size={14} />
              </button>
            )}

            <div
              ref={tabsRef}
              onScroll={handleScroll}
              className="clubs-tabs"
            >
              {filteredClubs.map((club) => {
                const active = selectedClub.id === club.id;
                return (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClub(club)}
                    className={active ? "clubs-tab active" : "clubs-tab"}
                    style={active ? { "--club-theme": club.themeColor } : undefined}
                  >
                    {club.name}
                  </button>
                );
              })}
            </div>

            {canScrollRight && (
              <button onClick={() => scrollTabs("right")} className="clubs-scroll-btn" aria-label="Scroll right">
                <Icon.ChevronRight size={14} />
              </button>
            )}
          </div>

          <article className="clubs-hero">
            <div
              className="clubs-banner"
              style={{ backgroundImage: `url(${selectedClub.bannerImage})` }}
            >
              <div className="clubs-banner-content">
                <img src={selectedClub.logo} alt={selectedClub.name} className="clubs-banner-logo" />
                <div>
                  <h2>{selectedClub.name}</h2>
                  <p>{selectedClub.memberCount} active members</p>
                </div>
              </div>
            </div>

            <div className="clubs-content">
              <div>
                <h3>About</h3>
                <p>{selectedClub.description}</p>
              </div>

              <div>
                <h3>Mission</h3>
                <p>{selectedClub.mission}</p>
              </div>

              <OrganizedEventsSection
                title="Organized Events"
                subtitle={`Events organized by ${selectedClub.name}`}
                events={organizedEvents}
                loading={organizedEventsLoading}
                emptyText="No events available"
              />

              <div>
                <h3>Leadership Team</h3>
                <div className="clubs-grid">
                  {selectedClub.leadership.map((member, idx) => (
                    <div key={idx} className="clubs-person-card">
                      <img src={member.avatar} alt={member.name} />
                      <div>
                        <p className="clubs-role-tag">{member.role}</p>
                        <p className="clubs-name">{member.name}</p>
                        <p className="clubs-subrole">{member.subrole}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3>Members / Committee</h3>
                <div className="clubs-committee-grid">
                  {selectedClub.members.map((member, idx) => (
                    <div key={idx} className="clubs-committee-card">
                      <img src={member.avatar} alt={member.name} />
                      <p className="clubs-role-tag">{member.role}</p>
                      <h5 className="clubs-name">{member.name}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
