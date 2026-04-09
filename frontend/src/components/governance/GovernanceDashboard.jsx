import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { governanceAPI } from "../../services/api";
import "./professional-theme.css";

const GovernanceDashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pendingClubApprovals: 0,
    pendingEventApprovals: 0,
    activeClubs: 0,
    totalEvents: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

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
      fetchEventApprovals();
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchEventApprovals = async () => {
    setLoading(true);
    try {
      const data = await governanceAPI.getEventApprovals();
      if (data.success) {
        // Update stats based on fetched data
        setStats({
          pendingClubApprovals:
            data.events?.filter((e) => e.status === "pending_club_approval")
              .length || 0,
          pendingEventApprovals:
            data.events?.filter((e) => e.status === "pending_approval")
              .length || 0,
          activeClubs: data.stats?.activeClubs || 0,
          totalEvents: data.events?.length || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch event approvals:", error);
    }
    setLoading(false);
  };

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">
      <Sidebar isAdmin={true} />
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="px-5 sm:px-8 pt-8 pb-6">
          <div className="rounded-3xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/18 via-[#111827] to-[#111827] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="flex flex-wrap justify-between gap-4 items-start">
              <div>
                <p className="text-indigo-200/80 text-xs tracking-[0.18em] uppercase mb-2">
                  Governance Management
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  Governance Hub
                </h1>
                <p className="text-slate-300 mt-2 max-w-2xl">
                  Manage approvals, roles & permissions
                </p>
              </div>
              
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-5 sm:px-8 pb-8 max-w-[1320px] mx-auto w-full">
          {/* STATS GRID */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Pending Club Approvals",
                  value: stats.pendingClubApprovals,
                  icon: "🏢",
                  color: "text-blue-300",
                },
                {
                  title: "Pending Event Approvals",
                  value: stats.pendingEventApprovals,
                  icon: "📅",
                  color: "text-amber-300",
                },
                {
                  title: "Active Clubs",
                  value: stats.activeClubs,
                  icon: "👥",
                  color: "text-emerald-300",
                },
                {
                  title: "Total Events",
                  value: stats.totalEvents,
                  icon: "🎉",
                  color: "text-indigo-300",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 border border-slate-700/70 bg-[#111827] shadow-sm hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition"
                >
                  <div className={`flex items-center gap-2 ${stat.color}`}>
                    <span className="text-lg">{stat.icon}</span>
                    <p className="text-xs font-semibold uppercase tracking-wider">
                      {stat.title}
                    </p>
                  </div>
                  <p className="text-2xl font-black text-white mt-2">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="mb-6">
            <h2 className="text-sm uppercase tracking-[0.15em] text-slate-300 mb-4">
              Dashboard
            </h2>
            <div className="flex gap-2 border-b border-slate-700/70 mb-6">
              {["overview", "approvals", "permissions"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold transition-all text-sm uppercase tracking-wider ${
                    activeTab === tab
                      ? "text-indigo-300 border-b-2 border-indigo-500"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "approvals" && <ApprovalsTab />}
            {activeTab === "permissions" && <PermissionsTab />}
          </div>
        </main>
      </div>
    </div>
  );
};

// ============================================
// OVERVIEW TAB
// ============================================
const OverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* QUICK ACTIONS */}
      <div className="rounded-2xl border border-slate-700/70 bg-[#111827] p-5">
        <div className="mb-5 flex items-center gap-2 text-indigo-300">
          <span className="text-xl">⚡</span>
          <div>
            <h3 className="text-sm uppercase tracking-[0.15em] text-slate-300 font-semibold">
              Quick Actions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Common management tasks
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            icon="🏢"
            title="Club Onboarding"
            desc="Review & approve clubs"
            href="/governance/club-onboarding"
          />
          <ActionButton
            icon="📅"
            title="Event Approvals"
            desc="Manage event submissions"
            href="/governance/event-approval"
          />
          <ActionButton
            icon="🔐"
            title="Role Management"
            desc="Configure permissions"
            href="/governance/roles"
          />
        </div>
      </div>

      {/* RECENT ACTIVITIES */}
      <div className="rounded-2xl border border-slate-700/70 bg-[#111827] p-5">
        <div className="mb-5 flex items-center gap-2 text-amber-300">
          <span className="text-xl">📋</span>
          <div>
            <h3 className="text-sm uppercase tracking-[0.15em] text-slate-300 font-semibold">
              Recent Activities
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest actions on the platform
            </p>
          </div>
        </div>
        <div className="divide-y divide-slate-700/70">
          <ActivityItem
            title="Arts Club approval completed"
            time="2 hours ago"
            status="success"
          />
          <ActivityItem
            title="Tech Summit event rejected"
            time="4 hours ago"
            status="danger"
          />
          <ActivityItem
            title="Photography Club pending review"
            time="6 hours ago"
            status="pending"
          />
          <ActivityItem
            title="Workshop event approved"
            time="1 day ago"
            status="success"
          />
          <ActivityItem
            title="Science Club onboarding submitted"
            time="1 day ago"
            status="pending"
          />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, title, desc, href }) => (
  <button
    onClick={() => (window.location.href = href)}
    className="p-6 bg-slate-800/50 hover:bg-slate-800 border-2 border-slate-700 hover:border-indigo-500/50 rounded-lg text-left transition group"
  >
    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-slate-100 mb-1 group-hover:text-indigo-300 transition">
      {title}
    </h3>
    <p className="text-sm text-slate-400">{desc}</p>
  </button>
);

const ActivityItem = ({ title, time, status }) => {
  const statusConfig = {
    success: {
      badge: "✓",
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    danger: {
      badge: "✕",
      color: "bg-red-500/20 text-red-300 border-red-500/30",
    },
    pending: {
      badge: "⏳",
      color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
      <div
        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${config.color}`}
      >
        {config.badge}
      </div>
      <div className="flex-1">
        <p className="text-slate-100 font-medium">{title}</p>
        <p className="text-sm text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

// ============================================
// APPROVALS TAB
// ============================================
const ApprovalsTab = () => {
  const [approvals] = useState([
    {
      id: 1,
      type: "Club",
      name: "Drama Club",
      status: "pending",
      submittedBy: "John Doe",
      date: "2024-03-20",
    },
    {
      id: 2,
      type: "Event",
      name: "Annual Fest 2024",
      status: "pending",
      submittedBy: "Art Club",
      date: "2024-03-19",
    },
    {
      id: 3,
      type: "Club",
      name: "Tech Club",
      status: "approved",
      submittedBy: "Admin",
      date: "2024-03-18",
    },
    {
      id: 4,
      type: "Event",
      name: "Hackathon",
      status: "approved",
      submittedBy: "Tech Club",
      date: "2024-03-17",
    },
    {
      id: 5,
      type: "Club",
      name: "Photography Club",
      status: "rejected",
      submittedBy: "Jane Smith",
      date: "2024-03-16",
    },
  ]);

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-[#111827]">
      <div className="px-5 py-4 border-b border-slate-700/70 flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-300">
          <span className="text-lg">📋</span>
          <div>
            <h3 className="text-sm uppercase tracking-[0.15em] text-slate-300 font-semibold">
              Pending & Managed Approvals
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              All club and event submissions
            </p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/30 transition text-sm font-semibold">
          + New Approval
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-900/70 sticky top-0">
            <tr className="text-slate-400 uppercase text-xs tracking-wider">
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Submitted By</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/70">
            {approvals.map((approval) => (
              <tr
                key={approval.id}
                className="hover:bg-slate-800/40 transition"
              >
                <td className="px-5 py-4">
                  <span className="inline-block px-3 py-1 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg text-sm font-medium">
                    {approval.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-100 font-medium">
                  {approval.name}
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {approval.submittedBy}
                </td>
                <td className="px-5 py-4 text-slate-400">{approval.date}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full border text-xs font-semibold uppercase ${
                      approval.status === "pending"
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : approval.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/15 text-red-300 border-red-500/30"
                    }`}
                  >
                    {approval.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700 transition text-xs font-semibold uppercase">
                      View
                    </button>
                    {approval.status === "pending" && (
                      <button className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/30 transition text-xs font-semibold uppercase">
                        Review
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// PERMISSIONS TAB
// ============================================
const PermissionsTab = () => {
  const [roles] = useState([
    {
      id: 1,
      name: "President",
      permissions: ["approve_clubs", "approve_events", "manage_roles"],
      description: "Full administrative access",
    },
    {
      id: 2,
      name: "Treasurer",
      permissions: ["view_finance", "approve_budget"],
      description: "Financial management access",
    },
    {
      id: 3,
      name: "Event Manager",
      permissions: ["approve_events", "manage_venues"],
      description: "Event management access",
    },
  ]);

  return (
    <div className="space-y-6">
      {roles.map((role) => (
        <div
          key={role.id}
          className="rounded-2xl border border-slate-700/70 bg-[#111827] p-5"
        >
          <div className="flex items-start justify-between mb-5 pb-5 border-b border-slate-700/70">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                {role.name}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{role.description}</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700 transition text-sm font-semibold">
              Edit Permissions
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {role.permissions.map((perm) => (
              <span
                key={perm}
                className="inline-block px-3 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-sm rounded-lg font-medium"
              >
                {perm.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GovernanceDashboard;
