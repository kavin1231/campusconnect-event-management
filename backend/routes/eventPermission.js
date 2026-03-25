import express from "express";
import rateLimit from "express-rate-limit";
import EventPermissionController from "../controllers/eventPermissionController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

const eventPermissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

// Submit a new event permission request (CLUB_PRESIDENT or EVENT_ORGANIZER)
router.post(
  "/",
  eventPermissionLimiter,
  verifyToken,
  requireRole("CLUB_PRESIDENT", "EVENT_ORGANIZER"),
  EventPermissionController.submit,
);

// List all event permission requests (SYSTEM_ADMIN or EVENT_ORGANIZER)
router.get(
  "/",
  eventPermissionLimiter,
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER"),
  EventPermissionController.list,
);

// List own event permission requests (CLUB_PRESIDENT or EVENT_ORGANIZER)
router.get(
  "/my",
  eventPermissionLimiter,
  verifyToken,
  requireRole("CLUB_PRESIDENT", "EVENT_ORGANIZER"),
  EventPermissionController.listMy,
);

// Approve an event permission request (SYSTEM_ADMIN only)
router.patch(
  "/:id/approve",
  eventPermissionLimiter,
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER"),
  EventPermissionController.approve,
);

// Reject an event permission request (SYSTEM_ADMIN only)
router.patch(
  "/:id/reject",
  eventPermissionLimiter,
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER"),
  EventPermissionController.reject,
);

export default router;
