import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
      const [assetsResponse, requestsResponse] = await Promise.all([
        logisticsAPI.listAssets(),
        logisticsAPI.listRequests(),
      ]);

      const assets = assetsResponse || [];
      const requests = requestsResponse || [];

      // Calculate stats
      const availableAssets = assets.filter(
        (a) => a.status === "available",
      ).length;
      const activeRequests = requests.filter(
        (r) => r.status === "pending",
      ).length;
      const inTransit = requests.filter(
        (r) => r.status === "checked_out",
      ).length;
      const overdueReturns = requests.filter(
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
      console.error("Failed to fetch stats:", error);
      // Keep default values
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex">
      {/* ================= SIDEBAR ================= */}
      <Sidebar isAdmin={true} />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex flex-col min-h-screen flex-1">
        {/* ================= MAIN ================= */}
        <main className="flex-1 py-10 px-6 sm:px-10 max-w-[1200px] mx-auto w-full">
          {/* Title */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white mb-2">
              Inter-Club Logistics Exchange
            </h1>
            <p className="text-slate-400">
              🔥 Resource Availability Engine: Clubs share speakers, cameras,
              banners, booth materials, tables/chairs. Prevent double booking
              with smart allocation.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              {
                title: "Available Assets",
                value: stats?.availableAssets || "0",
                icon: "inventory",
                color: "text-emerald-400",
              },
              {
                title: "Active Requests",
                value: stats?.activeRequests || "0",
                icon: "pending_actions",
                color: "text-blue-400",
              },
              {
                title: "In Transit",
                value: stats?.inTransit || "0",
                icon: "local_shipping",
                color: "text-yellow-400",
              },
              {
                title: "Overdue Returns",
                value: stats?.overdueReturns || "0",
                icon: "warning",
                color: "text-red-400",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border border-neutral-border bg-neutral-dark/30 hover:bg-neutral-dark/50 transition"
              >
                <div className={`flex items-center gap-2 ${card.color}`}>
                  <span className="material-symbols-outlined text-sm">
                    {card.icon}
                  </span>
                  <p className="text-sm font-semibold uppercase tracking-wider">
                    {card.title}
                  </p>
                </div>
                <p className="text-3xl font-black text-white mt-3">
                  {loading ? "..." : card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-neutral-border bg-neutral-dark/20 shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-dark border-b border-neutral-border text-slate-400 uppercase text-xs tracking-widest">
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Owner Club</th>
                  <th className="px-6 py-4">Requesting Club</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                <tr className="hover:bg-neutral-dark/40 transition">
                  <td className="px-6 py-5 font-semibold text-white">
                    Professional Speaker System
                  </td>
                  <td className="px-6 py-5 text-slate-400">Music Club</td>
                  <td className="px-6 py-5 text-slate-400">Drama Society</td>
                  <td className="px-6 py-5 text-blue-400 font-semibold">
                    Requested
                  </td>
                  <td className="px-6 py-5 text-slate-400">Mar 15, 2026</td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition">
                      Approve
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-neutral-dark/40 transition">
                  <td className="px-6 py-5 font-semibold text-white">
                    DSLR Camera Kit
                  </td>
                  <td className="px-6 py-5 text-slate-400">Photography Club</td>
                  <td className="px-6 py-5 text-slate-400">
                    IEEE Student Branch
                  </td>
                  <td className="px-6 py-5 text-emerald-400 font-semibold">
                    Approved
                  </td>
                  <td className="px-6 py-5 text-slate-400">Mar 18, 2026</td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-2 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition">
                      Track
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-neutral-dark/40 transition">
                  <td className="px-6 py-5 font-semibold text-white">
                    Exhibition Booth Panels
                  </td>
                  <td className="px-6 py-5 text-slate-400">Business Society</td>
                  <td className="px-6 py-5 text-slate-400">
                    Cultural Committee
                  </td>
                  <td className="px-6 py-5 text-yellow-400 font-semibold">
                    In Transit
                  </td>
                  <td className="px-6 py-5 text-slate-400">Mar 20, 2026</td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition">
                      Confirm Return
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-neutral-dark/40 transition">
                  <td className="px-6 py-5 font-semibold text-white">
                    Conference Tables (Set of 6)
                  </td>
                  <td className="px-6 py-5 text-slate-400">
                    Faculty of Engineering
                  </td>
                  <td className="px-6 py-5 text-slate-400">Debate Club</td>
                  <td className="px-6 py-5 text-red-400 font-semibold">
                    Overdue
                  </td>
                  <td className="px-6 py-5 text-red-400 font-semibold">
                    Mar 10, 2026
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition">
                      Send Reminder
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-neutral-border py-6 text-center text-slate-500 text-sm bg-background-dark/50">
          © 2026 NEXORA Event Management System
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
