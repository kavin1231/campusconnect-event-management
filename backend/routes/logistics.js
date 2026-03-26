import express from "express";
import LogisticsController from "../controllers/logisticsController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========== CLUB MANAGEMENT ROUTES ==========

// Get all clubs
router.get("/clubs", verifyToken, LogisticsController.getAllClubs);

// Get club by ID
router.get("/clubs/:clubId", verifyToken, LogisticsController.getClubById);

// Create club (Admin only)
router.post(
  "/clubs",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  LogisticsController.createClub,
);

// Update club (Club president or admin)
router.patch("/clubs/:clubId", verifyToken, LogisticsController.updateClub);

// ========== ASSET MANAGEMENT ROUTES ==========

// Get all assets with filters
router.get("/assets", verifyToken, LogisticsController.getAllAssets);

// Get single asset by ID
router.get("/assets/:assetId", verifyToken, LogisticsController.getAssetById);

// Create asset (Club president or admin)
router.post(
  "/assets",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT", "EVENT_ORGANIZER"),
  LogisticsController.createAsset,
);

// Update asset
router.patch("/assets/:assetId", verifyToken, LogisticsController.updateAsset);

// Delete asset
router.delete("/assets/:assetId", verifyToken, LogisticsController.deleteAsset);

// Create booking request for a specific asset (used by frontend logisticsAPI)
router.post(
  "/assets/:assetId/request",
  verifyToken,
  requireRole("EVENT_ORGANIZER"),
  LogisticsController.requestAsset,
);

// ========== AVAILABILITY ENGINE ==========

// Check asset availability for date range
router.post(
  "/availability/check",
  verifyToken,
  LogisticsController.checkAvailability,
);

// ========== BOOKING MANAGEMENT ROUTES ==========

// Create booking request
router.post(
  "/bookings",
  verifyToken,
  requireRole("EVENT_ORGANIZER"),
  LogisticsController.createBooking,
);

// Get all bookings (with filters)
router.get("/bookings", verifyToken, LogisticsController.getAllBookings);

// Aliased requests endpoints (for frontend logisticsAPI using "/logistics/requests")
router.get("/requests", verifyToken, LogisticsController.getRequests);

// Approve booking request (Owning club president)
router.patch(
  "/bookings/:bookingId/approve",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT", "EVENT_ORGANIZER"),
  LogisticsController.approveBooking,
);

router.patch(
  "/requests/:bookingId/approve",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT", "EVENT_ORGANIZER"),
  LogisticsController.approveBooking,
);

// Reject booking request
router.patch(
  "/bookings/:bookingId/reject",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT", "EVENT_ORGANIZER"),
  LogisticsController.rejectBooking,
);

router.patch(
  "/requests/:bookingId/reject",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT", "EVENT_ORGANIZER"),
  LogisticsController.rejectBooking,
);

// Checkout asset (Mark as checked out)
router.patch(
  "/bookings/:bookingId/checkout",
  verifyToken,
  LogisticsController.checkoutAsset,
);

router.patch(
  "/requests/:bookingId/checkout",
  verifyToken,
  LogisticsController.checkoutAsset,
);

// Return asset
router.patch(
  "/bookings/:bookingId/return",
  verifyToken,
  LogisticsController.returnAsset,
);

router.patch(
  "/requests/:bookingId/return",
  verifyToken,
  LogisticsController.returnAsset,
);

// ========== DAMAGE REPORTING ==========

// Report damage
router.post("/damage-reports", verifyToken, LogisticsController.reportDamage);

// Get damage reports
router.get(
  "/damage-reports",
  verifyToken,
  LogisticsController.getDamageReports,
);

// Approve damage report and set penalty (Admin only)
router.patch(
  "/damage-reports/:reportId/approve",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  LogisticsController.approveDamageReport,
);

// Reject damage report
router.patch(
  "/damage-reports/:reportId/reject",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  LogisticsController.rejectDamageReport,
);

// ========== ADMIN ANALYTICS ==========

// Get logistics statistics
router.get(
  "/admin/stats",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  LogisticsController.getLogisticsStats,
);

export default router;
