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

const router = express.Router();

// Get published events (public)
router.get("/published", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { date: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        category: true,
        location: true,
        image: true,
        registeredCount: true,
        status: true,
      },
    });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status: status.toUpperCase() } : {};

    const events = await prisma.event.findMany({
      where: filter,
      orderBy: { date: "asc" },
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
        averageRating: parseFloat(avgRating),
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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
