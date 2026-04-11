import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import { C, FONT } from "../constants/colors";
import { Icon } from "../components/common/Icon";
import { Btn } from "../components/common/Primitives";
import { eventRequestAPI } from "../services/api";

const statusColors = {
  PENDING: { bg: "#FFF3E0", border: "#FFB74D", text: "#F57F17" },
  APPROVED: { bg: "#E8F5E9", border: "#81C784", text: "#2E7D32" },
  REJECTED: { bg: "#FFEBEE", border: "#EF5350", text: "#C62828" },
  REVISION_REQUESTED: { bg: "#FCE4EC", border: "#F48FB1", text: "#880E4F" },
};

export default function MyEventRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventRequestAPI.getMyEventRequests();
        
        if (response.success) {
          setRequests(response.data || []);
        } else {
          setError(response.message || "Failed to load requests");
        }
      } catch (err) {
        setError(err.message || "An error occurred while loading requests");
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    return statusColors[status] || { bg: "#F5F5F5", border: "#BDBDBD", text: "#616161" };
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100%", backgroundColor: C.bg }}>
        <Sidebar activePage="my-event-requests" isAdmin={true} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
              <p style={{ fontSize: "16px", color: C.textMuted, fontFamily: FONT }}>Loading event requests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", backgroundColor: C.bg }}>
      <Sidebar activePage="my-event-requests" isAdmin={true} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: "32px", fontWeight: "800", color: C.text, margin: "0 0 8px", fontFamily: FONT }}>
                My Event Requests
              </h1>
              <p style={{ fontSize: "14px", color: C.textMuted, margin: 0, fontFamily: FONT }}>
                View and track your submitted event permission requests
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div style={{ 
                background: "#FFEBEE", 
                border: "1px solid #EF5350", 
                borderRadius: "10px", 
                padding: "16px 20px", 
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{ fontSize: "20px" }}>⚠️</span>
                <span style={{ fontSize: "14px", color: "#C62828", fontFamily: FONT }}>{error}</span>
              </div>
            )}

            {/* Empty State */}
            {requests.length === 0 ? (
              <div style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                padding: "60px 20px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: C.text, marginBottom: "8px", fontFamily: FONT }}>
                  No Event Requests Yet
                </h2>
                <p style={{ fontSize: "14px", color: C.textMuted, marginBottom: "24px", fontFamily: FONT }}>
                  You haven't submitted any event permission requests yet.
                </p>
                <Btn onClick={() => window.location.href = "/create-event"}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    ➕ Submit New Request
                  </span>
                </Btn>
              </div>
            ) : (
              <div>
                {/* Summary Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: C.primary, marginBottom: "4px" }}>
                      {requests.length}
                    </div>
                    <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Total Requests
                    </div>
                  </div>
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#F57F17", marginBottom: "4px" }}>
                      {requests.filter(r => r.status === "PENDING").length}
                    </div>
                    <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Pending Review
                    </div>
                  </div>
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#2E7D32", marginBottom: "4px" }}>
                      {requests.filter(r => r.status === "APPROVED").length}
                    </div>
                    <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Approved
                    </div>
                  </div>
                </div>

                {/* Requests List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {requests.map((request) => {
                    const sc = getStatusColor(request.status);
                    return (
                      <div
                        key={request.id}
                        style={{
                          background: C.white,
                          border: `1px solid ${C.border}`,
                          borderRadius: "12px",
                          padding: "20px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          opacity: selectedRequest?.id === request.id ? 1 : 0.85,
                          maxHeight: selectedRequest?.id === request.id ? "none" : "120px",
                          overflow: "hidden",
                        }}
                        onClick={() =>
                          setSelectedRequest(
                            selectedRequest?.id === request.id ? null : request
                          )
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(5,54,104,.12)";
                          e.currentTarget.style.borderColor = C.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.borderColor = C.border;
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                          <div>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", color: C.text, margin: "0 0 6px", fontFamily: FONT }}>
                              {request.title}
                            </h3>
                            <p style={{ fontSize: "12px", color: C.textMuted, margin: 0, fontFamily: FONT }}>
                              Submitted on {formatDate(request.submittedAt)}
                            </p>
                          </div>
                          <div
                            style={{
                              padding: "6px 14px",
                              borderRadius: "100px",
                              fontSize: "11px",
                              fontWeight: "700",
                              fontFamily: FONT,
                              background: sc.bg,
                              color: sc.text,
                              border: `1px solid ${sc.border}`,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {request.status.replace(/_/g, " ")}
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", fontSize: "12px", color: C.textMuted, fontFamily: FONT }}>
                          <div>
                            <span style={{ fontWeight: "700", color: C.text }}>Event Type:</span> {request.eventType}
                          </div>
                          <div>
                            <span style={{ fontWeight: "700", color: C.text }}>Venue:</span> {request.venue || "N/A"}
                          </div>
                          <div>
                            <span style={{ fontWeight: "700", color: C.text }}>Event Date:</span>{" "}
                            {new Date(request.eventDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {selectedRequest?.id === request.id && (
                          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: `1px solid ${C.border}` }}>
                            <h4 style={{ fontSize: "12px", fontWeight: "700", color: C.primary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: FONT }}>
                              Request Details
                            </h4>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", fontSize: "13px", fontFamily: FONT }}>
                              <div>
                                <span style={{ fontWeight: "700", color: C.text }}>Title:</span>
                                <p style={{ margin: "4px 0 0", color: C.textMuted }}>{request.title}</p>
                              </div>
                              <div>
                                <span style={{ fontWeight: "700", color: C.text }}>Organizing Body:</span>
                                <p style={{ margin: "4px 0 0", color: C.textMuted }}>{request.organizingBody}</p>
                              </div>
                              <div>
                                <span style={{ fontWeight: "700", color: C.text }}>Contact Person:</span>
                                <p style={{ margin: "4px 0 0", color: C.textMuted }}>{request.contactName}</p>
                              </div>
                              <div>
                                <span style={{ fontWeight: "700", color: C.text }}>Contact Phone:</span>
                                <p style={{ margin: "4px 0 0", color: C.textMuted }}>{request.contactPhone}</p>
                              </div>
                              <div>
                                <span style={{ fontWeight: "700", color: C.text }}>Expected Attendance:</span>
                                <p style={{ margin: "4px 0 0", color: C.textMuted }}>{request.expectedAttendance || "N/A"}</p>
                              </div>
                              <div>
                                <span style={{ fontWeight: "700", color: C.text }}>Estimated Budget:</span>
                                <p style={{ margin: "4px 0 0", color: C.textMuted }}>
                                  {request.estimatedBudget ? `LKR ${request.estimatedBudget.toLocaleString()}` : "N/A"}
                                </p>
                              </div>
                              <div style={{ gridColumn: "1 / -1" }}>
                                <span style={{ fontWeight: "700", color: C.text }}>Purpose:</span>
                                <p style={{ margin: "4px 0 0", color: C.textMuted }}>{request.purposeDescription}</p>
                              </div>
                              {request.reviewNotes && (
                                <div style={{ gridColumn: "1 / -1", padding: "12px", background: "#E3F2FD", borderRadius: "8px", borderLeft: `3px solid ${C.primary}` }}>
                                  <span style={{ fontWeight: "700", color: C.primary }}>Review Notes:</span>
                                  <p style={{ margin: "4px 0 0", color: C.text }}>{request.reviewNotes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
