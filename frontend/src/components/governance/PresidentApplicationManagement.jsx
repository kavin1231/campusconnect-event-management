import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { governanceAPI } from "../../services/api";
import "./PresidentApplicationManagement.css";

export default function PresidentApplicationManagement() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const u = JSON.parse(userStr);
      if (u.role !== "SYSTEM_ADMIN" && u.role !== "EVENT_ORGANIZER") {
        navigate("/");
        return;
      }
      setUser(u);
      fetchApplications();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch president applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await governanceAPI.getPresidentApplications();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setMessage("Failed to fetch applications");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleApprove = async (appId) => {
    if (!window.confirm("Are you sure you want to approve this application?")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await governanceAPI.approvePresidentApplication(appId);
      if (response.success) {
        setMessage(
          "✅ Application approved! President account created and notification sent.",
        );
        setMessageType("success");
        fetchApplications();
        setSelectedApp(null);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to approve application:", error);
      setMessage("Failed to approve application");
      setMessageType("error");
    }
    setActionLoading(false);
  };

  const handleRejectSubmit = async (appId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      const response = await governanceAPI.rejectPresidentApplication(
        appId,
        rejectReason,
      );
      if (response.success) {
        setMessage("❌ Application rejected and notification sent.");
        setMessageType("success");
        fetchApplications();
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedApp(null);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to reject application:", error);
      setMessage("Failed to reject application");
      setMessageType("error");
    }
    setActionLoading(false);
  };

  const filteredApplications = applications.filter(
    (app) => app.status === filterStatus,
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      case "PENDING":
        return "pending";
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

  if (!user) {
    return <div className="pam-loading">Loading...</div>;
  }

  return (
    <div className="pam-container">
      <Sidebar isAdmin={true} />
      <div className="pam-content">
        <div className="pam-header">
          <h1>👑 President Application Management</h1>
          <p className="pam-subtitle">
            Review and manage student president applications
          </p>
        </div>

        {message && (
          <div className={`pam-message pam-message-${messageType}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="pam-loading-state">
            <div className="pam-spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : (
          <div className="pam-content-wrapper">
            {/* Left Panel - Application List */}
            <div className="pam-list-panel">
              <div className="pam-filters">
                <button
                  className={`pam-filter-btn ${filterStatus === "PENDING" ? "active" : ""}`}
                  onClick={() => setFilterStatus("PENDING")}
                >
                  ⏳ Pending (
                  {applications.filter((a) => a.status === "PENDING").length})
                </button>
                <button
                  className={`pam-filter-btn ${filterStatus === "APPROVED" ? "active" : ""}`}
                  onClick={() => setFilterStatus("APPROVED")}
                >
                  ✅ Approved (
                  {applications.filter((a) => a.status === "APPROVED").length})
                </button>
                <button
                  className={`pam-filter-btn ${filterStatus === "REJECTED" ? "active" : ""}`}
                  onClick={() => setFilterStatus("REJECTED")}
                >
                  ❌ Rejected (
                  {applications.filter((a) => a.status === "REJECTED").length})
                </button>
              </div>

              <div className="pam-list">
                {filteredApplications.length === 0 ? (
                  <div className="pam-empty-state">
                    <p>📭 No {filterStatus.toLowerCase()} applications</p>
                  </div>
                ) : (
                  filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className={`pam-app-card ${selectedApp?.id === app.id ? "selected" : ""}`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <div className="pam-app-card-header">
                        <h4>{app.presidentName || app.student.name}</h4>
                        <span
                          className={`pam-status-badge pam-status-${getStatusColor(app.status)}`}
                        >
                          {getStatusIcon(app.status)} {app.status}
                        </span>
                      </div>
                      <p className="pam-club-name">
                        🏛️{" "}
                        {app.clubOrFacultyType === "CLUB" ? "Club" : "Faculty"}:{" "}
                        {app.clubOrFacultyName}
                      </p>
                      <p className="pam-student-info">
                        By: {app.student.name} ({app.student.studentId})
                      </p>
                      <p className="pam-applied-date">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel - Application Details */}
            <div className="pam-detail-panel">
              {selectedApp ? (
                <>
                  <div className="pam-detail-header">
                    <div>
                      <h2>{selectedApp.presidentName}</h2>
                      <p className="pam-detail-subtitle">
                        {selectedApp.clubOrFacultyType === "CLUB"
                          ? "Club"
                          : "Faculty"}{" "}
                        President Position
                      </p>
                    </div>
                    <span
                      className={`pam-detail-status pam-status-${getStatusColor(selectedApp.status)}`}
                    >
                      {getStatusIcon(selectedApp.status)} {selectedApp.status}
                    </span>
                  </div>

                  <div className="pam-detail-section">
                    <h3>👤 Personal Information</h3>
                    <div className="pam-detail-grid">
                      <div className="pam-detail-item">
                        <label>Student Name</label>
                        <p>{selectedApp.student.name}</p>
                      </div>
                      <div className="pam-detail-item">
                        <label>Student ID</label>
                        <p>{selectedApp.student.studentId}</p>
                      </div>
                      <div className="pam-detail-item">
                        <label>Candidate ID</label>
                        <p>{selectedApp.candidateId}</p>
                      </div>
                      <div className="pam-detail-item">
                        <label>Email</label>
                        <p>{selectedApp.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pam-detail-section">
                    <h3>🏛️ Position Details</h3>
                    <div className="pam-detail-grid">
                      <div className="pam-detail-item">
                        <label>Position Type</label>
                        <p>
                          {selectedApp.clubOrFacultyType === "CLUB"
                            ? "🎭 Club President"
                            : "🏛️ Faculty President"}
                        </p>
                      </div>
                      <div className="pam-detail-item">
                        <label>Club/Faculty Name</label>
                        <p>{selectedApp.clubOrFacultyName}</p>
                      </div>
                      <div className="pam-detail-item pam-full-width">
                        <label>Current Qualification</label>
                        <p>{selectedApp.currentQualification}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pam-detail-section pam-timeline">
                    <h3>📅 Timeline</h3>
                    <div className="pam-timeline-item">
                      <span className="pam-timeline-date">Applied:</span>
                      <span className="pam-timeline-value">
                        {new Date(selectedApp.appliedAt).toLocaleString()}
                      </span>
                    </div>
                    {selectedApp.approvedRejectAt && (
                      <div className="pam-timeline-item">
                        <span className="pam-timeline-date">Reviewed:</span>
                        <span className="pam-timeline-value">
                          {new Date(
                            selectedApp.approvedRejectAt,
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedApp.status === "APPROVED" && (
                    <div className="pam-detail-section pam-approved-info">
                      <h3>✅ Approval Information</h3>
                      <div className="pam-info-box pam-box-success">
                        <p>
                          <strong>Approved by:</strong>{" "}
                          {selectedApp.approvedBy?.name || "System Admin"}
                        </p>
                        <p>
                          <strong>President Account Created:</strong>{" "}
                          {selectedApp.email}
                        </p>
                        <p className="pam-alert-text">
                          ✓ Notification with auto-generated password has been
                          sent to the student.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === "REJECTED" && (
                    <div className="pam-detail-section pam-rejected-info">
                      <h3>❌ Rejection Information</h3>
                      <div className="pam-info-box pam-box-error">
                        <p>
                          <strong>Rejected by:</strong>{" "}
                          {selectedApp.approvedBy?.name || "System Admin"}
                        </p>
                        {selectedApp.rejectionReason && (
                          <p>
                            <strong>Reason:</strong>{" "}
                            {selectedApp.rejectionReason}
                          </p>
                        )}
                        <p className="pam-alert-text">
                          ✓ Notification with rejection reason has been sent to
                          the student.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === "PENDING" && (
                    <div className="pam-action-buttons">
                      <button
                        className="pam-btn-approve"
                        onClick={() => handleApprove(selectedApp.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading
                          ? "Processing..."
                          : "✅ Approve Application"}
                      </button>
                      <button
                        className="pam-btn-reject"
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                      >
                        ❌ Reject Application
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="pam-empty-detail">
                  <div className="pam-empty-icon">👈</div>
                  <p>Select an application to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedApp && (
          <div className="pam-modal-overlay">
            <div className="pam-modal">
              <div className="pam-modal-header">
                <h2>❌ Reject Application</h2>
              </div>
              <div className="pam-modal-body">
                <p className="pam-modal-text">
                  You are about to reject{" "}
                  <strong>{selectedApp.presidentName}</strong>'s application for{" "}
                  <strong>
                    {selectedApp.clubOrFacultyType === "CLUB"
                      ? "Club"
                      : "Faculty"}
                  </strong>{" "}
                  president at <strong>{selectedApp.clubOrFacultyName}</strong>.
                </p>

                <div className="pam-form-group">
                  <label htmlFor="rejectReason">
                    Rejection Reason (Required) *
                  </label>
                  <textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide a clear reason for the rejection..."
                    rows="5"
                  />
                  <small>This reason will be shared with the student</small>
                </div>
              </div>
              <div className="pam-modal-actions">
                <button
                  className="pam-btn-cancel"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  className="pam-btn-confirm-reject"
                  onClick={() => handleRejectSubmit(selectedApp.id)}
                  disabled={!rejectReason.trim() || actionLoading}
                >
                  {actionLoading ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
