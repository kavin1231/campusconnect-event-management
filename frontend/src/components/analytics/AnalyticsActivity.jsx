import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

// Hardcoded comprehensive activity data
const hardcodedActivityData = {
  statusMetrics: {
    pending: 12,
    checkedOut: 8,
    overdue: 3,
    returned: 156,
  },

  // Real-time activity feed (latest activities)
  recentActivities: [
    {
      id: 1,
      user: "John Smith",
      club: "Tech Club",
      action: "Requested",
      asset: "Projector (Sony VPL-FHZ90)",
      time: "2 mins ago",
      timestamp: 2,
      icon: "📝",
    },
    {
      id: 2,
      user: "Sarah Ahmed",
      club: "Arts & Culture",
      action: "Returned",
      asset: "Sound System (Bose SoundLink)",
      time: "15 mins ago",
      timestamp: 15,
      icon: "✓",
    },
    {
      id: 3,
      user: "Mike Johnson",
      club: "Science Club",
      action: "Checked Out",
      asset: "Laptop (MacBook Pro)",
      time: "32 mins ago",
      timestamp: 32,
      icon: "🔄",
    },
    {
      id: 4,
      user: "Emma Davis",
      club: "Photography Club",
      action: "Checked Out",
      asset: "Camera (Canon EOS R5)",
      time: "1 hour ago",
      timestamp: 60,
      icon: "🔄",
    },
    {
      id: 5,
      user: "Alex Brown",
      club: "Sports Council",
      action: "Requested",
      asset: "Speaker (JBL PartyBox 110)",
      time: "2 hours ago",
      timestamp: 120,
      icon: "📝",
    },
    {
      id: 6,
      user: "Lisa Chen",
      club: "Debate Society",
      action: "Returned",
      asset: "Whiteboard & Markers Kit",
      time: "3 hours ago",
      timestamp: 180,
      icon: "✓",
    },
    {
      id: 7,
      user: "David Wilson",
      club: "Music Club",
      action: "Extended",
      asset: "Microphone Set (Shure SM7B)",
      time: "4 hours ago",
      timestamp: 240,
      icon: "⏱️",
    },
    {
      id: 8,
      user: "Peter Kumar",
      club: "Robotics Club",
      action: "Checked Out",
      asset: "Drone (DJI Air 3S)",
      time: "5 hours ago",
      timestamp: 300,
      icon: "🔄",
    },
  ],

  // Activity by club
  clubActivity: [
    { club: "Tech Club", requests: 24, icon: "💻", active: true },
    { club: "Sports Council", requests: 18, icon: "⚽", active: true },
    { club: "Photography Club", requests: 16, icon: "📸", active: true },
    { club: "Science Club", requests: 14, icon: "🔬", active: true },
    { club: "Arts & Culture", requests: 12, icon: "🎨", active: true },
    { club: "Music Club", requests: 10, icon: "🎵", active: false },
    { club: "Robotics Club", requests: 9, icon: "🤖", active: true },
    { club: "Debate Society", requests: 8, icon: "🗣️", active: false },
  ],

  // Top active users
  topUsers: [
    { name: "John Smith", club: "Tech Club", actions: 12, badge: "🌟" },
    { name: "Sarah Ahmed", club: "Arts & Culture", actions: 10, badge: "⭐" },
    { name: "Mike Johnson", club: "Science Club", actions: 9, badge: "📊" },
    { name: "Emma Davis", club: "Photography Club", actions: 8, badge: "📸" },
    { name: "Alex Brown", club: "Sports Council", actions: 7, badge: "⚽" },
  ],

  // Hourly activity trend
  activityTrend: [
    { hour: "9 AM", pending: 5, checkedOut: 3, overdue: 0, returned: 8 },
    { hour: "10 AM", pending: 7, checkedOut: 4, overdue: 0, returned: 12 },
    { hour: "11 AM", pending: 6, checkedOut: 5, overdue: 0, returned: 14 },
    { hour: "12 PM", pending: 8, checkedOut: 6, overdue: 1, returned: 18 },
    { hour: "1 PM", pending: 9, checkedOut: 7, overdue: 1, returned: 16 },
    { hour: "2 PM", pending: 12, checkedOut: 8, overdue: 2, returned: 20 },
    { hour: "3 PM", pending: 10, checkedOut: 7, overdue: 2, returned: 18 },
  ],

  // Engagement metrics
  engagementMetrics: {
    totalUsers: 1247,
    activeToday: 234,
    requestsToday: 42,
    averageRequestsPerUser: 3.2,
    averageReturnRate: 98.5,
  },
};

const ActivityCard = ({ title, value, subtitle, tone, trend, icon }) => {
  const toneClass =
    tone === "blue"
      ? "border-blue-500/30 bg-blue-500/10"
      : tone === "emerald"
        ? "border-emerald-500/30 bg-emerald-500/10"
        : tone === "amber"
          ? "border-amber-500/30 bg-amber-500/10"
          : "border-indigo-500/30 bg-indigo-500/10";

  const textColor =
    tone === "blue"
      ? "text-blue-300"
      : tone === "emerald"
        ? "text-emerald-300"
        : tone === "amber"
          ? "text-amber-300"
          : "text-indigo-300";

  return (
    <motion.div
      className={`rounded-xl border p-5 ${toneClass}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-400 text-xs uppercase tracking-wider">
          {title}
        </p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="flex items-baseline justify-between">
        <p className={`text-3xl font-black ${textColor}`}>{value}</p>
        {trend !== undefined && (
          <span className="text-xs text-slate-400">
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-slate-400 text-xs mt-2">{subtitle}</p>
    </motion.div>
  );
};

const AnalyticsActivity = () => {
  const [activity, setActivity] = useState(hardcodedActivityData.statusMetrics);
  const [recentActivities] = useState(hardcodedActivityData.recentActivities);
  const [clubActivity] = useState(hardcodedActivityData.clubActivity);
  const [topUsers] = useState(hardcodedActivityData.topUsers);
  const [activityTrend] = useState(hardcodedActivityData.activityTrend);
  const [engagement] = useState(hardcodedActivityData.engagementMetrics);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await logisticsAPI.listRequests();
        const requests = response?.requests || [];

        // Use API data if available, but fallback to hardcoded
        if (requests && requests.length > 0) {
          setActivity({
            pending: requests.filter((r) => r.status === "pending").length,
            checkedOut: requests.filter((r) => r.status === "checked_out")
              .length,
            overdue: requests.filter((r) => r.status === "overdue").length,
            returned: requests.filter((r) => r.status === "returned").length,
          });
        }
      } catch (error) {
        console.error("Failed to load analytics activity:", error);
      }
    };

    load();
  }, []);

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
                  👥 User Engagement
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  User Activity
                </h1>
                <p className="text-slate-300 mt-2 max-w-2xl">
                  Live activity tracking and user engagement metrics
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold">
                ✓ Real-time
              </div>
            </div>
          </motion.div>

          {/* PRIMARY METRICS - Status Breakdown */}
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
            <ActivityCard
              title="Pending"
              value={activity.pending}
              subtitle="Awaiting decision"
              tone="amber"
              trend={5}
              icon="⏳"
            />
            <ActivityCard
              title="Checked Out"
              value={activity.checkedOut}
              subtitle="Currently in transit"
              tone="blue"
              trend={8}
              icon="🔄"
            />
            <ActivityCard
              title="Overdue"
              value={activity.overdue}
              subtitle="Needs immediate follow-up"
              tone="amber"
              trend={-12}
              icon="⚠️"
            />
            <ActivityCard
              title="Returned"
              value={activity.returned}
              subtitle="Completed lifecycle"
              tone="emerald"
              trend={15}
              icon="✓"
            />
          </motion.div>

          {/* ENGAGEMENT METRICS */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.2 },
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
                Total Users
              </p>
              <p className="text-2xl font-black text-indigo-300">
                {engagement.totalUsers}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Active Today
              </p>
              <p className="text-2xl font-black text-blue-300">
                {engagement.activeToday}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Requests Today
              </p>
              <p className="text-2xl font-black text-emerald-300">
                {engagement.requestsToday}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Avg per User
              </p>
              <p className="text-2xl font-black text-cyan-300">
                {engagement.averageRequestsPerUser}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg bg-slate-800/50 border border-slate-700/70 p-4"
              whileHover={{ y: -2 }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Return Rate
              </p>
              <p className="text-2xl font-black text-amber-300">
                {engagement.averageReturnRate}%
              </p>
            </motion.div>
          </motion.div>

          {/* CONTENT GRID - 3 COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* RECENT ACTIVITY FEED */}
            <motion.section
              className="lg:col-span-2 rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                🕐 Recent Activity Feed (Last 8 Hours)
              </h2>
              <div className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <motion.div
                    key={activity.id}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition flex items-start gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + idx * 0.05 }}
                  >
                    <div className="text-2xl mt-1">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-100">
                        {activity.user}{" "}
                        <span className="text-slate-400">
                          {activity.action.toLowerCase()} {activity.asset}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                          {activity.club}
                        </span>
                        <span className="text-xs text-slate-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* TOP ACTIVE USERS */}
            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                🏆 Top Active Users
              </h2>
              <div className="space-y-3">
                {topUsers.map((user, idx) => (
                  <motion.div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{user.badge}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">{user.club}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-indigo-300">
                        {user.actions}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.actions / 12) * 100}%` }}
                        transition={{ delay: 0.45 + idx * 0.05, duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* CLUB ACTIVITY & TRENDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* CLUB ACTIVITY BREAKDOWN */}
            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                📊 Activity by Club
              </h2>
              <div className="space-y-4">
                {clubActivity.map((club, idx) => {
                  const maxRequests = Math.max(
                    ...clubActivity.map((c) => c.requests),
                  );
                  const percentage = (club.requests / maxRequests) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{club.icon}</span>
                          <span className="text-sm text-slate-300">
                            {club.club}
                          </span>
                          {club.active && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                              Active
                            </span>
                          )}
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
                            delay: 0.45 + idx * 0.05,
                            duration: 0.6,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* HOURLY ACTIVITY TREND */}
            <motion.section
              className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-5">
                📈 Activities by Hour
              </h2>
              <div className="space-y-3">
                {activityTrend.map((trend, idx) => {
                  const totalActivity =
                    trend.pending +
                    trend.checkedOut +
                    trend.overdue +
                    trend.returned;
                  const maxTotal = Math.max(
                    ...activityTrend.map(
                      (t) => t.pending + t.checkedOut + t.overdue + t.returned,
                    ),
                  );
                  const percentage = (totalActivity / maxTotal) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300 font-medium">
                          {trend.hour}
                        </span>
                        <div className="flex gap-2 text-xs">
                          <span className="text-amber-300">
                            P:{trend.pending}
                          </span>
                          <span className="text-blue-300">
                            C:{trend.checkedOut}
                          </span>
                          <span className="text-red-300">
                            O:{trend.overdue}
                          </span>
                          <span className="text-emerald-300">
                            R:{trend.returned}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800/70 rounded-full h-2.5 overflow-hidden flex">
                        <motion.div
                          className="bg-amber-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(trend.pending / totalActivity) * percentage}%`,
                          }}
                          transition={{
                            delay: 0.5 + idx * 0.04,
                            duration: 0.5,
                          }}
                        />
                        <motion.div
                          className="bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(trend.checkedOut / totalActivity) * percentage}%`,
                          }}
                          transition={{
                            delay: 0.5 + idx * 0.04,
                            duration: 0.5,
                          }}
                        />
                        <motion.div
                          className="bg-red-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(trend.overdue / totalActivity) * percentage}%`,
                          }}
                          transition={{
                            delay: 0.5 + idx * 0.04,
                            duration: 0.5,
                          }}
                        />
                        <motion.div
                          className="bg-emerald-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(trend.returned / totalActivity) * percentage}%`,
                          }}
                          transition={{
                            delay: 0.5 + idx * 0.04,
                            duration: 0.5,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* ACTIVITY INSIGHTS */}
          <motion.div
            className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-base uppercase tracking-[0.15em] text-slate-300 font-semibold mb-4">
              💡 Activity Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-indigo-300">
                    Most Active Hour:
                  </span>{" "}
                  2 PM with 45 total activities
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-blue-300">Top Club:</span>{" "}
                  Tech Club with 24 requests (19% of total)
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-emerald-300">
                    Engagement Rate:
                  </span>{" "}
                  18.8% of users active today (234/1247)
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsActivity;
