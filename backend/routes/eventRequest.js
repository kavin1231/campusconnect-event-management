import express from "express";
import * as eventRequestController from "../controllers/eventRequestController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

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

// Get specific event request (authenticated users)
router.get("/:id", verifyToken, eventRequestController.getEventRequest);

// Update event request status (admin only)
router.patch(
  "/:id/status",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  eventRequestController.updateEventRequestStatus,
);

// Delete event request (authenticated users)
router.delete("/:id", verifyToken, eventRequestController.deleteEventRequest);

export default router;
