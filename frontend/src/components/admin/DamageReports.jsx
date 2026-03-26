import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react";
import Sidebar from "../common/Sidebar";
import { FeedbackPanel, FeedbackToast } from "../common/FeedbackUI";
import "./DamageReports.css";

const API_BASE_URL = "http://localhost:3000/api";

const DamageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [selectedReport, setSelectedReport] = useState(null);
  const [approvalData, setApprovalData] = useState({
    actualCost: "",
    penalty: "",
    resolutionNotes: "",
  });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 20000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const response = await axios.get(
        `${API_BASE_URL}/logistics/damage-reports?${params}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setErrorMsg("");
      setReports(response.data.reports);
    } catch (error) {
      console.error("Failed to fetch damage reports:", error);
      setErrorMsg("Unable to load damage reports right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approvalData.actualCost || !approvalData.penalty) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      await axios.patch(
        `${API_BASE_URL}/logistics/damage-reports/${selectedReport.id}/approve`,
        {
          approvedById: userId,
          actualCost: parseFloat(approvalData.actualCost),
          penalty: parseFloat(approvalData.penalty),
          resolutionNotes: approvalData.resolutionNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast("Damage report approved and penalty set.", "success");
      setShowApprovalModal(false);
      setApprovalData({ actualCost: "", penalty: "", resolutionNotes: "" });
      fetchReports();
    } catch (error) {
      console.error("Failed to approve report:", error);
      showToast("Error approving damage report.", "error");
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      await axios.patch(
        `${API_BASE_URL}/logistics/damage-reports/${selectedReport.id}/reject`,
        {
          approvedById: userId,
          resolutionNotes: approvalData.resolutionNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast("Damage report rejected.", "success");
      setShowApprovalModal(false);
      fetchReports();
    } catch (error) {
      console.error("Failed to reject report:", error);
      showToast("Error rejecting damage report.", "error");
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      MINOR: "#10b981",
      MODERATE: "#f59e0b",
      MAJOR: "#ef4444",
      CRITICAL: "#991b1b",
    };
    return colors[severity] || "#6b7280";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-5 md:p-8">
        <div className="damage-reports">
          <FeedbackToast toast={toast} onClose={() => setToast(null)} />

      <div className="reports-header">
        <h2>Damage Reports Management</h2>
        <div className="filter-section">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div style={{ marginBottom: "1rem" }}>
          <FeedbackPanel
            type="error"
            title="Could not load damage reports"
            message={errorMsg}
            actionLabel="Try again"
            onAction={fetchReports}
          />
        </div>
      )}

      {/* Reports List */}
      <motion.div
        className="reports-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <div className="loading-state">Loading damage reports...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <p>No {statusFilter.toLowerCase()} damage reports found</p>
          </div>
        ) : (
          reports.map((report) => (
            <motion.div
              key={report.id}
              className="report-card"
              variants={itemVariants}
              layout
              style={{
                borderLeftColor: getSeverityColor(report.severity),
              }}
            >
              <div className="report-header">
                <div className="report-title">
                  <AlertTriangle
                    size={20}
                    style={{ color: getSeverityColor(report.severity) }}
                  />
                  <div>
                    <h3>{report.title}</h3>
                    <p className="asset-name">{report.asset.name}</p>
                  </div>
                </div>
                <div className="report-badges">
                  <span
                    className={`severity-badge ${report.severity.toLowerCase()}`}
                  >
                    {report.severity}
                  </span>
                  <span
                    className={`status-badge ${report.status.toLowerCase()}`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              <div className="report-details">
                <p className="description">{report.description}</p>

                <div className="details-grid">
                  <div className="detail">
                    <span className="label">Reported by:</span>
                    <span className="value">{report.reporter.name}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Club:</span>
                    <span className="value">{report.club.name}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Damage Type:</span>
                    <span className="value">{report.damageType}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Estimated Cost:</span>
                    <span className="value">
                      <DollarSign size={14} /> ₹
                      {report.estimatedCost?.toFixed(0) || "0"}
                    </span>
                  </div>
                </div>

                {report.images && report.images.length > 0 && (
                  <div className="report-images">
                    <p className="images-label">Evidence Photos:</p>
                    <div className="images-grid">
                      {report.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Damage ${idx + 1}`}
                          className="report-image"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {report.status === "PENDING" && (
                <div className="report-actions">
                  <button
                    className="btn btn-approve"
                    onClick={() => {
                      setSelectedReport(report);
                      setShowApprovalModal(true);
                    }}
                  >
                    <CheckCircle2 size={16} /> Approve & Set Penalty
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => {
                      setSelectedReport(report);
                      setApprovalData({ ...approvalData, resolutionNotes: "" });
                      handleReject();
                    }}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}

              {report.status === "RESOLVED" && (
                <div className="resolved-info">
                  <p>
                    <strong>Approved by:</strong> {report.approvedBy?.name}
                  </p>
                  <p>
                    <strong>Actual Cost:</strong> ₹
                    {report.actualCost?.toFixed(0) || "0"}
                  </p>
                  <p>
                    <strong>Penalty Amount:</strong> ₹
                    {report.penalty?.toFixed(0) || "0"}
                  </p>
                  {report.resolutionNotes && (
                    <p>
                      <strong>Notes:</strong> {report.resolutionNotes}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedReport && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content approval-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3>Approve Damage Report & Set Penalty</h3>

              <div className="form-group">
                <label>Actual Damage Cost (₹):</label>
                <input
                  type="number"
                  value={approvalData.actualCost}
                  onChange={(e) =>
                    setApprovalData({
                      ...approvalData,
                      actualCost: e.target.value,
                    })
                  }
                  placeholder="Enter actual cost"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Penalty Amount (₹):</label>
                <input
                  type="number"
                  value={approvalData.penalty}
                  onChange={(e) =>
                    setApprovalData({
                      ...approvalData,
                      penalty: e.target.value,
                    })
                  }
                  placeholder="Enter penalty amount"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Resolution Notes:</label>
                <textarea
                  value={approvalData.resolutionNotes}
                  onChange={(e) =>
                    setApprovalData({
                      ...approvalData,
                      resolutionNotes: e.target.value,
                    })
                  }
                  placeholder="Enter any additional notes..."
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-cancel"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-confirm" onClick={handleApprove}>
                  Approve Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DamageReports;
