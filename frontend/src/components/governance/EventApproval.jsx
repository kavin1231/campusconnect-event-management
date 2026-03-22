import { useState } from "react";

const EventApproval = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Annual Fest 2024",
      club: "Arts Club",
      date: "2024-04-15",
      venue: "Main Auditorium",
      expectedAttendees: 500,
      budget: 50000,
      description: "Annual cultural festival",
      status: "pending",
      submittedDate: "2024-03-20",
    },
    {
      id: 2,
      title: "Hackathon 2024",
      club: "Tech Club",
      date: "2024-04-22",
      venue: "Tech Lab",
      expectedAttendees: 200,
      budget: 30000,
      description: "24-hour coding competition",
      status: "pending",
      submittedDate: "2024-03-19",
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");

  const handleApprove = (id) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "approved" } : event
      )
    );
    setSelectedEvent(null);
  };

  const handleReject = (id, reason) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "rejected", rejectionReason: reason } : event
      )
    );
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter((event) => event.status === filterStatus);

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
              <h1 className="text-2xl font-bold text-white">Event Approvals</h1>
              <p className="text-gray-400 text-sm">Review & approve event submissions</p>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-2 mt-4">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({filteredEvents.length})
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* EVENTS LIST */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                  <p className="text-gray-400 text-lg">No {filterStatus} events</p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`p-6 bg-gray-800 border-2 rounded-xl cursor-pointer transition ${
                      selectedEvent?.id === event.id
                        ? "border-purple-500 bg-gray-750"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{event.title}</h3>
                        <p className="text-gray-400 text-sm">
                          Organized by <span className="text-white">{event.club}</span>
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium">
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">📍 Venue</p>
                        <p className="text-gray-300">{event.venue}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">📅 Date</p>
                        <p className="text-gray-300">{event.date}</p>
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
                      Submitted: {event.submittedDate}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DETAIL PANEL */}
          <div className="lg:col-span-1">
            {selectedEvent ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Event Details</h2>

                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Event Title</p>
                    <p className="text-white font-medium">{selectedEvent.title}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Organizing Club</p>
                    <p className="text-white font-medium">{selectedEvent.club}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Date</p>
                      <p className="text-white">{selectedEvent.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Venue</p>
                      <p className="text-white">{selectedEvent.venue}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Expected Attendees</p>
                      <p className="text-white">{selectedEvent.expectedAttendees}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Budget</p>
                      <p className="text-white">₹{selectedEvent.budget.toLocaleString()}</p>
                    </div>
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
                      <li>• Budget: {selectedEvent.budget > 40000 ? "🟡 High" : "🟢 Moderate"}</li>
                      <li>• Attendance: {selectedEvent.expectedAttendees > 300 ? "🟡 High" : "🟢 Moderate"}</li>
                      <li>• Duration: Plan & execute feasibility verified</li>
                    </ul>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                {selectedEvent.status === "pending" && (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleApprove(selectedEvent.id)}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                    >
                      ✓ Approve Event
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason) handleReject(selectedEvent.id, reason);
                      }}
                      className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                    >
                      ✗ Reject Event
                    </button>
                  </div>
                )}

                {selectedEvent.status === "rejected" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm font-medium mb-2">Rejection Reason:</p>
                    <p className="text-red-200 text-sm">
                      {selectedEvent.rejectionReason || "No reason provided"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-400">Select an event to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventApproval;
