import React, { useState, useEffect } from "react";
import { sportsAPI } from "../../services/api";
import Sidebar from "../common/Sidebar";
import "./SportsList.css";




const SportsList = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const data = await sportsAPI.getAllSports();
      if (data.success) {
        setSports(data.sports);
      }
    } catch (error) {
      console.error("Failed to fetch sports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sd-layout">
        <Sidebar activePage="sports" />
        <div className="sd-content-wrapper">
          <div className="sports-list-container">
            {/* Hero Section */}
            <header className="sports-hero">
              <div className="hero-content">
                <span className="hero-badge">Student Life</span>
                <p>
                  Explore sports available on campus, connect with coaches, and
                  join vibrant student communities to stay active and engaged.
                </p>
              </div>
            </header>


            {loading ? (
              <div className="sd-loading">
                <div className="sd-spinner" />
                <p>Curating sports profiles...</p>
              </div>
            ) : sports.length === 0 ? (
              <div className="sd-empty">
                <div className="empty-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#94a3b8' }}>
                    sports_handball
                  </span>
                </div>
                <h3>No sports profiles available</h3>
                <p>We're currently updating our sports catalog. Check back soon!</p>
              </div>
            ) : (
              <div className="sports-card-grid">
                {sports.map((sport) => (
                  <div key={sport.id} className="sport-card-student">
                    <div
                      className="sport-image-header"
                      style={{
                        backgroundImage: `url(${sport.imageUrl || "/default-sport.jpg"})`,
                      }}
                    >
                      <div className="sport-overlay">
                        <h3>{sport.name}</h3>
                      </div>
                    </div>
                    <div className="sport-card-body">
                      <p className="sport-description">
                        {sport.description || "No description available for this sport."}
                      </p>
                      
                      <div className="sport-meta">
                        <div className="coach-avatar">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                        <div className="coach-info">
                          <span className="coach-label">Lead Coach</span>
                          <span className="coach-name">{sport.coachName || "TBD"}</span>
                        </div>
                      </div>

                      {sport.whatsappLink && (
                        <a
                          href={sport.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-join-whatsapp"
                        >
                          <span className="material-symbols-outlined whatsapp-icon">group</span>
                          Join WhatsApp Group
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };




export default SportsList;
