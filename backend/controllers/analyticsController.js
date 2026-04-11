import prisma from "../prisma/client.js";

class AnalyticsController {
  /**
   * Get comprehensive user activity analytics
   */
  static async getUserActivity(req, res) {
    try {
      // Fetch logistics requests for activity metrics
      const requests = await prisma.logistics_Requests.findMany({
        include: {
          requestedBy: true,
          asset: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      });

      // Status metrics
      const statusMetrics = {
        pending: requests.filter((r) => r.status === "pending").length,
        checkedOut: requests.filter((r) => r.status === "checked_out").length,
        overdue: requests.filter((r) => r.status === "overdue").length,
        returned: requests.filter((r) => r.status === "returned").length,
      };

      // Recent activities (transform to activity format)
      const recentActivities = requests.slice(0, 12).map((req, idx) => ({
        id: req.id,
        user: req.requestedBy?.name || "Unknown User",
        club: req.requestedBy?.club || "Unknown Club",
        action:
          {
            pending: "Requested",
            checked_out: "Checked Out",
            returned: "Returned",
            overdue: "Overdue",
          }[req.status] || "Updated",
        asset: req.asset?.name || "Unknown Asset",
        time: time_ago(new Date(req.createdAt)),
        timestamp: getTimestampMinutesAgo(new Date(req.createdAt)),
        icon:
          {
            pending: "📝",
            checked_out: "🔄",
            returned: "✓",
            overdue: "⚠️",
          }[req.status] || "📋",
        status: req.status,
      }));

      // Fetch all users for engagement metrics
      const users = await prisma.user.findMany({
        select: { id: true, name: true, role: true, createdAt: true },
      });

      // Top active users (based on request count)
      const userActivityCounts = {};
      requests.forEach((req) => {
        const userId = req.requestedBy?.id;
        if (userId) {
          userActivityCounts[userId] = (userActivityCounts[userId] || 0) + 1;
        }
      });

      const topUsers = Object.entries(userActivityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([userId, count]) => {
          const user = requests.find(
            (r) => r.requestedBy?.id === userId,
          )?.requestedBy;
          return {
            name: user?.name || "Unknown",
            club: user?.club || "Unknown Club",
            actions: count,
            badge: count > 10 ? "🌟" : count > 7 ? "⭐" : "📊",
          };
        });

      // Activity trend (hourly - last 7 hours)
      const activityTrend = generateActivityTrend(requests);

      // Club activity
      const clubActivityData = {};
      requests.forEach((req) => {
        const club = req.requestedBy?.club || "Other";
        clubActivityData[club] = (clubActivityData[club] || 0) + 1;
      });

      const clubActivity = Object.entries(clubActivityData)
        .sort((a, b) => b[1] - a[1])
        .map(([club, count]) => ({
          club,
          requests: count,
          icon: getClubIcon(club),
          active: true,
        }));

      // Engagement metrics
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const requestsToday = requests.filter(
        (r) => new Date(r.createdAt) >= todayStart,
      ).length;

      const activeToday = [
        ...new Set(
          requests
            .filter((r) => new Date(r.createdAt) >= todayStart)
            .map((r) => r.requestedBy?.id),
        ),
      ].length;

      const engagement = {
        totalUsers: users.length,
        activeToday,
        requestsToday,
        averageRequestsPerUser:
          users.length > 0 ? (requests.length / users.length).toFixed(1) : 0,
        averageReturnRate:
          requests.length > 0
            ? (
                (requests.filter((r) => r.status === "returned").length /
                  requests.length) *
                100
              ).toFixed(1)
            : 0,
      };

      return res.json({
        success: true,
        data: {
          statusMetrics,
          recentActivities,
          topUsers,
          activityTrend,
          clubActivity: clubActivity.slice(0, 8),
          engagement,
        },
      });
    } catch (error) {
      console.error("Failed to fetch user activity analytics:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch analytics",
        error: error.message,
      });
    }
  }
}

/**
 * Helper: Calculate time ago string
 */
function time_ago(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

/**
 * Helper: Get timestamp in minutes ago
 */
function getTimestampMinutesAgo(date) {
  return Math.floor((new Date() - new Date(date)) / 60000);
}

/**
 * Helper: Generate activity trend data
 */
function generateActivityTrend(requests) {
  const hours = [];
  for (let i = 6; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hour.setMinutes(0, 0, 0);

    const nextHour = new Date(hour);
    nextHour.setHours(nextHour.getHours() + 1);

    const hourRequests = requests.filter(
      (r) => new Date(r.createdAt) >= hour && new Date(r.createdAt) < nextHour,
    );

    hours.push({
      hour: hour.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      pending: hourRequests.filter((r) => r.status === "pending").length,
      checkedOut: hourRequests.filter((r) => r.status === "checked_out").length,
      overdue: hourRequests.filter((r) => r.status === "overdue").length,
      returned: hourRequests.filter((r) => r.status === "returned").length,
    });
  }

  return hours;
}

/**
 * Helper: Get club icon emoji
 */
function getClubIcon(clubName) {
  const icons = {
    tech: "💻",
    sports: "⚽",
    photography: "📸",
    science: "🔬",
    arts: "🎨",
    music: "🎵",
    robotics: "🤖",
    debate: "🗣️",
  };

  for (const [key, icon] of Object.entries(icons)) {
    if (clubName.toLowerCase().includes(key)) return icon;
  }

  return "📊";
}

export default AnalyticsController;
