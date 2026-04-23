import prisma from "../prisma/client.js";

class DashboardController {
  // GET /api/dashboard/stats  — summary counts for the logged-in student
  static async getStats(req, res) {
    try {
      const studentId = req.user.id;
      const now = new Date();

      const [registered, upcoming, past, totalEvents] = await Promise.all([
        // total events this student registered for
        prisma.studentEventRegistration.count({ where: { studentId } }),
        // upcoming (event date >= now)
        prisma.studentEventRegistration.count({
          where: { studentId, event: { date: { gte: now } } },
        }),
        // past (event date < now)
        prisma.studentEventRegistration.count({
          where: { studentId, event: { date: { lt: now } } },
        }),
        // total events on the platform
        prisma.event.count(),
      ]);

      res.json({
        success: true,
        stats: { registered, upcoming, past, totalEvents },
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // GET /api/dashboard/events  — all events with registration status for the student
  static async getEvents(req, res) {
    try {
      const studentId = req.user.id;
      const { filter = "all", category = "", search = "" } = req.query;
      const now = new Date();

      // Fetch all events with registration status
      const events = await prisma.event.findMany({
        where: {
          status: "PUBLISHED",
          ...(category 
            ? { category: { contains: category, mode: "insensitive" } } 
            : {}),
          ...(search
            ? { title: { contains: search, mode: "insensitive" } }
            : {}),
        },
        include: {
          registrations: {
            where: { studentId },
          },
          _count: {
            select: { registrations: true }
          }
        },
        orderBy: { date: "asc" },
      });

      // Annotate with isRegistered / isPast
      let annotated = events.map((ev) => ({
        id: ev.id,
        title: ev.title,
        description: ev.description,
        date: ev.date,
        category: ev.category,
        location: ev.location,
        image: ev.image,
        registeredCount: ev._count.registrations,
        organizer: ev.organizer,
        createdAt: ev.createdAt,
        isRegistered: ev.registrations.length > 0,
        isPast: ev.date < now,
      }));

      // Apply filter
      if (filter === "registered") {
        annotated = annotated.filter((e) => e.isRegistered);
      } else if (filter === "upcoming") {
        annotated = annotated.filter((e) => !e.isPast);
      } else if (filter === "past") {
        annotated = annotated.filter((e) => e.isPast);
      } else if (filter === "explore") {
        annotated = annotated.filter((e) => !e.isRegistered && !e.isPast);
      }

      res.json({ success: true, events: annotated });
    } catch (err) {
      console.error("Dashboard events error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // POST /api/dashboard/register/:eventId  — register for an event
  static async registerEvent(req, res) {
    try {
      const studentId = req.user.id;
      const eventId = parseInt(req.params.eventId);

      if (isNaN(eventId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event ID" });
      }

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      if (event.date < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Cannot register for a past event",
        });
      }

      // upsert to avoid duplicates
      await prisma.studentEventRegistration.upsert({
        where: { studentId_eventId: { studentId, eventId } },
        create: { studentId, eventId },
        update: {},
      });

      res.json({ success: true, message: "Registered successfully" });
    } catch (err) {
      console.error("Register event error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // DELETE /api/dashboard/register/:eventId  — unregister from an event
  static async unregisterEvent(req, res) {
    try {
      const studentId = req.user.id;
      const eventId = parseInt(req.params.eventId);

      if (isNaN(eventId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event ID" });
      }

      const existing = await prisma.studentEventRegistration.findUnique({
        where: { studentId_eventId: { studentId, eventId } },
      });

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Registration not found" });
      }

      await prisma.studentEventRegistration.delete({
        where: { studentId_eventId: { studentId, eventId } },
      });

      res.json({ success: true, message: "Unregistered successfully" });
    } catch (err) {
      console.error("Unregister event error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }
}

export default DashboardController;
