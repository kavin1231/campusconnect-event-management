import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GovernanceDashboard.css";

const GovernanceDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pendingClubApprovals: 5,
    pendingEventApprovals: 12,
    activeClubs: 24,
    totalEvents: 48,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({ status: "all", date: "all" });

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
  }, [navigate]);

  if (!user) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="governance-dashboard bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* HEADER */}
      <header className="governance-header bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Governance Hub</h1>
              <p className="text-gray-400 text-sm">Manage approvals, roles & permissions</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="governance-main px-8 py-8 max-w-7xl mx-auto">
        {/* STATS GRID */}
        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Club Approvals"
            value={stats.pendingClubApprovals}
            icon="🏢"
            color="blue"
          />
          <StatCard
            title="Pending Event Approvals"
            value={stats.pendingEventApprovals}
            icon="📅"
            color="orange"
          />
          <StatCard
            title="Active Clubs"
            value={stats.activeClubs}
            icon="👥"
            color="green"
          />
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon="🎉"
            color="purple"
          />
        </div>

        {/* TAB NAVIGATION */}
        <div className="tabs-section mb-8">
          <div className="flex gap-2 border-b border-gray-700">
            {["overview", "approvals", "permissions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "approvals" && <ApprovalsTab />}
        {activeTab === "permissions" && <PermissionsTab />}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="stat-card bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition group cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-4xl font-bold text-white">{value}</p>
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-br ${colorMap[color]} rounded-lg flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">View details →</p>
      </div>
    </div>
  );
};

const OverviewTab = () => {
  return (
    <div className="space-y-8">
      {/* QUICK ACTIONS */}
      <section className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
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
      </section>

      {/* RECENT ACTIVITIES */}
      <section className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activities</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <ActivityItem key={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

const ActionButton = ({ icon, title, desc, href }) => (
  <button
    onClick={() => window.location.href = href}
    className="p-6 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-left transition group"
  >
    <div className="text-3xl mb-3 group-hover:scale-110 transition">{icon}</div>
    <h3 className="font-bold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </button>
);

const ActivityItem = () => (
  <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
      A
    </div>
    <div className="flex-1">
      <p className="text-white font-medium">Arts Club approvals completed</p>
      <p className="text-xs text-gray-400">2 hours ago</p>
    </div>
    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
      Approved
    </span>
  </div>
);

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
  ]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Type</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Name</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((approval) => (
            <tr
              key={approval.id}
              className="border-b border-gray-700 hover:bg-gray-700/50 transition"
            >
              <td className="py-4 px-4 text-white">{approval.type}</td>
              <td className="py-4 px-4 text-white font-medium">{approval.name}</td>
              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    approval.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-400">{approval.date}</td>
              <td className="py-4 px-4">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition">
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PermissionsTab = () => {
  const [roles] = useState([
    { id: 1, name: "President", permissions: ["approve_clubs", "approve_events", "manage_roles"] },
    { id: 2, name: "Treasurer", permissions: ["view_finance", "approve_budget"] },
    { id: 3, name: "Event Manager", permissions: ["approve_events", "manage_venues"] },
  ]);

  return (
    <div className="space-y-6">
      {roles.map((role) => (
        <div key={role.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">{role.name}</h3>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition">
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {role.permissions.map((perm) => (
              <span
                key={perm}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
              >
                {perm.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GovernanceDashboard;
