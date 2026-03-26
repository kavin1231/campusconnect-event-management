import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  Clock3,
  Package,
  Truck,
} from "lucide-react";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (e) {
      navigate("/login");
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [assetsResponse, requestsResponse] = await Promise.all([
        logisticsAPI.listAssets(),
        logisticsAPI.listRequests(),
      ]);

      const assets = assetsResponse?.assets || [];
      const requestsData = requestsResponse?.requests || [];
      setRequests(requestsData);

      const availableAssets = assets.filter(
        (a) =>
          (a.status || "").toUpperCase() === "AVAILABLE" ||
          Number(a.availableQty || a.available || 0) > 0,
      ).length;
      const activeRequests = requestsData.filter(
        (r) => r.status === "pending",
      ).length;
      const inTransit = requestsData.filter(
        (r) => r.status === "checked_out",
      ).length;
      const overdueReturns = requestsData.filter(
        (r) =>
          r.status === "overdue" ||
          (r.dueDate && new Date(r.dueDate) < new Date()),
      ).length;

      setStats({
        availableAssets,
        activeRequests,
        inTransit,
        overdueReturns,
      });
    } catch (error) {
      console.error("Failed to fetch organizer stats:", error);
      setStats({
        availableAssets: 0,
        activeRequests: 0,
        inTransit: 0,
        overdueReturns: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10 text-white">Loading...</div>;

  const recent = requests.slice(0, 5);

  const statusClass = (status) => {
    if (status === "overdue") return "text-red-300 border-red-500/30 bg-red-500/10";
    if (status === "pending") return "text-amber-300 border-amber-500/30 bg-amber-500/10";
    if (status === "checked_out") return "text-blue-300 border-blue-500/30 bg-blue-500/10";
    return "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";
  };

  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-[#E5E7EB]">
      <Sidebar isAdmin={true} />

      <div className="flex flex-col min-h-screen flex-1">
        <main className="flex-1 px-5 sm:px-8 pb-8 max-w-[1320px] mx-auto w-full">
          <motion.div
            className="rounded-3xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/18 via-[#111827] to-[#111827] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] mb-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <p className="text-indigo-200/80 text-xs tracking-[0.18em] uppercase mb-2">
              Organizer Workspace
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Event Organizer Dashboard
            </h1>
            <p className="text-slate-300 max-w-2xl">
              Manage event logistics, track inter-club asset sharing, and
              monitor active requests.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                title: "Available Assets",
                value: stats?.availableAssets || "0",
                icon: Package,
                color: "text-emerald-300",
              },
              {
                title: "Active Requests",
                value: stats?.activeRequests || "0",
                icon: ClipboardCheck,
                color: "text-blue-300",
              },
              {
                title: "In Transit",
                value: stats?.inTransit || "0",
                icon: Truck,
                color: "text-amber-300",
              },
              {
                title: "Overdue Returns",
                value: stats?.overdueReturns || "0",
                icon: AlertTriangle,
                color: "text-red-300",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-4 border border-slate-700/70 bg-[#111827] hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" }}
                whileHover={{ y: -3 }}
              >
                <div className={`flex items-center gap-2 ${card.color}`}>
                  <card.icon size={16} />
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    {card.title}
                  </p>
                </div>
                <p className="text-3xl font-black text-white mt-2">
                  {loading ? "..." : card.value}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="grid grid-cols-1 xl:grid-cols-3 gap-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.3, ease: "easeOut" }}
          >
            <section className="xl:col-span-2 rounded-2xl border border-slate-700/70 bg-[#111827]">
              <div className="px-5 py-4 border-b border-slate-700/70 flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-[0.15em] text-slate-300">
                  Recent Requests
                </h2>
                <span className="text-xs text-slate-400">{recent.length} items</span>
              </div>

              <div className="divide-y divide-slate-700/70">
                {recent.length === 0 ? (
                  <div className="px-5 py-6 text-slate-400">No request activity yet.</div>
                ) : (
                  recent.map((r) => (
                    <motion.div
                      key={r.id}
                      className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-slate-800/35 transition"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div>
                        <p className="font-semibold text-slate-100">{r.asset || "Unnamed Asset"}</p>
                        <p className="text-sm text-slate-400">Needed: {r.neededDate || "-"} | Return: {r.returnDate || "-"}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full border text-xs uppercase font-semibold ${statusClass(r.status)}`}>
                        {(r.status || "pending").replaceAll("_", " ")}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700/70 bg-[#111827] p-5">
              <h2 className="text-sm uppercase tracking-[0.15em] text-slate-300 mb-4">
                Status Overview
              </h2>
              <div className="space-y-3">
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
                  <p className="text-xs text-indigo-200 uppercase tracking-wider">Response Window</p>
                  <p className="font-bold text-indigo-100 mt-1 inline-flex items-center gap-1">
                    <Clock3 size={14} /> Under 24h
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                  <p className="text-xs text-emerald-200 uppercase tracking-wider">Fulfillment Rate</p>
                  <p className="font-bold text-emerald-100 mt-1">{stats?.activeRequests ? Math.max(0, 100 - Math.round((stats.activeRequests / (requests.length || 1)) * 100)) : 100}%</p>
                </div>
                <div className="rounded-xl border border-slate-500/30 bg-slate-500/10 px-4 py-3">
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Next Action</p>
                  <p className="font-bold text-slate-100 mt-1 inline-flex items-center gap-1">
                    Review pending queue <ArrowRight size={14} />
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        </main>

        <footer className="border-t border-slate-700/70 py-5 text-center text-slate-500 text-sm bg-[#0B0F19]">
          © 2026 NEXORA Event Management System
        </footer>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
