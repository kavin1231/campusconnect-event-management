import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../common/Sidebar";
import { analyticsAPI, governanceAPI, logisticsAPI } from "../../services/api";

const REFRESH_INTERVAL_MS = 15000;

const toneStyles = {
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200",
};

const toLower = (value) => String(value || "").toLowerCase();

const monthKey = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabel = (key) => {
  if (!key) return "N/A";
  const [year, month] = key.split("-").map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString(undefined, { month: "short" });
};

const toDateValue = (request) => {
  return (
    request?.createdAt ||
    request?.requestDate ||
    request?.neededDate ||
    request?.startDate ||
    null
  );
};

const isPlaceholderClub = (club) => {
  const normalizedClub = toLower(club);
  return !normalizedClub || normalizedClub === "unknown club";
};

const formatClubSuffix = (club) => {
  if (isPlaceholderClub(club)) return "";
  return ` (${club})`;
};

const StatTile = ({ label, value, tone, trend, icon }) => {
  const toneClass = toneStyles[tone] || toneStyles.indigo;

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
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-3xl font-black">{value}</p>
        {trend !== undefined && (
          <span
            className={`text-sm font-semibold whitespace-nowrap ${trendColor}`}
          >
            {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"}{" "}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  );
};

const AnalyticsOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [responseMs, setResponseMs] = useState(0);
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const loadData = async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    setError("");

    const startedAt = performance.now();

    try {
      const [assetsRes, requestsRes, eventsRes, analyticsRes] =
        await Promise.all([
          logisticsAPI.listAssets(),
          logisticsAPI.listRequests(),
          governanceAPI.getEventApprovals(),
          analyticsAPI.getUserActivity(),
        ]);

      setAssets(assetsRes?.assets || []);
      setRequests(requestsRes?.requests || []);
      setEvents(eventsRes?.events || []);
      setAnalytics(analyticsRes?.data || null);
      setResponseMs(Math.max(0, Math.round(performance.now() - startedAt)));
      setLastUpdated(new Date());
    } catch (fetchError) {
      console.error("Failed to load analytics overview:", fetchError);
      setError("Unable to load full platform analytics right now.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData({ silent: false });

    const intervalId = setInterval(() => {
      loadData({ silent: true });
    }, REFRESH_INTERVAL_MS);

    const onFocus = () => loadData({ silent: true });
    const onVisibility = () => {
      if (!document.hidden) {
        loadData({ silent: true });
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const requestMetrics = useMemo(() => {
    const metrics = {
      pending: 0,
      checkedOut: 0,
      overdue: 0,
      returned: 0,
      rejected: 0,
      approved: 0,
    };

    requests.forEach((request) => {
      const status = toLower(request.status);
      if (status === "pending") metrics.pending += 1;
      else if (status === "checked_out") metrics.checkedOut += 1;
      else if (status === "overdue") metrics.overdue += 1;
      else if (status === "returned") metrics.returned += 1;
      else if (status === "rejected") metrics.rejected += 1;
      else if (status === "approved") metrics.approved += 1;
    });

    return metrics;
  }, [requests]);

  const assetsByCategory = useMemo(() => {
    const grouped = {};
    assets.forEach((asset) => {
      const key =
        String(asset.category || "Uncategorized").trim() || "Uncategorized";
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [assets]);

  const topClubUsers = useMemo(() => {
    const grouped = {};
    requests.forEach((request) => {
      const club = String(request.club || "").trim();
      if (isPlaceholderClub(club)) return;
      grouped[club] = (grouped[club] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, requestsCount]) => ({ name, requests: requestsCount }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);
  }, [requests]);

  const monthlyTrends = useMemo(() => {
    const monthlyMap = {};
    requests.forEach((request) => {
      const key = monthKey(toDateValue(request));
      if (!key) return;

      if (!monthlyMap[key]) {
        monthlyMap[key] = { requests: 0, returned: 0, pending: 0 };
      }

      monthlyMap[key].requests += 1;
      const status = toLower(request.status);
      if (status === "returned") monthlyMap[key].returned += 1;
      if (status === "pending") monthlyMap[key].pending += 1;
    });

    return Object.keys(monthlyMap)
      .sort()
      .slice(-6)
      .map((key) => ({
        month: monthLabel(key),
        requests: monthlyMap[key].requests,
        returned: monthlyMap[key].returned,
        pending: monthlyMap[key].pending,
      }));
  }, [requests]);

  const peakHours = useMemo(() => {
    const bins = {
      "Morning (06-12)": 0,
      "Afternoon (12-18)": 0,
      "Evening (18-24)": 0,
      "Night (00-06)": 0,
    };

    requests.forEach((request) => {
      const date = new Date(toDateValue(request));
      if (Number.isNaN(date.getTime())) return;
      const hour = date.getHours();

      if (hour >= 6 && hour < 12) bins["Morning (06-12)"] += 1;
      else if (hour >= 12 && hour < 18) bins["Afternoon (12-18)"] += 1;
      else if (hour >= 18 && hour < 24) bins["Evening (18-24)"] += 1;
      else bins["Night (00-06)"] += 1;
    });

    return Object.entries(bins)
      .map(([label, requestsCount]) => ({ label, requests: requestsCount }))
      .sort((a, b) => b.requests - a.requests);
  }, [requests]);

  const recentActivities = useMemo(
    () => analytics?.recentActivities?.slice(0, 8) || [],
    [analytics],
  );

  const totalQuantity = useMemo(
    () => assets.reduce((sum, asset) => sum + Number(asset.quantity || 0), 0),
    [assets],
  );

  const availableQuantity = useMemo(
    () =>
      assets.reduce(
        (sum, asset) =>
          sum + Number(asset.availableQty || asset.available || 0),
        0,
      ),
    [assets],
  );

  const assetAvailabilityRate =
    totalQuantity > 0 ? (availableQuantity / totalQuantity) * 100 : 0;

  const successRate =
    requests.length > 0 ? (requestMetrics.returned / requests.length) * 100 : 0;

  const activeClubs = useMemo(() => {
    const clubs = new Set();
    topClubUsers.forEach((club) => clubs.add(club.name));
    (analytics?.clubActivity || []).forEach((club) => clubs.add(club.club));
    return clubs.size;
  }, [topClubUsers, analytics]);

  const totalUsers = Number(analytics?.engagement?.totalUsers || 0);
  const activeUsersToday = Number(analytics?.engagement?.activeToday || 0);

  const growthText = useMemo(() => {
    if (monthlyTrends.length < 2) return "Not enough monthly history yet";
    const first = monthlyTrends[0].requests;
    const last = monthlyTrends[monthlyTrends.length - 1].requests;
    if (first === 0) return `${last} requests in the latest month`;
    const delta = ((last - first) / first) * 100;
    return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% from ${monthlyTrends[0].month} to ${monthlyTrends[monthlyTrends.length - 1].month}`;
  }, [monthlyTrends]);

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-[#E5E7EB]">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-5 md:p-8">
        <main className="max-w-[1400px] mx-auto">
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
                  Live operational intelligence across assets, requests, users,
                  and governance activities
                </p>
                {lastUpdated && (
                  <p className="text-xs text-slate-400 mt-2">
                    Last updated {lastUpdated.toLocaleTimeString()} (
                    {responseMs}ms)
                  </p>
                )}
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold">
                {loading ? "Syncing..." : "✓ Live Data"}
              </div>
            </div>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
            initial="hidden"
            animate="show"
          >
            <StatTile
              label="Total Assets"
              value={assets.length}
              tone="indigo"
              icon="📦"
            />
            <StatTile
              label="Active Users"
              value={activeUsersToday}
              tone="blue"
              icon="👥"
            />
            <StatTile
              label="Active Clubs"
              value={activeClubs}
              tone="emerald"
              icon="🏢"
            />
            <StatTile
              label="Total Events"
              value={events.length}
              tone="amber"
              icon="🎉"
            />
          </motion.div>

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
              value={requestMetrics.pending}
              tone="amber"
            />
            <StatTile
              label="Overdue Items"
              value={requestMetrics.overdue}
              tone="blue"
              icon="⚠️"
            />
            <StatTile
              label="Completed Requests"
              value={requestMetrics.returned}
              tone="emerald"
              icon="✓"
            />
            <StatTile
              label="Success Rate"
              value={`${successRate.toFixed(1)}%`}
              tone="indigo"
            />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
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
                {assetsByCategory.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No category data available.
                  </p>
                )}
                {assetsByCategory.map((asset, idx) => {
                  const maxCount = Math.max(
                    ...assetsByCategory.map((a) => a.count),
                    1,
                  );
                  const percentage = (asset.count / maxCount) * 100;
                  return (
                    <div key={asset.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">
                          {asset.category}
                        </span>
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
                {topClubUsers.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No club activity available.
                  </p>
                )}
                {topClubUsers.map((club, idx) => {
                  const maxRequests = Math.max(
                    ...topClubUsers.map((c) => c.requests),
                    1,
                  );
                  const percentage = (club.requests / maxRequests) * 100;
                  return (
                    <div key={club.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300 font-medium">
                          {club.name}
                        </span>
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
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
                    {responseMs}ms
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Success Rate
                  </p>
                  <p className="text-2xl font-black text-blue-300">
                    {successRate.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Asset Availability
                  </p>
                  <p className="text-2xl font-black text-amber-300">
                    {assetAvailabilityRate.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Engagement Score
                  </p>
                  <p className="text-2xl font-black text-indigo-300">
                    {totalUsers > 0
                      ? `${((activeUsersToday / totalUsers) * 5).toFixed(1)}/5`
                      : "0.0/5"}{" "}
                    ⭐
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                📈 Recent Trend (Last 6 Months)
              </h2>
              <div className="space-y-4">
                {monthlyTrends.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No monthly trend data available.
                  </p>
                )}
                {monthlyTrends.map((trend, idx) => {
                  const maxReqs = Math.max(
                    ...monthlyTrends.map((t) => t.requests),
                    1,
                  );
                  const percentage = (trend.requests / maxReqs) * 100;
                  return (
                    <div key={trend.month}>
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
              {peakHours.slice(0, 3).map((hour, idx) => {
                const maxReqs = Math.max(
                  ...peakHours.map((h) => h.requests),
                  1,
                );
                const percentage = (hour.requests / maxReqs) * 100;
                return (
                  <div
                    key={hour.label}
                    className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50"
                  >
                    <div className="mb-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">
                        Peak Slot #{idx + 1}
                      </p>
                      <p className="text-sm text-slate-300 font-medium mt-1">
                        {hour.label}
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
                  {peakHours[0]
                    ? `${peakHours[0].label} with ${peakHours[0].requests} requests`
                    : "No activity yet"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-emerald-300">
                    Top Club:
                  </span>{" "}
                  {topClubUsers[0]
                    ? `${topClubUsers[0].name} leads with ${topClubUsers[0].requests} requests`
                    : "No club activity yet"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-amber-300">
                    Growth Trend:
                  </span>{" "}
                  {growthText}
                </p>
              </div>
            </div>
          </motion.div>

          {recentActivities.length > 0 && (
            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                🧭 Recent Platform Activity
              </h2>
              <div className="space-y-3">
                {recentActivities.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm text-white font-semibold">
                        {item.action} • {item.asset}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.user}
                        {formatClubSuffix(item.club)}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">{item.time}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
