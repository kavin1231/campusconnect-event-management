import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { eventRequestAPI } from "../../services/api";

const normalizeStatus = (value) => String(value || "").toUpperCase();
const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
};

const EventApproval = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApprovals();
  }, [filterStatus]);

  const fetchApprovals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventRequestAPI.getAllEventRequests({
        status: filterStatus,
      });
      if (data.success) {
        const normalized = (data.data || []).map((item) => ({
          ...item,
          status: normalizeStatus(item.status),
        }));
        setEventRequests(normalized);
      } else {
        setError(data.message || "Failed to fetch event requests");
      }
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to fetch approvals:", error);
      setError("Error fetching data");
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      const response = await eventRequestAPI.approveEventRequest(id);
      if (response.success) {
        await fetchApprovals();
      } else {
        alert("Error approving: " + response.message);
      }
    } catch (error) {
      console.error("Error approving:", error);
      alert("Error approving");
    }
  };

  const handleReject = async (id, reason) => {
    try {
      const response = await eventRequestAPI.rejectEventRequest(id, reason);
      if (response.success) {
        await fetchApprovals();
        setSelectedItem(null);
      } else {
        alert("Error rejecting: " + response.message);
      }
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("Error rejecting");
    }
  };

  const openDetails = async (item) => {
    setSelectedItem(item);
    try {
      const response = await eventRequestAPI.getEventRequestById(item.id);
      if (response.success && response.data) {
        setSelectedItem({
          ...response.data,
          status: normalizeStatus(response.data.status),
        });
      }
    } catch (error) {
      console.error("Failed to fetch event request details:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={true} />
      <div className="flex-1">
        <div className="event-approval bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          {/* HEADER */}
          <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                  📅
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Approvals</h1>
                  <p className="text-gray-400 text-sm">
                    Review & approve events and event requests
                  </p>
                </div>
              </div>

              {/* FILTER TABS */}
              <div className="flex gap-2">
                {["PENDING", "APPROVED", "REJECTED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterStatus === status
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).toLowerCase()}{" "}
                    (
                    {
                      eventRequests.filter(
                        (item) => normalizeStatus(item.status) === status,
                      ).length
                    }
                    )
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <div className="px-8 py-8 max-w-7xl mx-auto">
            <div className="space-y-4">
              {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-300">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                  <p className="text-gray-400 text-lg">
                    Loading event requests...
                  </p>
                </div>
              ) : eventRequests.length === 0 ? (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                  <p className="text-gray-400 text-lg">
                    No {filterStatus.toLowerCase()} event requests
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventRequests.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openDetails(item)}
                      className="p-4 bg-gray-800 border-2 border-gray-700 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-gray-750 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Submitted by{" "}
                            <span className="text-white">
                              {item.submitter?.name || "Unknown"}
                            </span>
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium">
                          {item.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                        <div>
                          <p className="text-gray-500">🎯 Purpose</p>
                          <p className="text-gray-300">
                            {item.purposeTag || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">💰 Budget</p>
                          <p className="text-gray-300">
                            {item.estimatedBudget
                              ? `₹${item.estimatedBudget.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-400 text-xs">
                        📅 {formatDate(item.eventDate)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DETAIL MODAL */}
          {selectedItem && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedItem.title}
                  </h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Submitted By
                    </p>
                    <p className="text-white font-medium">
                      {selectedItem.submitter?.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {selectedItem.submitter?.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        Event Type
                      </p>
                      <p className="text-white">
                        {selectedItem.eventType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        Purpose
                      </p>
                      <p className="text-white">
                        {selectedItem.purposeTag || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        Event Date
                      </p>
                      <p className="text-white">
                        {formatDate(selectedItem.eventDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        Budget
                      </p>
                      <p className="text-white">
                        {selectedItem.estimatedBudget
                          ? `₹${selectedItem.estimatedBudget.toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        Venue
                      </p>
                      <p className="text-white">
                        {selectedItem.venue || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        Organizer
                      </p>
                      <p className="text-white">
                        {selectedItem.organizingBody || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Event Description
                    </p>
                    <p className="text-white text-sm leading-relaxed">
                      {selectedItem.purposeDescription ||
                        "No description provided."}
                    </p>
                  </div>

                  {selectedItem.reviewNotes && (
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        Review Notes
                      </p>
                      <p className="text-white text-sm leading-relaxed">
                        {selectedItem.reviewNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS IN MODAL */}
                {normalizeStatus(selectedItem.status) === "PENDING" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleApprove(selectedItem.id)}
                      className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason) {
                          handleReject(selectedItem.id, reason);
                          setSelectedItem(null);
                        }
                      }}
                      className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}

                {normalizeStatus(selectedItem.status) === "APPROVED" && (
                  <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-center">
                    <p className="text-emerald-300 font-semibold">
                      ✅ Already Approved
                    </p>
                  </div>
                )}

                {normalizeStatus(selectedItem.status) === "REJECTED" && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
                    <p className="text-red-300 font-semibold">
                      ❌ Already Rejected
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventApproval;
