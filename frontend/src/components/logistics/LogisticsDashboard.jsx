import { useState } from "react";

const LogisticsDashboard = () => {
  const [stats, setStats] = useState({
    totalAssets: 48,
    availableAssets: 35,
    checkedOut: 10,
    pendingRequests: 5,
    overdue: 3,
  });

  const [tabs, setTabs] = useState("overview");

  return (
    <div className="logistics-dashboard bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* HEADER */}
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-2xl">
              📦
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Logistics Hub</h1>
              <p className="text-gray-400 text-sm">Inter-Club Resource Exchange & Management</p>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex gap-2 border-b border-gray-700 mt-6">
            {["overview", "assets", "requests", "checkout", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTabs(tab)}
                className={`px-6 py-3 font-semibold transition-all ${
                  tabs === tab
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="px-8 py-8 max-w-7xl mx-auto">
        {tabs === "overview" && <OverviewTab stats={stats} />}
        {tabs === "assets" && <AssetsTab />}
        {tabs === "requests" && <RequestsTab />}
        {tabs === "checkout" && <CheckoutTab />}
        {tabs === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
};

const OverviewTab = ({ stats }) => {
  const statCards = [
    { label: "Total Assets", value: stats.totalAssets, icon: "📦", color: "indigo" },
    { label: "Available", value: stats.availableAssets, icon: "✓", color: "green" },
    { label: "Checked Out", value: stats.checkedOut, icon: "🔄", color: "blue" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: "⏳", color: "yellow" },
    { label: "Overdue Returns", value: stats.overdue, icon: "⚠️", color: "red" },
  ];

  return (
    <div className="space-y-8">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition"
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MOST REQUESTED ASSETS */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔥 Most Requested Assets</h2>
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
          <h2 className="text-xl font-bold text-white mb-6">📋 Recent Transactions</h2>
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
  const [assets] = useState([
    {
      id: 1,
      name: "Projector Sony",
      category: "Audio/Visual",
      owner: "Arts Club",
      quantity: 3,
      available: 2,
      condition: "excellent",
      lastMaintenance: "2024-03-15",
    },
    {
      id: 2,
      name: "Speaker System",
      category: "Audio",
      owner: "Music Club",
      quantity: 2,
      available: 1,
      condition: "good",
      lastMaintenance: "2024-03-10",
    },
    {
      id: 3,
      name: "Camera Bundle",
      category: "Photography",
      owner: "Photography Club",
      quantity: 4,
      available: 3,
      condition: "excellent",
      lastMaintenance: "2024-03-18",
    },
  ]);

  return (
    <div className="space-y-6">
      <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
        + Add New Asset
      </button>

      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Asset Name</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Owner Club</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Category</th>
                <th className="px-6 py-4 text-center text-gray-400 font-semibold">Available</th>
                <th className="px-6 py-4 text-center text-gray-400 font-semibold">Condition</th>
                <th className="px-6 py-4 text-center text-gray-400 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 text-white font-medium">{asset.name}</td>
                  <td className="px-6 py-4 text-gray-300">{asset.owner}</td>
                  <td className="px-6 py-4 text-gray-300">{asset.category}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-medium">
                      {asset.available}/{asset.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full font-medium capitalize">
                      {asset.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RequestsTab = () => {
  const [requests] = useState([
    {
      id: 1,
      club: "Drama Club",
      asset: "Projector Sony",
      status: "pending",
      requestDate: "2024-03-20",
      neededDate: "2024-03-25",
      returnDate: "2024-03-26",
    },
    {
      id: 2,
      club: "Event Management",
      asset: "Speaker System",
      status: "approved",
      requestDate: "2024-03-19",
      neededDate: "2024-03-22",
      returnDate: "2024-03-23",
    },
  ]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700">
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Club</th>
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Asset</th>
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Needed Date</th>
              <th className="px-6 py-4 text-center text-gray-400 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                <td className="px-6 py-4 text-white font-medium">{req.club}</td>
                <td className="px-6 py-4 text-gray-300">{req.asset}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      req.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">{req.neededDate}</td>
                <td className="px-6 py-4 text-center">
                  <button className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CheckoutTab = () => {
  const [checkedOut] = useState([
    {
      id: 1,
      asset: "Projector Sony",
      club: "Arts Club",
      checkedOutDate: "2024-03-18",
      dueDate: "2024-03-25",
      overdueBy: 0,
      status: "on-time",
    },
    {
      id: 2,
      asset: "Cameras (2)",
      club: "Photography Club",
      checkedOutDate: "2024-03-17",
      dueDate: "2024-03-22",
      overdueBy: 0,
      status: "warning",
    },
    {
      id: 3,
      asset: "Speaker System",
      club: "Music Club",
      checkedOutDate: "2024-03-15",
      dueDate: "2024-03-20",
      overdueBy: 1,
      status: "overdue",
    },
  ]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700">
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Asset</th>
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Checked By</th>
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Checked Out</th>
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Due Date</th>
              <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
              <th className="px-6 py-4 text-center text-gray-400 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {checkedOut.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                <td className="px-6 py-4 text-white font-medium">{item.asset}</td>
                <td className="px-6 py-4 text-gray-300">{item.club}</td>
                <td className="px-6 py-4 text-gray-300">{item.checkedOutDate}</td>
                <td className="px-6 py-4 text-gray-300">{item.dueDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      item.status === "on-time"
                        ? "bg-green-500/20 text-green-400"
                        : item.status === "warning"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {item.status === "overdue" && "🔴 "} {item.status.replace("-", " ").toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AnalyticsTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h3 className="text-lg font-bold text-white mb-6">📊 Asset Utilization</h3>
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
                <span className="text-white font-bold">{item.utilization}%</span>
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
            <p className="text-green-400 text-sm mt-3">↑ 23% increase from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
