import express from "express";
import prisma from "../prisma/client.js";
import {
  getEventReviews,
  addEventReview,
  updateEventReview,
  deleteEventReview,
  getStudentReview,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import OperationsController from "../controllers/operationsController.js";

const router = express.Router();

const EVENT_SAFE_SELECT = {
  id: true,
  title: true,
  description: true,
  date: true,
  category: true,
  location: true,
  image: true,
  registeredCount: true,
  status: true,
  budget: true,
  expectedAttendees: true,
  venue: true,
  submittedBy: true,
  submittedDate: true,
  approvedBy: true,
  approvedAt: true,
  rejectionReason: true,
  createdAt: true,
};

const parseOrganizerFilter = (query) => {
  const organizerTypeRaw = String(query.organizerType || "").trim();
  const organizerIdRaw = String(query.organizerId || "").trim();

  const filter = {};
  if (organizerTypeRaw) {
    const organizerType = organizerTypeRaw.toUpperCase();
    if (!["CLUB", "FACULTY"].includes(organizerType)) {
      return { error: "organizerType must be CLUB or FACULTY" };
    }
    filter.organizerType = organizerType;
  }

  if (organizerIdRaw) {
    filter.organizerId = organizerIdRaw;
  }

  return { filter };
};

// Get published events (public)
router.get("/published", async (req, res) => {
  try {
    const organizerFilterResult = parseOrganizerFilter(req.query);
    if (organizerFilterResult.error) {
      return res
        .status(400)
        .json({ success: false, message: organizerFilterResult.error });
    }

    // First try to get PUBLISHED events
    let events = await prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        date: { gte: new Date() },
        ...organizerFilterResult.filter,
      },
      orderBy: { date: "asc" },
      select: {
        ...EVENT_SAFE_SELECT,
        _count: {
          select: { registrations: true },
        },
      },
    }).catch(() => []);

    // If no published events found, get all future events (for backward compatibility with existing data)
    if (events.length === 0) {
      events = await prisma.event.findMany({
        where: {
          date: { gte: new Date() },
          ...organizerFilterResult.filter,
        },
        orderBy: { date: "asc" },
        take: 20, // Limit to prevent too many results
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          category: true,
          location: true,
          image: true,
          _count: {
            select: { registrations: true }
          },
        },
      }).catch((err) => {
        console.error("Error getting fallback events:", err);
        return [];
      });
    }

    const mappedEvents = events.map((ev) => ({
      ...ev,
      registeredCount: ev._count.registrations,
      organizer: null,
      organizerType: null,
      organizerId: null,
      _count: undefined,
    }));
    res.json({ success: true, events: mappedEvents });
  } catch (error) {
    console.error("Error fetching published events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get events for calendar view (organized by full date)
router.get("/calendar/view", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { status: { in: ["APPROVED", "PUBLISHED"] } },
      orderBy: { date: "asc" },
    });

    // Transform and organize events by full date (YYYY-MM-DD)
    const eventsByDay = {};

    events.forEach((event) => {
      // Format date as YYYY-MM-DD to ensure events only show on their specific date/month
      const eventDate = new Date(event.date);
      const fullDateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`;

      if (!eventsByDay[fullDateKey]) {
        eventsByDay[fullDateKey] = [];
      }

      eventsByDay[fullDateKey].push({
        id: event.id,
        title: event.title,
        type: event.category, // Map category to type for frontend
        venue: event.location, // Map location to venue for frontend
        org: "Event Organizer", // Default org; can be enhanced later with org names
        conflict: false, // Default; can be enhanced with conflict detection logic
        date: event.date,
        image: event.image,
        description: event.description,
        registeredCount: event.registeredCount,
      });
    });

    res.json({ success: true, eventsByDay });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const organizerFilterResult = parseOrganizerFilter(req.query);
    if (organizerFilterResult.error) {
      return res
        .status(400)
        .json({ success: false, message: organizerFilterResult.error });
    }

    const filter = {
      ...(status ? { status: String(status).toUpperCase() } : {}),
      ...organizerFilterResult.filter,
    };

    const events = await prisma.event.findMany({
      where: filter,
      orderBy: { date: "asc" },
      select: {
        ...EVENT_SAFE_SELECT,
      },
    });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve an event
router.patch("/:eventId/approve", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        status: "APPROVED",
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Event approved successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject an event
router.patch("/:eventId/reject", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        status: "REJECTED",
        approvedBy: userId,
        approvedAt: new Date(),
        rejectionReason: reason,
      },
    });

    res.json({
      success: true,
      message: "Event rejected successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get event details with reviews and average rating
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: {
        registrations: {
          select: {
            studentId: true,
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Try to fetch reviews separately if table exists
    let reviews = [];
    try {
      reviews = await prisma.eventReview.findMany({
        where: { eventId: parseInt(eventId) },
        select: { rating: true },
      });
    } catch (err) {
      // Reviews table might not exist yet, that's ok
      console.log("Reviews table not available yet");
    }

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0;

    res.json({
      success: true,
      data: {
        ...event,
        registeredCount: event._count.registrations,
        _count: undefined,
        averageRating: parseFloat(avgRating),
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== STALL ALLOCATION ROUTES ====================

// Get stalls for an event (public)
router.get("/:eventId/stalls", OperationsController.listEventStalls);

// ==================== REVIEWS ROUTES ====================

// Get all reviews for an event
router.get("/:eventId/reviews", getEventReviews);

// Get student's review for an event (protected)
router.get("/:eventId/reviews/my-review", verifyToken, getStudentReview);

// Add a review (protected)
router.post("/:eventId/reviews", verifyToken, addEventReview);

// Update a review (protected)
router.put("/reviews/:reviewId", verifyToken, updateEventReview);

// Delete a review (protected)
router.delete("/reviews/:reviewId", verifyToken, deleteEventReview);

export default router;
