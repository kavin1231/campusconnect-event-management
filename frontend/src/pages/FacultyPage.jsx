import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/common/Header";
import { Icon } from "../components/common/Icon";
import OrganizedEventsSection from "../components/events/OrganizedEventsSection";
import { FACULTY_DATA } from "../constants/facultyData";
import { eventsAPI } from "../services/api";
import "./FacultyPage.css";

const FACULTY_ORGANIZER_ALIASES = {
  "sliit business school": "Faculty of Business",
  "faculty of architechture": "School of Architecture",
};

const normalizeOrganizerId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function FacultyPage() {
  const [selectedFaculty, setSelectedFaculty] = useState(FACULTY_DATA[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const tabsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [organizedEventsLoading, setOrganizedEventsLoading] = useState(false);

  const getFacultyOrganizerId = (faculty) => {
    if (!faculty?.name) return "";
    const normalizedName = String(faculty.name).trim().toLowerCase();
    const organizerName = FACULTY_ORGANIZER_ALIASES[normalizedName] || faculty.name;
    return normalizeOrganizerId(organizerName);
  };

  const filteredFaculties = useMemo(() => {
    return FACULTY_DATA.filter((faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    if (!filteredFaculties.some((faculty) => faculty.id === selectedFaculty.id)) {
      setSelectedFaculty(filteredFaculties[0] || FACULTY_DATA[0]);
    }
  }, [filteredFaculties, selectedFaculty.id]);

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
  }, [filteredFaculties.length, selectedFaculty.id]);

  useEffect(() => {
    const fetchOrganizedEvents = async () => {
      if (!selectedFaculty?.name) {
        setOrganizedEvents([]);
        return;
      }

      setOrganizedEventsLoading(true);
      try {
        const response = await eventsAPI.listEvents({
          status: "PUBLISHED",
          organizerType: "FACULTY",
          organizerId: getFacultyOrganizerId(selectedFaculty),
        });

        if (response?.success) {
          setOrganizedEvents(response.events || []);
        } else {
          setOrganizedEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch faculty organized events:", error);
        setOrganizedEvents([]);
      } finally {
        setOrganizedEventsLoading(false);
      }
    };

    fetchOrganizedEvents();
  }, [selectedFaculty.id]);

  const scrollTabs = (dir) => {
    if (!tabsRef.current) return;
    tabsRef.current.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  return (
    <div className="faculty-page" style={{ "--faculty-theme": selectedFaculty.themeColor }}>
      <Header />

      <main className="faculty-main">
        <section className="faculty-card">
          <div className="faculty-header">
            <div>
              <h1 className="faculty-title">Faculty Module</h1>
              <p className="faculty-subtitle">
                Explore faculties, academic leadership, staff members, and signature events.
              </p>
            </div>

            <div className="faculty-stats">
              <div className="faculty-stat">
                <strong>{selectedFaculty.studentCount.toLocaleString()}</strong>
                <span>Students</span>
              </div>
              <div className="faculty-stat">
                <strong>{selectedFaculty.departments}</strong>
                <span>Departments</span>
              </div>
              <div className="faculty-stat">
                <strong>{selectedFaculty.established}</strong>
                <span>Established</span>
              </div>
            </div>
          </div>

          <div className="faculty-search">
            <Icon.Search size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculties by name..."
            />
          </div>

          <div className="faculty-tabs-wrap">
            {canScrollLeft && (
              <button
                onClick={() => scrollTabs("left")}
                className="faculty-scroll-btn"
                aria-label="Scroll left"
              >
                <Icon.ChevronLeft size={14} />
              </button>
            )}

            <div ref={tabsRef} onScroll={handleScroll} className="faculty-tabs">
              {filteredFaculties.map((faculty) => {
                const active = selectedFaculty.id === faculty.id;
                return (
                  <button
                    key={faculty.id}
                    onClick={() => setSelectedFaculty(faculty)}
                    className={active ? "faculty-tab active" : "faculty-tab"}
                    style={active ? { "--faculty-theme": faculty.themeColor } : undefined}
                  >
                    {faculty.name}
                  </button>
                );
              })}
            </div>

            {canScrollRight && (
              <button
                onClick={() => scrollTabs("right")}
                className="faculty-scroll-btn"
                aria-label="Scroll right"
              >
                <Icon.ChevronRight size={14} />
              </button>
            )}
          </div>

          <article className="faculty-hero">
            <div
              className="faculty-banner"
              style={{ backgroundImage: `url(${selectedFaculty.bannerImage})` }}
            >
              <div className="faculty-banner-content">
                <img src={selectedFaculty.logo} alt={selectedFaculty.name} className="faculty-banner-logo" />
                <div>
                  <h2>{selectedFaculty.name}</h2>
                  <p>{selectedFaculty.studentCount.toLocaleString()} active students</p>
                </div>
              </div>
            </div>

            <div className="faculty-content">
              <div>
                <h3>About</h3>
                <p>{selectedFaculty.description}</p>
              </div>

              <div>
                <h3>Mission</h3>
                <p>{selectedFaculty.mission}</p>
              </div>

              <OrganizedEventsSection
                title="Organized Events"
                subtitle={`Events organized by ${selectedFaculty.name}`}
                events={organizedEvents}
                loading={organizedEventsLoading}
                emptyText="No events available"
              />

              <div>
                <h3>Faculty Highlights</h3>
                <ul className="faculty-highlights">
                  {selectedFaculty.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Leadership Team</h3>
                <div className="faculty-grid">
                  {selectedFaculty.leadership.map((member, idx) => (
                    <div key={idx} className="faculty-person-card">
                      <img src={member.avatar} alt={member.name} />
                      <div>
                        <p className="faculty-role-tag">{member.role}</p>
                        <p className="faculty-name">{member.name}</p>
                        <p className="faculty-subrole">{member.subrole}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3>Academic Staff</h3>
                <div className="faculty-grid">
                  {selectedFaculty.staff.map((member, idx) => (
                    <div key={idx} className="faculty-person-card">
                      <img src={member.avatar} alt={member.name} />
                      <div>
                        <p className="faculty-role-tag">{member.role}</p>
                        <p className="faculty-name">{member.name}</p>
                      </div>
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
