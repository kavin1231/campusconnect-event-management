import express from "express";
import * as eventRequestController from "../controllers/eventRequestController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";
import eventImageUpload from "../middleware/eventImageUpload.js";
import delegateRoutes from "./delegates.js";

const router = express.Router();

// Get event request stats (admin only) - MUST come before :id route
router.get(
  "/stats",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  eventRequestController.getEventRequestStats,
);

// Create event request (authenticated users)
router.post("/", verifyToken, eventRequestController.createEventRequest);

// Get all event requests (admin only - sees all, users see own)
router.get("/", verifyToken, eventRequestController.getEventRequests);

// Get all event requests for the current user (all statuses)
router.get("/my", verifyToken, eventRequestController.getMyEventRequestsAll);

// Calendar data for event requests
router.get("/calendar", verifyToken, eventRequestController.getEventCalendar);

// Venue conflict detection for event requests
router.get("/conflicts", verifyToken, eventRequestController.getEventConflicts);

// Get specific event request (authenticated users)
router.get("/:id", verifyToken, eventRequestController.getEventRequest);

// Save setup details for approved event requests
router.patch(
  "/:id/setup",
  verifyToken,
  eventRequestController.updateEventSetup,
);

// Upload banner for approved event requests
router.post(
  "/:id/banner",
  verifyToken,
  eventImageUpload.single("banner"),
  eventRequestController.updateEventBanner,
);

// Replace tickets for approved event requests
router.put(
  "/:id/tickets",
  verifyToken,
  eventRequestController.replaceEventTickets,
);

// Replace merchandise for approved event requests
router.put(
  "/:id/merchandise",
  verifyToken,
  eventRequestController.replaceEventMerchandise,
);

// Update pickup slots for approved event requests
router.patch(
  "/:id/pickup-slots",
  verifyToken,
  eventRequestController.updatePickupSlots,
);

// Update event request status (admin only)
router.patch(
  "/:id/status",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  eventRequestController.updateEventRequestStatus,
);

// Publish an approved event request (submitter or admin)
router.post(
  "/:id/publish",
  verifyToken,
  eventRequestController.publishEventRequest,
);

// Delete event request (authenticated users)
router.delete("/:id", verifyToken, eventRequestController.deleteEventRequest);

export default router;
