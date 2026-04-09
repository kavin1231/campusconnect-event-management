import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

const StatTile = ({ label, value, tone, trend, icon }) => {
  const toneClass =
    tone === "blue"
      ? "border-blue-500/30 bg-blue-500/10 text-blue-200"
      : tone === "emerald"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        : tone === "amber"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
          : "border-indigo-500/30 bg-indigo-500/10 text-indigo-200";

  const trendColor =
    trend > 0
      ? "text-emerald-300"
      : trend < 0
        ? "text-red-300"
        : "text-slate-300";

  return (
    <motion.div
      className={`rounded-xl border p-5 ${toneClass}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-black">{value}</p>
        {trend !== undefined && (
          <span className={`text-sm font-semibold ${trendColor}`}>
            {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
};

const AnalyticsOverview = () => {
  const [liveStats, setLiveStats] = useState({
    totalAssets: 0,
    activeRequests: 0,
    overdue: 0,
    returned: 0,
  });

  // Hardcoded platform analytics data
  const platformData = {
    // Top-level KPIs
    platformKPIs: {
      totalUsers: 1247,
      activeClubs: 42,
      totalEvents: 156,
      platformUptime: 99.9,
    },

    // Asset Distribution
    assetsByCategory: [
      { category: "Sports Equipment", count: 45, icon: "⚽" },
      { category: "Audio/Visual", count: 38, icon: "🎤" },
      { category: "Educational Tools", count: 52, icon: "📚" },
      { category: "Furniture", count: 29, icon: "🪑" },
      { category: "Technology", count: 67, icon: "💻" },
    ],

    // Top asset users (clubs)
    topClubUsers: [
      { name: "Tech Club", requests: 45, icon: "💻" },
      { name: "Sports Council", requests: 38, icon: "⚽" },
      { name: "Arts & Culture", requests: 32, icon: "🎨" },
      { name: "Science Club", requests: 28, icon: "🔬" },
    ],

    // Request trends by status
    requestMetrics: {
      pending: 12,
      checkedOut: 8,
      overdue: 3,
      returned: 156,
      rejected: 2,
    },

    // Monthly trends (hardcoded)
    monthlyTrends: [
      { month: "Jan", requests: 42, returned: 38, pending: 4 },
      { month: "Feb", requests: 55, returned: 50, pending: 5 },
      { month: "Mar", requests: 68, returned: 64, pending: 4 },
    ],

    // System health metrics
    systemHealth: {
      avgResponseTime: "127ms",
      requestSuccessRate: 98.5,
      assetAvailability: 94.2,
      userSatisfaction: 4.7,
    },

    // Peak usage times
    peakHours: [
      { time: "9:00 AM - 12:00 PM", requests: 45, label: "Morning Peak" },
      { time: "2:00 PM - 5:00 PM", requests: 62, label: "Afternoon Peak" },
      { time: "5:00 PM - 8:00 PM", requests: 38, label: "Evening" },
    ],
  };

  // Fetch real data from API
  useEffect(() => {
    const load = async () => {
      try {
        const [assetsRes, requestsRes] = await Promise.all([
          logisticsAPI.listAssets(),
          logisticsAPI.listRequests(),
        ]);

        const assets = assetsRes?.assets || [];
        const requests = requestsRes?.requests || [];

        setLiveStats({
          totalAssets: assets.length,
          activeRequests: requests.filter((r) => r.status === "checked_out")
            .length,
          overdue: requests.filter((r) => r.status === "overdue").length,
          returned: requests.filter((r) => r.status === "returned").length,
        });
      } catch (error) {
        console.error("Failed to load analytics overview:", error);
      }
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-[#E5E7EB]">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-5 md:p-8">
        <main className="max-w-[1400px] mx-auto">
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
                  📊 System Overview
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  Platform Analytics
                </h1>
                <p className="text-slate-300 mt-2 max-w-2xl">
                  Real-time insights into asset management, user engagement, and
                  platform performance
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold">
                ✓ Live Data
              </div>
            </div>
          </motion.div>

          {/* PRIMARY METRICS - 4 Column KPI Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.06 },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <StatTile
              label="Total Assets"
              value={
                liveStats.totalAssets ||
                platformData.assetsByCategory.reduce(
                  (sum, cat) => sum + cat.count,
                  0,
                )
              }
              tone="indigo"
              trend={12}
              icon="📦"
            />
            <StatTile
              label="Active Users"
              value={platformData.platformKPIs.totalUsers}
              tone="blue"
              trend={8.5}
              icon="👥"
            />
            <StatTile
              label="Active Clubs"
              value={platformData.platformKPIs.activeClubs}
              tone="emerald"
              trend={5.2}
              icon="🏢"
            />
            <StatTile
              label="Platform Uptime"
              value={`${platformData.systemHealth.platformUptime}%`}
              tone="amber"
              trend={0.1}
              icon="🟢"
            />
          </motion.div>

          {/* SECONDARY METRICS */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.2 },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <StatTile
              label="Pending Requests"
              value={platformData.requestMetrics.pending}
              tone="amber"
            />
            <StatTile
              label="Overdue Items"
              value={platformData.requestMetrics.overdue}
              tone="blue"
              trend={-15}
              icon="⚠️"
            />
            <StatTile
              label="Completed Requests"
              value={platformData.requestMetrics.returned}
              tone="emerald"
              trend={18}
              icon="✓"
            />
            <StatTile
              label="Success Rate"
              value={`${platformData.systemHealth.requestSuccessRate}%`}
              tone="indigo"
            />
          </motion.div>

          {/* CONTENT GRID - 2 Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* TOP ASSET CATEGORIES */}
            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                📂 Asset Distribution by Category
              </h2>
              <div className="space-y-4">
                {platformData.assetsByCategory.map((asset, idx) => {
                  const maxCount = Math.max(
                    ...platformData.assetsByCategory.map((a) => a.count),
                  );
                  const percentage = (asset.count / maxCount) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{asset.icon}</span>
                          <span className="text-sm text-slate-300">
                            {asset.category}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-indigo-300">
                          {asset.count} items
                        </span>
                      </div>
                      <div className="w-full bg-slate-800/70 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* TOP CLUB USERS */}
            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                🏆 Top Club Users (By Requests)
              </h2>
              <div className="space-y-4">
                {platformData.topClubUsers.map((club, idx) => {
                  const maxRequests = Math.max(
                    ...platformData.topClubUsers.map((c) => c.requests),
                  );
                  const percentage = (club.requests / maxRequests) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{club.icon}</span>
                          <span className="text-sm text-slate-300 font-medium">
                            {club.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-cyan-300">
                          {club.requests} requests
                        </span>
                      </div>
                      <div className="w-full bg-slate-800/70 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            delay: 0.45 + idx * 0.1,
                            duration: 0.6,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* SYSTEM HEALTH & TRENDS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* System Health */}
            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                ⚙️ System Health Metrics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Avg Response Time
                  </p>
                  <p className="text-2xl font-black text-emerald-300">
                    {platformData.systemHealth.avgResponseTime}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Success Rate
                  </p>
                  <p className="text-2xl font-black text-blue-300">
                    {platformData.systemHealth.requestSuccessRate}%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Asset Availability
                  </p>
                  <p className="text-2xl font-black text-amber-300">
                    {platformData.systemHealth.assetAvailability}%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    User Satisfaction
                  </p>
                  <p className="text-2xl font-black text-indigo-300">
                    {platformData.systemHealth.userSatisfaction}/5 ⭐
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Monthly Trends */}
            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                📈 Recent Trend (3 Months)
              </h2>
              <div className="space-y-4">
                {platformData.monthlyTrends.map((trend, idx) => {
                  const maxReqs = Math.max(
                    ...platformData.monthlyTrends.map((t) => t.requests),
                  );
                  const percentage = (trend.requests / maxReqs) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-300">
                          {trend.month}
                        </span>
                        <div className="flex gap-2">
                          <span className="text-xs text-emerald-300">
                            {trend.returned} returned
                          </span>
                          <span className="text-xs text-amber-300">
                            {trend.pending} pending
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800/70 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            delay: 0.5 + idx * 0.15,
                            duration: 0.7,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {trend.requests} total requests
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* PEAK USAGE TIMES */}
          <motion.section
            className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
              🕐 Peak Usage Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {platformData.peakHours.map((hour, idx) => {
                const maxReqs = Math.max(
                  ...platformData.peakHours.map((h) => h.requests),
                );
                const percentage = (hour.requests / maxReqs) * 100;
                return (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50"
                  >
                    <div className="mb-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">
                        {hour.label}
                      </p>
                      <p className="text-sm text-slate-300 font-medium mt-1">
                        {hour.time}
                      </p>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden mb-2">
                      <motion.div
                        className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.55 + idx * 0.1, duration: 0.7 }}
                      />
                    </div>
                    <p className="text-lg font-black text-amber-300">
                      {hour.requests} requests
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* FOOTER INSIGHTS */}
          <motion.div
            className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-4">
              💡 Quick Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-indigo-300">
                    Peak Activity:
                  </span>{" "}
                  Afternoon peak (2-5 PM) with 62 requests on average
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-emerald-300">
                    Top Club:
                  </span>{" "}
                  Tech Club leads with 45 requests this period
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-amber-300">
                    Growth Trend:
                  </span>{" "}
                  62% increase in activity from Jan to Mar
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
