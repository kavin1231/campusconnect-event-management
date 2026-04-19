import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import "./ClubOnboarding.css";

const ClubOnboarding = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubApplications();
  }, []);

  const fetchClubApplications = async () => {
    setLoading(true);
    try {
      // Fetch from backend when available
      // const data = await clubOnboardingAPI.getApplications();
      // For now, use mock data
      const mockApplications = [];
      setApplications(mockApplications);
    } catch (error) {
      console.error("Failed to fetch club applications:", error);
    }
    setLoading(false);
  };

  const handleApprove = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "approved" } : app,
      ),
    );
    setSelectedApp(null);
  };

  const handleReject = (id, reason) => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? { ...app, status: "rejected", rejectionReason: reason }
          : app,
      ),
    );
    setSelectedApp(null);
  };

  const filteredApps = applications.filter(
    (app) => app.status === filterStatus,
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={true} />
      <div className="flex-1">
        <div className="club-onboarding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          {/* HEADER */}
          <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Club Onboarding
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Review & approve club applications
                  </p>
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
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} (
                    {filteredApps.length})
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <div className="px-8 py-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* APPLICATIONS LIST */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {filteredApps.length === 0 ? (
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                      <p className="text-gray-400 text-lg">
                        No {filterStatus} applications
                      </p>
                    </div>
                  ) : (
                    filteredApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={`p-6 bg-gray-800 border-2 rounded-xl cursor-pointer transition ${
                          selectedApp?.id === app.id
                            ? "border-blue-500 bg-gray-750"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {app.clubName}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                              President:{" "}
                              <span className="text-white">
                                {app.president}
                              </span>
                            </p>
                            <p className="text-gray-400 text-sm">
                              Members:{" "}
                              <span className="text-white">{app.members}</span>
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              app.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : app.status === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {app.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="mt-3 text-gray-300 text-sm line-clamp-2">
                          {app.description}
                        </p>

                        <div className="mt-3 flex gap-2">
                          {app.documents.map((doc) => (
                            <span
                              key={doc}
                              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                            >
                              📄 {doc}
                            </span>
                          ))}
                        </div>

                        <p className="mt-3 text-gray-500 text-xs">
                          Submitted: {app.submittedDate}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* DETAIL PANEL */}
              <div className="lg:col-span-1">
                {selectedApp ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 sticky top-24">
                    <h2 className="text-xl font-bold text-white mb-6">
                      Application Details
                    </h2>

                    <div className="space-y-4 mb-8">
                      <DetailRow
                        label="Club Name"
                        value={selectedApp.clubName}
                      />
                      <DetailRow
                        label="President"
                        value={selectedApp.president}
                      />
                      <DetailRow label="Email" value={selectedApp.email} />
                      <DetailRow
                        label="Members"
                        value={selectedApp.members.toString()}
                      />
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-2">
                          Description
                        </p>
                        <p className="text-gray-300 text-sm bg-gray-700 p-3 rounded">
                          {selectedApp.description}
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    {selectedApp.status === "pending" && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleApprove(selectedApp.id)}
                          className="w-full px-4 py-3 bg-emerald-600/95 hover:bg-emerald-600 text-white rounded-xl font-semibold transition shadow-lg shadow-emerald-900/30"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt("Enter rejection reason:");
                            if (reason) handleReject(selectedApp.id, reason);
                          }}
                          className="w-full px-4 py-3 bg-red-600/95 hover:bg-red-600 text-white rounded-xl font-semibold transition shadow-lg shadow-red-900/25"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {selectedApp.status === "rejected" && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm font-medium mb-2">
                          Rejection Reason:
                        </p>
                        <p className="text-red-200 text-sm">
                          {selectedApp.rejectionReason || "No reason provided"}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                    <p className="text-gray-400">
                      Select an application to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

export default ClubOnboarding;
