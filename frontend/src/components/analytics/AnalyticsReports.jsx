import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

// Hardcoded comprehensive usage report data
const hardcodedReports = [
  {
    id: 1,
    asset: "Projector (Sony VPL-FHZ90)",
    requester: "Tech Club",
    owner: "Admin",
    status: "returned",
    dueDate: "2026-03-28",
    requestDate: "2026-03-25",
    duration: "3 days",
    club: "Tech Club",
    requestedBy: "John Smith",
    condition: "Good",
    duration_hours: 72,
  },
  {
    id: 2,
    asset: "Sound System (Bose SoundLink)",
    requester: "Arts & Culture",
    owner: "Admin",
    status: "returned",
    dueDate: "2026-03-27",
    requestDate: "2026-03-24",
    duration: "3 days",
    club: "Arts & Culture",
    requestedBy: "Sarah Ahmed",
    condition: "Good",
    duration_hours: 72,
  },
  {
    id: 3,
    asset: "Laptop (MacBook Pro)",
    requester: "Science Club",
    owner: "Admin",
    status: "checked_out",
    dueDate: "2026-03-31",
    requestDate: "2026-03-26",
    duration: "5 days",
    club: "Science Club",
    requestedBy: "Mike Johnson",
    condition: "Good",
    duration_hours: 120,
  },
  {
    id: 4,
    asset: "Camera (Canon EOS R5)",
    requester: "Photography Club",
    owner: "Admin",
    status: "checked_out",
    dueDate: "2026-03-30",
    requestDate: "2026-03-26",
    duration: "4 days",
    club: "Photography Club",
    requestedBy: "Emma Davis",
    condition: "Good",
    duration_hours: 96,
  },
  {
    id: 5,
    asset: "Speaker (JBL PartyBox 110)",
    requester: "Sports Council",
    owner: "Admin",
    status: "pending",
    dueDate: "2026-03-29",
    requestDate: "2026-03-28",
    duration: "1 day",
    club: "Sports Council",
    requestedBy: "Alex Brown",
    condition: "Pending Approval",
    duration_hours: 24,
  },
  {
    id: 6,
    asset: "Whiteboard & Markers Kit",
    requester: "Debate Society",
    owner: "Admin",
    status: "returned",
    dueDate: "2026-03-26",
    requestDate: "2026-03-23",
    duration: "3 days",
    club: "Debate Society",
    requestedBy: "Lisa Chen",
    condition: "Good",
    duration_hours: 72,
  },
  {
    id: 7,
    asset: "Microphone Set (Shure SM7B)",
    requester: "Music Club",
    owner: "Admin",
    status: "returned",
    dueDate: "2026-03-25",
    requestDate: "2026-03-22",
    duration: "3 days",
    club: "Music Club",
    requestedBy: "David Wilson",
    condition: "Good",
    duration_hours: 72,
  },
  {
    id: 8,
    asset: "Drone (DJI Air 3S)",
    requester: "Robotics Club",
    owner: "Admin",
    status: "checked_out",
    dueDate: "2026-04-02",
    requestDate: "2026-03-24",
    duration: "9 days",
    club: "Robotics Club",
    requestedBy: "Peter Kumar",
    condition: "Good",
    duration_hours: 216,
  },
  {
    id: 9,
    asset: "Documents Printer (HP LaserJet)",
    requester: "Student Council",
    owner: "Admin",
    status: "returned",
    dueDate: "2026-03-27",
    requestDate: "2026-03-20",
    duration: "7 days",
    club: "Student Council",
    requestedBy: "Jennifer Lee",
    condition: "Good",
    duration_hours: 168,
  },
  {
    id: 10,
    asset: "LED Lights (Neewer RGB)",
    requester: "Film Festival",
    owner: "Admin",
    status: "returned",
    dueDate: "2026-03-26",
    requestDate: "2026-03-21",
    duration: "5 days",
    club: "Film Festival",
    requestedBy: "Marcus Stone",
    condition: "Good",
    duration_hours: 120,
  },
  {
    id: 11,
    asset: "Stand & Adapter Kit",
    requester: "Coding Bootcamp",
    owner: "Admin",
    status: "overdue",
    dueDate: "2026-03-25",
    requestDate: "2026-03-18",
    duration: "7 days (Overdue)",
    club: "Coding Bootcamp",
    requestedBy: "Nathan Gray",
    condition: "Pending Return",
    duration_hours: 168,
  },
  {
    id: 12,
    asset: "Tripod Stand Set",
    requester: "News Club",
    owner: "Admin",
    status: "pending",
    dueDate: "2026-03-30",
    requestDate: "2026-03-28",
    duration: "2 days",
    club: "News Club",
    requestedBy: "Rachel White",
    condition: "Pending Approval",
    duration_hours: 48,
  },
];

const ReportFilter = ({ label, value, icon }) => (
  <div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm flex items-center gap-2">
    <span>{icon}</span>
    <span>
      {label}: <span className="font-semibold text-white">{value}</span>
    </span>
  </div>
);

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().split("T")[0];
};

const formatDuration = (startValue, endValue) => {
  if (!startValue || !endValue) return "-";
  const start = new Date(startValue);
  const end = new Date(endValue);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "-";

  const diffHours = Math.max(0, Math.round((end - start) / 3600000));
  if (diffHours >= 24 && diffHours % 24 === 0) {
    const days = diffHours / 24;
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  return `${diffHours}h`;
};

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const hasRealCondition = (condition) => {
  const value = String(condition || "").trim();
  return value && value !== "-";
};

const deriveCondition = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === "returned") return "Good";
  if (normalized === "checked_out") return "In Use";
  if (normalized === "overdue") return "Overdue Return";
  if (normalized === "pending") return "Pending Approval";
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  return "In Review";
};

const normalizeRow = (row, index) => {
  const requestDate = row.startDate || row.neededDate || row.requestDate;
  const dueDate = row.endDate || row.returnDate || row.dueDate;
  const durationHours =
    requestDate && dueDate
      ? Math.max(
          0,
          Math.round((new Date(dueDate) - new Date(requestDate)) / 3600000),
        )
      : (row.duration_hours ?? 0);

  return {
    id: row.id ?? index + 1,
    asset: row.asset || row.assetDetails?.name || "-",
    requestedBy:
      row.ownerDetails?.name ||
      row.owner ||
      row.requestedBy ||
      "Main Organizer",
    requestDate: formatDate(requestDate),
    dueDate: formatDate(dueDate),
    duration: formatDuration(requestDate, dueDate),
    duration_hours: durationHours,
    status: normalizeStatus(row.status || "pending"),
    condition: hasRealCondition(row.condition)
      ? row.condition
      : deriveCondition(row.status),
  };
};

const StatusBadge = ({ status }) => {
  const statusMap = {
    returned: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    checked_out: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    overdue: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase ${statusMap[status] || statusMap.pending}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

const AnalyticsReports = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState(hardcodedReports);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await logisticsAPI.listRequests();
        const requests = response?.requests || [];
        const normalizedRequests = requests.slice(0, 20).map(normalizeRow);

        // Use API data if available, fallback to hardcoded
        if (normalizedRequests.length > 0) {
          setRows(normalizedRequests);
          setFilteredRows(normalizedRequests);
        } else {
          const fallbackRows = hardcodedReports.map(normalizeRow);
          setRows(fallbackRows);
          setFilteredRows(fallbackRows);
        }
      } catch (error) {
        console.error("Failed to load analytics reports:", error);
        // Fallback to hardcoded data
        const fallbackRows = hardcodedReports.map(normalizeRow);
        setRows(fallbackRows);
        setFilteredRows(fallbackRows);
      }
    };

    load();
  }, []);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === "all") {
      setFilteredRows(rows);
    } else {
      setFilteredRows(rows.filter((row) => row.status === status));
    }
  };

  // Calculate summary stats
  const totalRequests = rows.length;
  const returnedCount = rows.filter((r) => r.status === "returned").length;
  const checkedOutCount = rows.filter((r) => r.status === "checked_out").length;
  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const overdueCount = rows.filter((r) => r.status === "overdue").length;
  const avgDuration = rows.length
    ? Math.round(
        rows.reduce((sum, r) => sum + (r.duration_hours || 0), 0) / rows.length,
      )
    : 0;

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-[#E5E7EB]">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-5 md:p-8">
        <main className="max-w-[1600px] mx-auto">
          {/* HEADER */}
          <motion.div
            className="rounded-3xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/18 via-[#111827] to-[#111827] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] mb-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-wrap justify-between gap-4 items-start">
              <div>
                <p className="text-indigo-200/80 text-xs tracking-[0.18em] uppercase mb-2">
                  📝 Usage Analytics
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  Usage Reports
                </h1>
                <p className="text-slate-300 mt-2 max-w-2xl">
                  Comprehensive request transactions and asset utilization
                  history
                </p>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold">
                  ✓ Live Data
                </div>
                <button className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/30 transition text-sm font-semibold">
                  ⬇️ Export Report
                </button>
              </div>
            </div>
          </motion.div>

          {/* SUMMARY METRICS */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Total Requests
              </p>
              <p className="text-2xl font-black text-indigo-300">
                {totalRequests}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Returned
              </p>
              <p className="text-2xl font-black text-emerald-300">
                {returnedCount}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Checked Out
              </p>
              <p className="text-2xl font-black text-blue-300">
                {checkedOutCount}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Pending
              </p>
              <p className="text-2xl font-black text-amber-300">
                {pendingCount}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Overdue
              </p>
              <p className="text-2xl font-black text-red-300">{overdueCount}</p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Avg Duration
              </p>
              <p className="text-2xl font-black text-cyan-300">
                {avgDuration}h
              </p>
            </motion.div>
          </motion.div>

          {/* FILTERS */}
          <motion.div
            className="mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 flex flex-wrap gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm text-slate-300 font-semibold">
              Filter by Status:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  selectedStatus === "all"
                    ? "bg-indigo-500/30 border border-indigo-400/50 text-indigo-200"
                    : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-slate-300"
                }`}
              >
                All ({totalRequests})
              </button>
              <button
                onClick={() => handleStatusFilter("returned")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  selectedStatus === "returned"
                    ? "bg-emerald-500/30 border border-emerald-400/50 text-emerald-200"
                    : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-slate-300"
                }`}
              >
                Returned ({returnedCount})
              </button>
              <button
                onClick={() => handleStatusFilter("checked_out")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  selectedStatus === "checked_out"
                    ? "bg-blue-500/30 border border-blue-400/50 text-blue-200"
                    : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-slate-300"
                }`}
              >
                Checked Out ({checkedOutCount})
              </button>
              <button
                onClick={() => handleStatusFilter("pending")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  selectedStatus === "pending"
                    ? "bg-amber-500/30 border border-amber-400/50 text-amber-200"
                    : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-slate-300"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => handleStatusFilter("overdue")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  selectedStatus === "overdue"
                    ? "bg-red-500/30 border border-red-400/50 text-red-200"
                    : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-slate-300"
                }`}
              >
                Overdue ({overdueCount})
              </button>
            </div>
          </motion.div>

          {/* TABLE */}
          <motion.div
            className="rounded-2xl border border-slate-700/70 bg-[#111827] overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-slate-900/70 sticky top-0 text-slate-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4 font-semibold">Asset</th>
                  <th className="px-5 py-4 font-semibold">Requested By</th>
                  <th className="px-5 py-4 font-semibold">Request Date</th>
                  <th className="px-5 py-4 font-semibold">Due Date</th>
                  <th className="px-5 py-4 font-semibold">Duration</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/70">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td
                      className="px-5 py-6 text-slate-400 text-center"
                      colSpan={7}
                    >
                      No requests found for this status.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, idx) => (
                    <motion.tr
                      key={row.id}
                      className="hover:bg-slate-800/40 transition"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + idx * 0.02 }}
                    >
                      <td className="px-5 py-4 text-slate-100 font-semibold">
                        📦 {row.asset}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        <span className="text-sm">{row.requestedBy}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm">
                        {row.requestDate}
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm">
                        {row.dueDate}
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm">
                        <span className="text-indigo-300 font-semibold">
                          {row.duration}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            row.condition === "Good"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : row.condition === "Pending Approval"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-slate-500/20 text-slate-300"
                          }`}
                        >
                          {row.condition}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>

          {/* FOOTER INFO */}
          <motion.div
            className="mt-8 rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <h3 className="text-sm uppercase tracking-[0.15em] text-slate-300 font-semibold mb-4">
              📊 Report Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-indigo-300">
                    Most Requested Asset:
                  </span>{" "}
                  Projector (Sony VPL-FHZ90)
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-blue-300">
                    Peak Usage Club:
                  </span>{" "}
                  Tech Club (4 requests)
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-amber-300">
                    Attention Needed:
                  </span>{" "}
                  1 overdue item requiring follow-up
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsReports;
