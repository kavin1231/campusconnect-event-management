import { useState, useEffect } from "react";

const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [rejectionInput, setRejectionInput] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async (status) => {
    setLoading(true);
    setFetchError("");
    try {
      const token = localStorage.getItem("token");
      const query = status !== "ALL" ? `?status=${status}` : "";
      const res = await fetch(`/api/event-permissions${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFetchError(data.message || "Failed to load requests.");
        setEvents([]);
      } else {
        setEvents(data.requests);
      }
    } catch {
      setFetchError("Network error. Could not load event permission requests.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(filterStatus);
  }, [filterStatus]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/event-permissions/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: "APPROVED" } : e))
        );
        setSelectedEvent((prev) => (prev?.id === id ? { ...prev, status: "APPROVED" } : prev));
      }
    } catch {
      /* ignore */
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionInput.trim()) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/event-permissions/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason: rejectionInput }),
      });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === id
              ? { ...e, status: "REJECTED", rejectionReason: rejectionInput }
              : e
          )
        );
        setSelectedEvent((prev) =>
          prev?.id === id
            ? { ...prev, status: "REJECTED", rejectionReason: rejectionInput }
            : prev
        );
        setShowRejectInput(false);
        setRejectionInput("");
      }
    } catch {
      /* ignore */
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter((e) =>
    filterStatus === "ALL" ? true : e.status === filterStatus
  );

  const statusLabel = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const statusBadgeClass = (status) => {
    if (status === "PENDING") return "bg-yellow-500/20 text-yellow-400";
    if (status === "APPROVED") return "bg-green-500/20 text-green-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <div className="event-approval bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* HEADER */}
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Event Permission Approvals</h1>
              <p className="text-gray-400 text-sm">Review &amp; approve event permission requests</p>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-2 mt-4">
            {["PENDING", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setSelectedEvent(null);
                  setShowRejectInput(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {statusLabel(status)} ({events.filter((e) => e.status === status).length})
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="px-8 py-8 max-w-7xl mx-auto">
        {fetchError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
            ⚠️ {fetchError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* EVENTS LIST */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-400">Loading requests…</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-400 text-lg">
                  No {statusLabel(filterStatus).toLowerCase()} event requests
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowRejectInput(false);
                      setRejectionInput("");
                    }}
                    className={`p-6 bg-gray-800 border-2 rounded-xl cursor-pointer transition ${
                      selectedEvent?.id === event.id
                        ? "border-purple-500"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{event.title}</h3>
                        <p className="text-gray-400 text-sm">
                          Organised by{" "}
                          <span className="text-white">{event.organizingClub}</span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                          event.status
                        )}`}
                      >
                        {statusLabel(event.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">📍 Venue</p>
                        <p className="text-gray-300">{event.venue}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">📅 Date</p>
                        <p className="text-gray-300">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">👥 Expected</p>
                        <p className="text-gray-300">{event.expectedAttendees} people</p>
                      </div>
                      <div>
                        <p className="text-gray-500">💰 Budget</p>
                        <p className="text-gray-300">₹{event.budget.toLocaleString()}</p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs">
                      Submitted:{" "}
                      {new Date(event.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETAIL PANEL */}
          <div className="lg:col-span-1">
            {selectedEvent ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Request Details</h2>

                <div className="space-y-4 mb-8">
                  <DetailField label="Event Title" value={selectedEvent.title} />
                  <DetailField label="Category" value={selectedEvent.category} />
                  <DetailField
                    label="Organizing Club"
                    value={selectedEvent.organizingClub}
                  />
                  <DetailField label="Contact Email" value={selectedEvent.contactEmail} />

                  <div className="grid grid-cols-2 gap-4">
                    <DetailField
                      label="Date"
                      value={new Date(selectedEvent.eventDate).toLocaleDateString()}
                    />
                    <DetailField label="Venue" value={selectedEvent.venue} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <DetailField
                      label="Attendees"
                      value={selectedEvent.expectedAttendees.toString()}
                    />
                    <DetailField
                      label="Budget"
                      value={`₹${selectedEvent.budget.toLocaleString()}`}
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-2">Description</p>
                    <p className="text-gray-300 text-sm bg-gray-700 p-3 rounded">
                      {selectedEvent.description}
                    </p>
                  </div>

                  {/* RISK ASSESSMENT */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-400 font-semibold mb-2">📋 Risk Assessment</p>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>
                        • Budget:{" "}
                        {selectedEvent.budget > 40000 ? "🟡 High" : "🟢 Moderate"}
                      </li>
                      <li>
                        • Attendance:{" "}
                        {selectedEvent.expectedAttendees > 300 ? "🟡 High" : "🟢 Moderate"}
                      </li>
                      <li>• Feasibility: Plan & execute review required</li>
                    </ul>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                {selectedEvent.status === "PENDING" && (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleApprove(selectedEvent.id)}
                      disabled={actionLoading}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-semibold transition"
                    >
                      ✓ Approve Request
                    </button>

                    {!showRejectInput ? (
                      <button
                        onClick={() => setShowRejectInput(true)}
                        disabled={actionLoading}
                        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg font-semibold transition"
                      >
                        ✗ Reject Request
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-red-500"
                          placeholder="Enter rejection reason…"
                          rows={3}
                          value={rejectionInput}
                          onChange={(e) => setRejectionInput(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(selectedEvent.id)}
                            disabled={actionLoading || !rejectionInput.trim()}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg font-semibold transition text-sm"
                          >
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => {
                              setShowRejectInput(false);
                              setRejectionInput("");
                            }}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedEvent.status === "REJECTED" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm font-medium mb-2">Rejection Reason:</p>
                    <p className="text-red-200 text-sm">
                      {selectedEvent.rejectionReason || "No reason provided"}
                    </p>
                  </div>
                )}

                {selectedEvent.status === "APPROVED" && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm font-medium">
                      ✓ This event permission request has been approved.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-400">Select a request to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

export default EventApproval;

