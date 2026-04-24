import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";
import { AnimatePresence, motion } from "framer-motion";

const LogisticsDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    checkedOut: 0,
    pendingRequests: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState("overview");

  // Get user role from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [assetsData, requestsData] = await Promise.all([
        logisticsAPI.listAssets(),
        logisticsAPI.listRequests(),
      ]);

      if (assetsData.success && requestsData.success) {
        const assets = assetsData.assets || [];
        const requests = requestsData.requests || [];

        setStats({
          totalAssets: assets.length,
          availableAssets: assets.filter((a) => a.available > 0).length,
          checkedOut: requests.filter((r) => r.status === "checked_out").length,
          pendingRequests: requests.filter((r) => r.status === "pending")
            .length,
          overdue: requests.filter((r) => r.status === "overdue").length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch logistics stats:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={true} />
      <div className="flex-1">
        <div className="logistics-dashboard bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          {/* HEADER */}
          <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-2xl">
                  📦
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Logistics Hub
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Inter-Club Resource Exchange & Management
                  </p>
                </div>
              </div>

              {/* TAB NAVIGATION */}
              <div className="flex gap-2 border-b border-gray-700 mt-6">
                {[
                  "overview",
                  "assets",
                  "requests",
                  "checkout",
                  "analytics",
                ].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setTabs(tab)}
                    className={`px-6 py-3 font-semibold transition-all ${
                      tabs === tab
                        ? "text-indigo-400 border-b-2 border-indigo-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <div className="px-8 py-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={tabs}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {tabs === "overview" && <OverviewTab stats={stats} />}
                {tabs === "assets" && <AssetsTab />}
                {tabs === "requests" && <RequestsTab />}
                {tabs === "checkout" && <CheckoutTab />}
                {tabs === "analytics" && <AnalyticsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ stats }) => {
  const statCards = [
    {
      label: "Total Assets",
      value: stats.totalAssets,
      icon: "📦",
      color: "indigo",
    },
    {
      label: "Available",
      value: stats.availableAssets,
      icon: "✓",
      color: "green",
    },
    {
      label: "Checked Out",
      value: stats.checkedOut,
      icon: "🔄",
      color: "blue",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests,
      icon: "⏳",
      color: "yellow",
    },
    {
      label: "Overdue Returns",
      value: stats.overdue,
      icon: "⚠️",
      color: "red",
    },
  ];

  return (
    <div className="space-y-8">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.24, ease: "easeOut" }}
            whileHover={{ y: -3 }}
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <p className="text-gray-400 text-sm font-medium mb-2">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MOST REQUESTED ASSETS */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            🔥 Most Requested Assets
          </h2>
          <div className="space-y-3">
            {[
              { asset: "Projectors", count: 12, icon: "🎬" },
              { asset: "Speakers/Sound System", count: 10, icon: "🔊" },
              { asset: "Cameras", count: 8, icon: "📷" },
              { asset: "Banners", count: 7, icon: "🚩" },
              { asset: "Chairs & Tables", count: 6, icon: "🪑" },
            ].map((item) => (
              <div
                key={item.asset}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-medium">{item.asset}</span>
                </div>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full font-medium">
                  {item.count} requests
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            📋 Recent Transactions
          </h2>
          <div className="space-y-3">
            {[
              {
                action: "Approved",
                asset: "Projector - Sony",
                club: "Arts Club",
                time: "2 hours ago",
                color: "green",
              },
              {
                action: "Requested",
                asset: "Speaker System",
                club: "Music Club",
                time: "4 hours ago",
                color: "yellow",
              },
              {
                action: "Returned",
                asset: "Banners (10)",
                club: "Design Club",
                time: "1 day ago",
                color: "blue",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{item.asset}</p>
                  <p className="text-gray-400 text-sm">{item.club}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium mb-1 block ${
                      item.color === "green"
                        ? "bg-green-500/20 text-green-400"
                        : item.color === "yellow"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {item.action}
                  </span>
                  <p className="text-gray-400 text-xs">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AssetsTab = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await logisticsAPI.listAssets();
      if (data.success && data.assets) {
        setAssets(data.assets);
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      setFeedback({ type: "error", text: "Failed to load assets" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleEditClick = (asset) => {
    setEditingId(asset.id);
    setEditForm({
      name: asset.name || "",
      description: asset.description || "",
      quantity: asset.quantity || 0,
      status: asset.status || "AVAILABLE",
    });
  };

  const handleEditSave = async () => {
    try {
      const result = await logisticsAPI.updateAsset(editingId, editForm);
      if (!result.success) {
        throw new Error(result.message || "Failed to update asset");
      }
      setFeedback({ type: "success", text: "Asset updated successfully" });
      setEditingId(null);
      await fetchAssets();
    } catch (error) {
      console.error("Update asset failed:", error);
      setFeedback({
        type: "error",
        text: error.message || "Failed to update asset",
      });
    }
  };

  const handleDelete = async (assetId) => {
    try {
      const result = await logisticsAPI.deleteAsset(assetId);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete asset");
      }
      setFeedback({ type: "success", text: "Asset deleted successfully" });
      setDeleteConfirmId(null);
      await fetchAssets();
    } catch (error) {
      console.error("Delete asset failed:", error);
      setFeedback({
        type: "error",
        text: error.message || "Failed to delete asset",
      });
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
              : "border-red-500/40 bg-red-500/15 text-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {loading ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400">Loading assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400">No assets found</p>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-900/95 border-b border-gray-700 backdrop-blur">
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Asset Name
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-4 text-center text-gray-400 font-semibold">
                    Available
                  </th>
                  <th className="px-6 py-4 text-center text-gray-400 font-semibold">
                    Condition
                  </th>
                  <th className="px-6 py-4 text-center text-gray-400 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-gray-700 hover:bg-indigo-500/10 transition"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {asset.name || "Unnamed"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {asset.category || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-medium">
                        {asset.availableQty || asset.available || 0}/
                        {asset.quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full font-medium capitalize border ${
                          String(asset.condition || "").toLowerCase() ===
                          "excellent"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : String(asset.condition || "").toLowerCase() ===
                                "good"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {asset.condition || "unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          className="px-3 py-1.5 text-sm bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg transition"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleEditClick(asset)}
                        >
                          ✏️ Edit
                        </motion.button>
                        <motion.button
                          className="px-3 py-1.5 text-sm bg-red-600/90 hover:bg-red-600 text-white rounded-lg transition"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setDeleteConfirmId(asset.id)}
                        >
                          🗑️ Delete
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setEditingId(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4">Edit Asset</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option>AVAILABLE</option>
                  <option>UNAVAILABLE</option>
                  <option>MAINTENANCE</option>
                  <option>DAMAGED</option>
                  <option>ARCHIVED</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Total Quantity
                </label>
                <input
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <motion.button
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                whileTap={{ scale: 0.97 }}
                onClick={() => setEditingId(null)}
              >
                Cancel
              </motion.button>
              <motion.button
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                whileTap={{ scale: 0.97 }}
                onClick={handleEditSave}
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setDeleteConfirmId(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-red-400 mb-4">
              Delete Asset?
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this asset? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <motion.button
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                whileTap={{ scale: 0.97 }}
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </motion.button>
              <motion.button
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                whileTap={{ scale: 0.97 }}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const RequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await logisticsAPI.listRequests();
      if (data.success && data.requests) {
        setRequests(data.requests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setFeedback({
        type: "error",
        text: "Failed to load requests. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const result = await logisticsAPI.approveRequest(requestId);
      if (!result.success) {
        throw new Error(result.message || "Failed to approve request");
      }
      setFeedback({ type: "success", text: "Request approved successfully." });
      await fetchRequests();
    } catch (error) {
      console.error("Approve request failed:", error);
      setFeedback({
        type: "error",
        text: error.message || "Failed to approve request.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    const reason =
      window.prompt("Enter rejection reason (optional):", "") || "";

    try {
      setActionLoadingId(requestId);
      const result = await logisticsAPI.rejectRequest(requestId, reason);
      if (!result.success) {
        throw new Error(result.message || "Failed to reject request");
      }
      setFeedback({ type: "success", text: "Request rejected successfully." });
      await fetchRequests();
    } catch (error) {
      console.error("Reject request failed:", error);
      setFeedback({
        type: "error",
        text: error.message || "Failed to reject request.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      {feedback && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
              : "border-red-500/40 bg-red-500/15 text-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}
      {loading ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400">No requests found</p>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full min-w-[760px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-900/95 border-b border-gray-700 backdrop-blur">
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Needed Date
                  </th>
                  <th className="px-6 py-4 text-center text-gray-400 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-gray-700 hover:bg-indigo-500/10 transition"
                  >
                    <td className="px-6 py-4 text-gray-300">
                      {req.asset || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold uppercase border ${
                          req.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            : req.status === "approved" ||
                                req.status === "checked_out"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                        }`}
                      >
                        {req.status
                          ? req.status.replace(/_/g, " ").toUpperCase()
                          : "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {req.neededDate || req.startDate || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {req.status === "pending" ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            className="px-3 py-1.5 text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg transition"
                            onClick={() => handleApprove(req.id)}
                            disabled={actionLoadingId === req.id}
                            whileTap={{ scale: 0.97 }}
                          >
                            {actionLoadingId === req.id
                              ? "Approving..."
                              : "Approve"}
                          </motion.button>
                          <motion.button
                            className="px-3 py-1.5 text-xs font-semibold bg-red-600/90 hover:bg-red-600 text-white rounded-lg transition"
                            onClick={() => handleReject(req.id)}
                            disabled={actionLoadingId === req.id}
                            whileTap={{ scale: 0.97 }}
                          >
                            {actionLoadingId === req.id
                              ? "Working..."
                              : "Reject"}
                          </motion.button>
                        </div>
                      ) : (
                        <motion.button
                          className="px-3 py-1.5 text-xs font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg transition"
                          whileTap={{ scale: 0.97 }}
                        >
                          View
                        </motion.button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutTab = () => {
  const [checkouts, setCheckouts] = useState([
    {
      id: 1,
      asset: "Projector (Sony Bravia)",
      club: "Photography Club",
      startDate: "2026-03-20",
      endDate: "2026-03-25",
      status: "checked_out",
      checkedOutDate: "2026-03-20",
      dueDate: "2026-03-25",
    },
    {
      id: 2,
      asset: "Speaker System (JBL)",
      club: "Music Society",
      startDate: "2026-03-18",
      endDate: "2026-03-26",
      status: "checked_out",
      checkedOutDate: "2026-03-18",
      dueDate: "2026-03-26",
    },
    {
      id: 3,
      asset: "Canon EOS 5D Camera",
      club: "Film Club",
      startDate: "2026-03-15",
      endDate: "2026-03-23",
      status: "overdue",
      checkedOutDate: "2026-03-15",
      dueDate: "2026-03-23",
    },
    {
      id: 4,
      asset: "Tripod Stand & Mount",
      club: "Events Club",
      startDate: "2026-03-22",
      endDate: "2026-03-28",
      status: "checked_out",
      checkedOutDate: "2026-03-22",
      dueDate: "2026-03-28",
    },
    {
      id: 5,
      asset: "DJ Console & Mixer",
      club: "Entertainment Society",
      startDate: "2026-03-19",
      endDate: "2026-03-24",
      status: "overdue",
      checkedOutDate: "2026-03-19",
      dueDate: "2026-03-24",
    },
    {
      id: 6,
      asset: "Lighting Setup (LED)",
      club: "Drama Club",
      startDate: "2026-03-21",
      endDate: "2026-03-27",
      status: "checked_out",
      checkedOutDate: "2026-03-21",
      dueDate: "2026-03-27",
    },
  ]);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleReturn = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      // Simulate API call
      setTimeout(() => {
        setCheckouts(checkouts.filter((c) => c.id !== requestId));
        setFeedback({
          type: "success",
          text: "Asset marked as returned successfully!",
        });
        setActionLoadingId(null);
        setTimeout(() => setFeedback(null), 3000);
      }, 800);
    } catch (error) {
      console.error("Return asset failed:", error);
      setFeedback({
        type: "error",
        text: error.message || "Failed to return asset.",
      });
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      {feedback && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
              : "border-red-500/40 bg-red-500/15 text-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}
      {checkouts.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400">No items currently checked out</p>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full min-w-[760px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-900/95 border-b border-gray-700 backdrop-blur">
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Checked By
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Checked Out
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-gray-400 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {checkouts.map((item) => {
                  const isOverdue = item.status === "overdue";
                  const statusClass = isOverdue
                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30";
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-700 hover:bg-indigo-500/10 transition"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {item.asset || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.club || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.checkedOutDate || item.startDate || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.dueDate || item.endDate || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold border ${statusClass}`}
                        >
                          {isOverdue ? "🔴 OVERDUE" : "📦 IN TRANSIT"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg transition"
                          onClick={() => handleReturn(item.id)}
                          disabled={actionLoadingId === item.id}
                          whileTap={{ scale: 0.97 }}
                        >
                          {actionLoadingId === item.id
                            ? "Returning..."
                            : "Return"}
                        </motion.button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h3 className="text-lg font-bold text-white mb-6">
          📊 Asset Utilization
        </h3>
        <div className="space-y-4">
          {[
            { asset: "Projectors", utilization: 75 },
            { asset: "Speakers", utilization: 65 },
            { asset: "Cameras", utilization: 80 },
            { asset: "Banners", utilization: 45 },
          ].map((item) => (
            <div key={item.asset}>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">{item.asset}</span>
                <span className="text-white font-bold">
                  {item.utilization}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${item.utilization}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h3 className="text-lg font-bold text-white mb-6">📈 Request Trends</h3>
        <div className="text-center">
          <div className="inline-block">
            <div className="text-5xl font-bold text-indigo-400">247</div>
            <p className="text-gray-400 mt-2">Total Requests (This Month)</p>
            <p className="text-green-400 text-sm mt-3">
              ↑ 23% increase from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
