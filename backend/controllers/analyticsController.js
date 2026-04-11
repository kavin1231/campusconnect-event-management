import prisma from "../prisma/client.js";

class AnalyticsController {
  /**
   * Get comprehensive user activity analytics
   */
  static async getUserActivity(req, res) {
    try {
      // Fetch asset bookings for activity metrics
      const bookings = await prisma.assetBooking.findMany({
        include: {
          requester: true,
          asset: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      });

      // Status metrics
      const statusMetrics = {
        pending: bookings.filter((b) => b.status === "pending").length,
        checkedOut: bookings.filter((b) => b.status === "checked_out").length,
        overdue: bookings.filter((b) => b.status === "overdue").length,
        returned: bookings.filter((b) => b.status === "returned").length,
      };

      // Recent activities (transform to activity format)
      const recentActivities = bookings.slice(0, 12).map((booking, idx) => ({
        id: booking.id,
        user: booking.requester?.name || "Unknown User",
        club: booking.requestingClub?.name || "Unknown Club",
        action:
          {
            pending: "Requested",
            checked_out: "Checked Out",
            returned: "Returned",
            overdue: "Overdue",
          }[booking.status] || "Updated",
        asset: booking.asset?.name || "Unknown Asset",
        time: time_ago(new Date(booking.createdAt)),
        timestamp: getTimestampMinutesAgo(new Date(booking.createdAt)),
        icon:
          {
            pending: "📝",
            checked_out: "🔄",
            returned: "✓",
            overdue: "⚠️",
          }[booking.status] || "📋",
        status: booking.status,
      }));

      // Fetch all users for engagement metrics
      const users = await prisma.user.findMany({
        select: { id: true, name: true, role: true, createdAt: true },
      });

      // Top active users (based on booking count)
      const userActivityCounts = {};
      bookings.forEach((booking) => {
        const userId = booking.requester?.id;
        if (userId) {
          userActivityCounts[userId] = (userActivityCounts[userId] || 0) + 1;
        }
      });

      const topUsers = Object.entries(userActivityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([userId, count]) => {
          const user = bookings.find(
            (b) => b.requester?.id === userId,
          )?.requester;
          return {
            name: user?.name || "Unknown",
            club: user?.role || "Unknown Club",
            actions: count,
            badge: count > 10 ? "🌟" : count > 7 ? "⭐" : "📊",
          };
        });

      // Activity trend (hourly - last 7 hours)
      const activityTrend = generateActivityTrend(bookings);

      // Club activity
      const clubActivityData = {};
      bookings.forEach((booking) => {
        const club = booking.requestingClub?.name || "Other";
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

      const bookingsToday = bookings.filter(
        (b) => new Date(b.createdAt) >= todayStart,
      ).length;

      const activeToday = [
        ...new Set(
          bookings
            .filter((b) => new Date(b.createdAt) >= todayStart)
            .map((b) => b.requester?.id)
        ),
      ].length;

      const engagement = {
        totalUsers: users.length,
        activeToday,
        requestsToday: bookingsToday,
        averageRequestsPerUser:
          users.length > 0 ? (bookings.length / users.length).toFixed(1) : 0,
        averageReturnRate:
          bookings.length > 0
            ? (
                (bookings.filter((b) => b.status === "returned").length /
                  bookings.length) *
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
function generateActivityTrend(bookings) {
  const hours = [];
  for (let i = 6; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hour.setMinutes(0, 0, 0);

    const nextHour = new Date(hour);
    nextHour.setHours(nextHour.getHours() + 1);

    const hourBookings = bookings.filter(
      (b) => new Date(b.createdAt) >= hour && new Date(b.createdAt) < nextHour,
    );

    hours.push({
      hour: hour.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      pending: hourBookings.filter((b) => b.status === "pending").length,
      checkedOut: hourBookings.filter((b) => b.status === "checked_out").length,
      overdue: hourBookings.filter((b) => b.status === "overdue").length,
      returned: hourBookings.filter((b) => b.status === "returned").length,
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
    if (clubName?.toLowerCase().includes(key)) return icon;
  }

  return "📊";
}

export default AnalyticsController;
