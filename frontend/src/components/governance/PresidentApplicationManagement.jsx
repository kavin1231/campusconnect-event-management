import React, { useState, useEffect } from "react";
import { governanceAPI } from "../../services/api";
import "./PresidentApplicationManagement.css";

export default function PresidentApplicationManagement() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [user] = useState({
    id: "1",
    name: "Admin User",
    role: "ADMIN",
  });

  // Fetch president applications
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await governanceAPI.getPresidentApplications();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
    setLoading(false);
  };

  const handleApprove = async (appId) => {
    try {
      const response = await governanceAPI.approvePresidentApplication(appId);
      if (response.success) {
        // Refresh applications
        fetchApplications();
        setSelectedApp(null);
        alert("✅ Application approved! President account created.");
      }
    } catch (error) {
      console.error("Failed to approve application:", error);
      alert("Failed to approve application");
    }
  };

  const handleRejectSubmit = async (appId) => {
    try {
      const response = await governanceAPI.rejectPresidentApplication(appId);
      if (response.success) {
        fetchApplications();
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedApp(null);
        alert("❌ Application rejected.");
      }
    } catch (error) {
      console.error("Failed to reject application:", error);
      alert("Failed to reject application");
    }
  };

  const filteredApplications = applications.filter(
    (app) => app.status === filterStatus,
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-rejected";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "APPROVED":
        return "✅";
      case "REJECTED":
        return "❌";
      default:
        return "";
    }
  };

  return (
    <div className="pres-app-container">
      <h1 className="pres-app-title">👑 President Application Management</h1>

      <div className="pres-app-content">
        {/* Left Panel - Application List */}
        <div className="pres-app-list-panel">
          <div className="pres-app-filters">
            <button
              className={`pres-filter-btn ${filterStatus === "PENDING" ? "active" : ""}`}
              onClick={() => setFilterStatus("PENDING")}
            >
              ⏳ Pending (
              {applications.filter((a) => a.status === "PENDING").length})
            </button>
            <button
              className={`pres-filter-btn ${filterStatus === "APPROVED" ? "active" : ""}`}
              onClick={() => setFilterStatus("APPROVED")}
            >
              ✅ Approved (
              {applications.filter((a) => a.status === "APPROVED").length})
            </button>
            <button
              className={`pres-filter-btn ${filterStatus === "REJECTED" ? "active" : ""}`}
              onClick={() => setFilterStatus("REJECTED")}
            >
              ❌ Rejected (
              {applications.filter((a) => a.status === "REJECTED").length})
            </button>
          </div>

          <div className="pres-app-list">
            {filteredApplications.length === 0 ? (
              <div className="pres-empty-state">
                <p>No {filterStatus.toLowerCase()} applications</p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className={`pres-app-card ${selectedApp?.id === app.id ? "selected" : ""}`}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="pres-app-card-header">
                    <h4>{app.student.name}</h4>
                    <span
                      className={`pres-status-badge ${getStatusColor(app.status)}`}
                    >
                      {getStatusIcon(app.status)} {app.status}
                    </span>
                  </div>
                  <p className="pres-club-name">{app.clubName}</p>
                  <p className="pres-applied-date">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Application Details */}
        <div className="pres-app-detail-panel">
          {selectedApp ? (
            <>
              <div className="pres-detail-header">
                <h2>{selectedApp.student.name}</h2>
                <span
                  className={`pres-detail-status ${getStatusColor(selectedApp.status)}`}
                >
                  {getStatusIcon(selectedApp.status)} {selectedApp.status}
                </span>
              </div>

              <div className="pres-detail-section">
                <h3>📋 Application Details</h3>
                <div className="pres-detail-grid">
                  <div className="pres-detail-item">
                    <label>Club Name</label>
                    <p>{selectedApp.clubName}</p>
                  </div>
                  <div className="pres-detail-item">
                    <label>Email</label>
                    <p>{selectedApp.email}</p>
                  </div>
                  <div className="pres-detail-item">
                    <label>Year of Study</label>
                    <p>{selectedApp.yearOfStudy}</p>
                  </div>
                  <div className="pres-detail-item">
                    <label>GPA</label>
                    <p>{selectedApp.gpa}</p>
                  </div>
                  <div className="pres-detail-item">
                    <label>Club Members</label>
                    <p>{selectedApp.numMembers} members</p>
                  </div>
                  <div className="pres-detail-item">
                    <label>Applied</label>
                    <p>{new Date(selectedApp.appliedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="pres-detail-section">
                <h3>🎯 Experience & Background</h3>
                <p className="pres-experience-text">{selectedApp.experience}</p>
              </div>

              {selectedApp.status === "APPROVED" && (
                <div className="pres-detail-section pres-approved-info">
                  <h3>✅ Approval Info</h3>
                  <p>
                    <strong>Approved by:</strong> {selectedApp.approvedBy?.name}
                  </p>
                  <p>
                    <strong>Approved at:</strong>{" "}
                    {new Date(selectedApp.approvedAt).toLocaleString()}
                  </p>
                  <div className="pres-alert-box pres-success">
                    <strong>Account Created</strong> - Temporary credentials
                    sent to {selectedApp.email}
                  </div>
                </div>
              )}

              {selectedApp.status === "REJECTED" && (
                <div className="pres-detail-section pres-rejected-info">
                  <h3>❌ Rejection Details</h3>
                  <p>
                    <strong>Rejected by:</strong> {selectedApp.approvedBy?.name}
                  </p>
                  <p>
                    <strong>Rejected at:</strong>{" "}
                    {new Date(selectedApp.approvedAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Reason:</strong> {selectedApp.rejectionReason}
                  </p>
                </div>
              )}

              {selectedApp.status === "PENDING" && (
                <div className="pres-action-buttons">
                  <button
                    className="pres-btn-approve"
                    onClick={() => handleApprove(selectedApp.id)}
                  >
                    ✅ Approve Application
                  </button>
                  <button
                    className="pres-btn-reject"
                    onClick={() => setShowRejectModal(true)}
                  >
                    ❌ Reject Application
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="pres-empty-detail">
              <p>👈 Select an application to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="pres-modal-overlay">
          <div className="pres-modal">
            <h2>Reject Application</h2>
            <p>
              Are you sure you want to reject {selectedApp.student.name}'s
              application for {selectedApp.clubName}?
            </p>

            <div className="pres-form-group">
              <label>Rejection Reason (required)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this application is being rejected..."
                rows="4"
              />
            </div>

            <div className="pres-modal-actions">
              <button
                className="pres-btn-cancel"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="pres-btn-confirm-reject"
                onClick={() => handleRejectSubmit(selectedApp.id)}
                disabled={!rejectReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
