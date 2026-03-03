import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Dashboard design converted to Tailwind; sidebar is built-in

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingApprovals: 0,
    activeOrganizers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const u = JSON.parse(userStr);
      if (u.role !== "SYSTEM_ADMIN") {
        navigate("/");
        return;
      }
      setUser(u);

      // mocked stats
      setStats({
        totalUsers: 1250,
        totalEvents: 45,
        pendingApprovals: 12,
        activeOrganizers: 28,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* reuse existing sidebar or you can implement a Tailwind sidebar here */}
      {/* For simplicity we use a placeholder div */}
      <div className="w-64 flex-shrink-0 border-r border-primary/20 bg-background-light dark:bg-background-dark">
        {/* Sidebar content could be extracted to component */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">hub</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary">
              NEXORA
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Super Admin Platform
            </p>
          </div>
        </div>
        {/* ... nav links ... */}
      </div>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 border-b border-primary/10 bg-background-light/50 dark:bg-background-dark/50 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Super Admin Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-primary/5 border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm w-64"
                placeholder="Search ..."
                type="text"
              />
            </div>
            <button className="p-2 text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              University Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Real-time metrics and operational oversight for NEXORA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Total Users
                </span>
                <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-0.5 rounded-full font-bold">
                  +12%
                </span>
              </div>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Total Events
                </span>
                <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-0.5 rounded-full font-bold">
                  +5%
                </span>
              </div>
              <p className="text-3xl font-bold">{stats.totalEvents}</p>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: "42%" }}
                ></div>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Pending Approvals
                </span>
                <span className="bg-rose-500/10 text-rose-500 text-xs px-2 py-0.5 rounded-full font-bold">
                  -2%
                </span>
              </div>
              <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: "82%" }}
                ></div>
              </div>
            </div>
          </div>
          {/* Additional sections can be added similarly */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
