import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { C, FONT } from "../constants/colors";
import { Icon } from "../components/common/Icon";
import { CLUBS_DATA } from "../constants/clubsData";

const NAV_ITEMS = [
  { key: "explore", label: "Explore", to: "/" },
  { key: "dashboard", label: "Dashboard", to: "/dashboard" },
  { key: "clubs", label: "Clubs", to: "/clubs" },
  { key: "logistics", label: "Logistics", to: "/logistics" },
  { key: "create", label: "Create Events", to: "/create-events" },
];

export function ClubsModule() {
  const location = useLocation();
  const [selectedClub, setSelectedClub] = useState(CLUBS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const tabsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    <>
      {editMode && editData && canEdit && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(5, 18, 46, 0.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "min(620px, 100%)",
              background: C.white,
              borderRadius: "14px",
              border: `1px solid ${C.border}`,
              boxShadow: "0 22px 50px rgba(5,54,104,.25)",
              padding: "22px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h2 style={{ margin: 0, color: C.text, fontFamily: FONT, fontSize: "24px", fontWeight: 800 }}>Edit Club Details</h2>
              <button
                onClick={handleCancelEdit}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  border: `1px solid ${C.border}`,
                  background: C.neutral,
                  color: C.textMuted,
                  cursor: "pointer",
                }}
              >
                x
              </button>
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleEditFieldChange("name", e.target.value)}
                style={inputStyle}
              />
              <textarea
                rows={3}
                value={editData.description}
                onChange={(e) => handleEditFieldChange("description", e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <textarea
                rows={2}
                value={editData.mission}
                onChange={(e) => handleEditFieldChange("mission", e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: "10px" }}>
                <input
                  type="number"
                  value={editData.memberCount}
                  onChange={(e) => handleEditFieldChange("memberCount", Number(e.target.value) || 0)}
                  style={inputStyle}
                />
                <input
                  type="color"
                  value={editData.themeColor}
                  onChange={(e) => handleEditFieldChange("themeColor", e.target.value)}
                  style={{ ...inputStyle, padding: "6px", cursor: "pointer" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: selectedClub.themeColor,
                  color: C.white,
                  cursor: "pointer",
                  fontFamily: FONT,
                  fontWeight: 700,
                }}
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  borderRadius: "10px",
                  border: `1px solid ${C.border}`,
                  background: C.neutral,
                  color: C.textMuted,
                  cursor: "pointer",
                  fontFamily: FONT,
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: C.neutral,
        }}
      >
        <div
          style={{
            height: "70px",
            background: C.primary,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 26px",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <img
                src="/logo/Nexora event logo design.png"
                alt="NEXORA"
                style={{ width: "36px", height: "28px", objectFit: "contain", background: C.white, borderRadius: "4px", padding: "3px" }}
              />
              <span style={{ color: C.white, fontFamily: FONT, fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                NEXORA
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.key}
                    to={item.to}
                    style={{
                      textDecoration: "none",
                      color: active ? C.secondary : "rgba(255,255,255,0.85)",
                      borderBottom: active ? `2px solid ${C.secondary}` : "2px solid transparent",
                      paddingBottom: "2px",
                      fontSize: "14px",
                      fontFamily: FONT,
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div
            style={{
              width: "210px",
              height: "38px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 10px",
            }}
          >
            <Icon.Search size={14} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: FONT }}>Search...</span>
          </div>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <div>
              <h1 style={{ margin: "0 0 4px", fontSize: "30px", color: C.text, fontFamily: FONT, fontWeight: 800 }}>
                Clubs Module
              </h1>
              <p style={{ margin: 0, fontSize: "14px", color: C.textMuted, fontFamily: FONT }}>
                Explore clubs, leadership teams, committee members, and signature events.
              </p>
            </div>
            {canEdit && (
              <button
                onClick={handleEditClick}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: selectedClub.themeColor,
                  color: C.white,
                  cursor: "pointer",
                  fontFamily: FONT,
                  fontWeight: 700,
                }}
              >
                Edit Club
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "10px 14px",
            }}
          >
            <Icon.Search size={16} style={{ color: C.textDim }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs by name..."
              style={{ ...inputStyle, border: "none", padding: 0, background: "transparent" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {canScrollLeft && (
              <button onClick={() => scrollTabs("left")} style={scrollBtnStyle}>
                <Icon.ChevronLeft size={14} />
              </button>
            )}

            <div
              ref={tabsRef}
              onScroll={handleScroll}
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                flex: 1,
                scrollbarWidth: "none",
                paddingBottom: "4px",
              }}
            >
              {filteredClubs.map((club) => {
                const active = selectedClub.id === club.id;
                return (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClub(club)}
                    style={{
                      whiteSpace: "nowrap",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      border: active ? `2px solid ${club.themeColor}` : `1px solid ${C.border}`,
                      background: active ? `${club.themeColor}14` : C.white,
                      color: active ? club.themeColor : C.textMuted,
                      fontFamily: FONT,
                      fontSize: "13px",
                      fontWeight: active ? 700 : 600,
                      cursor: "pointer",
                    }}
                  >
                    {club.name}
                  </button>
                );
              })}
            </div>

            {canScrollRight && (
              <button onClick={() => scrollTabs("right")} style={scrollBtnStyle}>
                <Icon.ChevronRight size={14} />
              </button>
            )}
          </div>

          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              background: C.white,
            }}
          >
            <div
              style={{
                height: "280px",
                backgroundImage: `url(${selectedClub.bannerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                padding: "22px",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.62), transparent)" }} />
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-end", gap: "14px" }}>
                <img
                  src={selectedClub.logo}
                  alt={selectedClub.name}
                  style={{ width: "78px", height: "78px", borderRadius: "12px", border: `3px solid ${C.white}`, objectFit: "cover" }}
                />
                <div>
                  <h2 style={{ margin: "0 0 4px", color: C.white, fontFamily: FONT, fontSize: "28px", fontWeight: 800 }}>
                    {selectedClub.name}
                  </h2>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", fontSize: "14px", fontFamily: FONT }}>
                    {selectedClub.memberCount} active members
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: "22px", display: "grid", gap: "18px" }}>
              <div>
                <h3 style={{ margin: "0 0 8px", color: C.text, fontFamily: FONT, fontSize: "18px", fontWeight: 800 }}>About</h3>
                <p style={{ margin: 0, color: C.textMuted, fontFamily: FONT, lineHeight: 1.65 }}>{selectedClub.description}</p>
              </div>

              <div>
                <h3 style={{ margin: "0 0 8px", color: C.text, fontFamily: FONT, fontSize: "18px", fontWeight: 800 }}>Mission</h3>
                <p style={{ margin: 0, color: C.textMuted, fontFamily: FONT, lineHeight: 1.65 }}>{selectedClub.mission}</p>
              </div>

              <div>
                <h3 style={{ margin: "0 0 12px", color: C.text, fontFamily: FONT, fontSize: "18px", fontWeight: 800 }}>
                  Leadership Team
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "12px" }}>
                  {selectedClub.leadership.map((member, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: `1px solid ${C.border}`,
                        borderRadius: "12px",
                        background: C.white,
                        padding: "12px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <img src={member.avatar} alt={member.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <p style={{ margin: "0 0 2px", color: selectedClub.themeColor, fontSize: "11px", fontWeight: 700, fontFamily: FONT }}>
                          {member.role}
                        </p>
                        <p style={{ margin: "0 0 2px", color: C.text, fontSize: "13px", fontWeight: 700, fontFamily: FONT }}>{member.name}</p>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "11px", fontFamily: FONT }}>{member.subrole}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ margin: "0 0 12px", color: C.text, fontFamily: FONT, fontSize: "18px", fontWeight: 800 }}>
                  Members / Committee
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
                  {selectedClub.members.map((member, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: `1px solid ${C.border}`,
                        borderRadius: "12px",
                        background: C.white,
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginBottom: "8px",
                          border: `2px solid ${selectedClub.themeColor}22`,
                        }}
                      />
                      <p style={{ margin: "0 0 3px", color: selectedClub.themeColor, fontSize: "11px", fontWeight: 700, fontFamily: FONT }}>
                        {member.role}
                      </p>
                      <h5 style={{ margin: 0, color: C.text, fontSize: "12px", fontFamily: FONT, fontWeight: 700 }}>{member.name}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  width: "100%",
  border: `1px solid ${C.border}`,
  borderRadius: "8px",
  padding: "10px 12px",
  color: C.text,
  background: C.white,
  fontFamily: FONT,
  fontSize: "14px",
  boxSizing: "border-box",
};

const scrollBtnStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  border: `1px solid ${C.border}`,
  background: C.white,
  color: C.textMuted,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
