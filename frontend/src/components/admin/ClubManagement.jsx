import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Trash2, Eye, ChevronDown } from "lucide-react";
import "./ClubManagement.css";

const API_BASE_URL = "http://localhost:3000/api";

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedClub, setExpandedClub] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clubType: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    fetchClubs();
  }, [searchTerm, statusFilter]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const response = await axios.get(
        `${API_BASE_URL}/logistics/clubs?${params}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setClubs(response.data.clubs);
    } catch (error) {
      console.error("Failed to fetch clubs:", error);
      alert("Error fetching clubs");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (clubId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/logistics/clubs/${clubId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      fetchClubs();
      alert("Club status updated successfully");
    } catch (error) {
      console.error("Failed to update club status:", error);
      alert("Error updating club status");
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      try {
        // Note: Delete endpoint not defined in routes, this is a placeholder
        console.log("Delete club:", clubId);
        alert("Club deletion not yet implemented");
      } catch (error) {
        console.error("Failed to delete club:", error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="club-management">
      <div className="club-header">
        <h2>Club Management</h2>
        <button className="add-club-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add New Club
        </button>
      </div>

      {/* Filters */}
      <div className="club-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Clubs List */}
      <motion.div
        className="clubs-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <div className="loading-state">Loading clubs...</div>
        ) : clubs.length === 0 ? (
          <div className="empty-state">
            <p>No clubs found</p>
          </div>
        ) : (
          clubs.map((club) => (
            <motion.div
              key={club.id}
              className="club-card"
              variants={itemVariants}
              layout
            >
              <div className="club-card-header">
                <div className="club-info">
                  {club.logo && (
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="club-logo"
                    />
                  )}
                  <div>
                    <h3>{club.name}</h3>
                    <p className="club-type">{club.clubType}</p>
                  </div>
                </div>
                <div className="club-details">
                  <span className={`status-badge ${club.status.toLowerCase()}`}>
                    {club.status}
                  </span>
                  <button
                    className="expand-btn"
                    onClick={() =>
                      setExpandedClub(expandedClub === club.id ? null : club.id)
                    }
                  >
                    <ChevronDown
                      size={18}
                      style={{
                        transform:
                          expandedClub === club.id
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedClub === club.id && (
                  <motion.div
                    className="club-card-expanded"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="club-description">
                      <p>{club.description || "No description provided"}</p>
                    </div>

                    <div className="club-stats">
                      <div className="stat">
                        <span className="label">President</span>
                        <span className="value">
                          {club.president?.name || "Not assigned"}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="label">Members</span>
                        <span className="value">{club._count.members}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Assets</span>
                        <span className="value">{club._count.assets}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Requests Received</span>
                        <span className="value">
                          {club._count.requestsReceived}
                        </span>
                      </div>
                    </div>

                    <div className="club-actions">
                      <select
                        value={club.status}
                        onChange={(e) =>
                          handleUpdateStatus(club.id, e.target.value)
                        }
                        className="status-select"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                      <button className="action-btn view-btn">
                        <Eye size={16} /> View Details
                      </button>
                      <button className="action-btn edit-btn">
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClub(club.id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default ClubManagement;
