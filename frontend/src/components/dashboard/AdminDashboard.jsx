import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Box,
  ClipboardList,
<<<<<<< HEAD
  Link,
=======
  Moon,
>>>>>>> aadc276f88b0ca444505a08caa5e8831b415ede2
  PackageCheck,
  Sun,
  Truck,
} from "lucide-react";

const cardStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
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

    // Fetch logistics stats
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [assetsResponse, requestsResponse, linksResponse] = await Promise.all([
        logisticsAPI.listAssets(),
        logisticsAPI.listRequests(),
        import("../../services/api").then(m => m.groupLinksAPI.getAllLinks())
      ]);

      const assetsData = assetsResponse?.assets || [];
      const requestsData = requestsResponse?.requests || [];
      const linksData = linksResponse?.links || [];

      setAssets(assetsData);
      setRequests(requestsData);

      // Calculate stats
      const availableAssets = assetsData.filter(
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
        totalAssets: assetsData.length,
        totalRequests: requestsData.length,
        availableAssets,
        activeRequests,
        inTransit,
        overdueReturns,
        totalLinks: linksData.length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Keep default values
      setStats({
        totalAssets: 0,
        totalRequests: 0,
        availableAssets: 0,
        activeRequests: 0,
        inTransit: 0,
        overdueReturns: 0,
        totalLinks: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statusClass = (status, isDark = true) => {
    if (isDark) {
      if (status === "overdue")
        return "bg-red-500/15 text-red-300 border-red-500/30";
      if (status === "pending")
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      if (status === "checked_out")
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      if (status === "returned")
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
    } else {
      if (status === "overdue")
        return "bg-red-500/10 text-red-600 border-red-500/30";
      if (status === "pending")
        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      if (status === "checked_out")
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      if (status === "returned")
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
      return "bg-slate-500/10 text-slate-600 border-slate-500/30";
    }
  };

  const recentRequests = requests.slice(0, 6);

  if (!user) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div
      className={`min-h-screen flex ${isDarkMode ? "bg-[#0B0F19] text-[#E5E7EB]" : "bg-[#F9FAFB] text-[#053668]"}`}
    >
      <Sidebar isAdmin={true} />

      <div className="flex flex-col min-h-screen flex-1">
        <main className="flex-1 px-5 sm:px-8 pb-8 max-w-[1320px] mx-auto w-full">
          <motion.div
            className={`rounded-3xl border ${isDarkMode ? "border-indigo-500/25 bg-gradient-to-r from-indigo-500/18 via-[#111827] to-[#111827]" : "border-[#FF7100]/25 bg-gradient-to-r from-[#F7ECB5]/20 via-[#F9FAFB] to-[#F9FAFB]"} p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] mb-8`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-wrap justify-between gap-4 items-start">
              <div>
                <p
                  className={`${isDarkMode ? "text-indigo-200/80" : "text-[#FF7100]/80"} text-xs tracking-[0.18em] uppercase mb-2`}
                >
                  System Command Center
                </p>
                <h1
                  className={`text-3xl md:text-4xl font-black ${isDarkMode ? "text-white" : "text-[#053668]"}`}
                >
                  Welcome back, {user?.name?.split(" ")[0] || "Admin"}
                </h1>
                <p
                  className={`${isDarkMode ? "text-slate-300" : "text-[#053668]/70"} mt-2 max-w-2xl`}
                >
                  Monitor platform operations, oversee logistics flow, and
                  respond to critical requests in real time.
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={toggleTheme}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 ${isDarkMode ? "bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/30" : "bg-[#FF7100]/20 border border-[#FF7100]/30 text-[#FF7100] hover:bg-[#FF7100]/30"} transition`}
                  whileTap={{ scale: 0.98 }}
                  title={
                    isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                  }
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
                <motion.button
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 ${isDarkMode ? "bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/30" : "bg-[#FF7100]/20 border border-[#FF7100]/30 text-[#FF7100] hover:bg-[#FF7100]/30"} transition`}
                  whileTap={{ scale: 0.98 }}
                >
                  Export Snapshot <ArrowUpRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-4 mb-8"
            variants={cardStagger}
            initial="hidden"
            animate="show"
          >
            {[
              {
                title: "Total Assets",
                value: stats?.totalAssets || "0",
                icon: Box,
                color: "text-indigo-300",
<<<<<<< HEAD
                path: "/logistics/assets"
=======
                lightColor: "text-[#053668]",
>>>>>>> aadc276f88b0ca444505a08caa5e8831b415ede2
              },
              {
                title: "Total Requests",
                value: stats?.totalRequests || "0",
                icon: ClipboardList,
                color: "text-cyan-300",
<<<<<<< HEAD
                path: "/logistics/admin"
=======
                lightColor: "text-[#053668]",
>>>>>>> aadc276f88b0ca444505a08caa5e8831b415ede2
              },
              {
                title: "Available Assets",
                value: stats?.availableAssets || "0",
                icon: PackageCheck,
                color: "text-emerald-300",
<<<<<<< HEAD
                path: "/logistics/assets"
=======
                lightColor: "text-[#053668]",
>>>>>>> aadc276f88b0ca444505a08caa5e8831b415ede2
              },
              {
                title: "Active Requests",
                value: stats?.activeRequests || "0",
                icon: Activity,
                color: "text-blue-300",
<<<<<<< HEAD
                path: "/logistics/admin"
=======
                lightColor: "text-[#053668]",
>>>>>>> aadc276f88b0ca444505a08caa5e8831b415ede2
              },
              {
                title: "In Transit",
                value: stats?.inTransit || "0",
                icon: Truck,
                color: "text-amber-300",
<<<<<<< HEAD
                path: "/logistics/admin"
=======
                lightColor: "text-[#FF7100]",
>>>>>>> aadc276f88b0ca444505a08caa5e8831b415ede2
              },
              {
                title: "Overdue Returns",
                value: stats?.overdueReturns || "0",
                icon: AlertTriangle,
                color: "text-red-300",
<<<<<<< HEAD
                path: "/logistics/admin"
              },
              {
                title: "Group Links",
                value: stats?.totalLinks || "0",
                icon: Link,
                color: "text-purple-300",
                path: "/admin/group-links"
=======
                lightColor: "text-[#FF7100]",
>>>>>>> aadc276f88b0ca444505a08caa5e8831b415ede2
              },
            ].map((card, i) => (
              <motion.div
                key={i}
<<<<<<< HEAD
                className="rounded-2xl p-4 border border-slate-700/70 bg-[#111827] shadow-sm hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition cursor-pointer"
=======
                className={`rounded-2xl p-4 border ${isDarkMode ? "border-slate-700/70 bg-[#111827] shadow-sm hover:shadow-indigo-500/10" : `border-[#FF7100]/30 bg-[#FFFFFF] shadow-sm hover:shadow-[#FF7100]/10`} hover:-translate-y-0.5 transition`}
>>>>>>> aadc276f88b0ca444505a08caa5e8831b415ede2
                variants={fadeUp}
                transition={{ duration: 0.26, ease: "easeOut" }}
                whileHover={{ y: -3 }}
                onClick={() => card.path && navigate(card.path)}
              >
                <div className={`flex items-center gap-2 ${isDarkMode ? card.color : card.lightColor}`}>
                  <card.icon size={16} />
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-[#053668]"}`}>
                    {card.title}
                  </p>
                </div>
                <p className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-[#053668]"} mt-2`}>
                  {loading ? "..." : card.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 xl:grid-cols-3 gap-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.32, ease: "easeOut" }}
          >
            <section className={`xl:col-span-2 rounded-2xl border ${isDarkMode ? "border-slate-700/70 bg-[#111827]" : "border-[#FF7100]/30 bg-[#FFFFFF]"}`}>
              <div className={`px-5 py-4 border-b ${isDarkMode ? "border-slate-700/70" : "border-[#FF7100]/30"} flex items-center justify-between`}>
                <h2 className={`text-sm uppercase tracking-[0.15em] ${isDarkMode ? "text-slate-300" : "text-[#053668]"}`}>
                  Recent Logistics Activity
                </h2>
                <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-[#FF7100]"}`}>
                  {recentRequests.length} items
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className={`${isDarkMode ? "bg-slate-900/70" : "bg-[#F7ECB5]/30"} sticky top-0`}>
                    <tr className={`${isDarkMode ? "text-slate-400" : "text-[#FF7100]"} uppercase text-xs tracking-wider`}>
                      <th className="px-5 py-3">Asset</th>
                      <th className="px-5 py-3">Owner</th>
                      <th className="px-5 py-3">Requester</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? "divide-slate-700/70" : "divide-[#FF7100]/20"}`}>
                    {recentRequests.length === 0 ? (
                      <tr>
                        <td className={`px-5 py-6 ${isDarkMode ? "text-slate-400" : "text-[#FF7100]"}`} colSpan={5}>
                          No recent activity yet.
                        </td>
                      </tr>
                    ) : (
                      recentRequests.map((item) => (
                        <motion.tr
                          key={item.id}
                          className={`${isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-[#F7ECB5]/30"} transition`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <td className={`px-5 py-4 font-medium ${isDarkMode ? "text-slate-100" : "text-[#053668]"}`}>
                            {item.asset || "Unnamed Asset"}
                          </td>
                          <td className={`px-5 py-4 ${isDarkMode ? "text-slate-400" : "text-[#FF7100]"}`}>
                            {item.owner || "Unknown"}
                          </td>
                          <td className={`px-5 py-4 ${isDarkMode ? "text-slate-400" : "text-[#FF7100]"}`}>
                            {item.club || "Unknown"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full border text-xs font-semibold uppercase ${statusClass(item.status, isDarkMode)}`}
                            >
                              {(item.status || "pending").replaceAll("_", " ")}
                            </span>
                          </td>
                          <td className={`px-5 py-4 ${isDarkMode ? "text-slate-300" : "text-[#053668]"}`}>
                            {item.dueDate || "-"}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={`rounded-2xl border ${isDarkMode ? "border-slate-700/70 bg-[#111827]" : "border-[#FF7100]/30 bg-[#FFFFFF]"} p-5`}>
              <h2 className={`text-sm uppercase tracking-[0.15em] ${isDarkMode ? "text-slate-300" : "text-[#053668]"} mb-4`}>
                System Insights
              </h2>

              <div className="space-y-3">
                <InsightCard
                  title="Asset Health"
                  value={`${Math.max(0, stats?.totalAssets - stats?.overdueReturns)} healthy`}
                  tone="emerald"
                  isDarkMode={isDarkMode}
                />
                <InsightCard
                  title="Pending Attention"
                  value={`${stats?.activeRequests || 0} open approvals`}
                  tone="amber"
                  isDarkMode={isDarkMode}
                />
                <InsightCard
                  title="Total Inventory"
                  value={`${assets.length} listed assets`}
                  tone="indigo"
                  isDarkMode={isDarkMode}
                />
              </div>
            </section>
          </motion.div>
        </main>

        <footer className={`border-t ${isDarkMode ? "border-slate-700/70 text-slate-500 bg-[#0B0F19]" : "border-[#FF7100]/30 text-[#FF7100] bg-[#F9FAFB]"} py-5 text-center text-sm`}>
          © 2026 NEXORA Event Management System
        </footer>
      </div>
    </div>
  );
};

const InsightCard = ({ title, value, tone, isDarkMode = true }) => {
  const toneMapDark = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200",
  };

  const toneMapLight = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600",
  };

  const toneMap = isDarkMode ? toneMapDark : toneMapLight;

  return (
    <motion.div
      className={`rounded-xl border px-4 py-3 ${toneMap[tone] || toneMap.indigo}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <p className={`text-xs uppercase tracking-wider opacity-80 ${isDarkMode ? "" : "text-slate-600"}`}>{title}</p>
      <p className={`font-bold mt-1 ${isDarkMode ? "" : "text-slate-700"}`}>{value}</p>
    </motion.div>
  );
};

export default AdminDashboard;
