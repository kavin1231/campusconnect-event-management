import express from "express";
import PresidentController from "../controllers/presidentController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// student applies for presidency
router.post(
  "/apply",
  verifyToken,
  requireRole("STUDENT"),
  PresidentController.apply,
);

// student gets their application status
router.get(
  "/application-status",
  verifyToken,
  requireRole("STUDENT"),
  PresidentController.getApplicationStatus,
);

// student gets their notifications
router.get(
  "/notifications",
  verifyToken,
  requireRole("STUDENT"),
  PresidentController.getStudentNotifications,
);

// student marks notification as read
router.patch(
  "/notifications/:notificationId/read",
  verifyToken,
  requireRole("STUDENT"),
  PresidentController.markNotificationRead,
);

// admin views all applications
router.get(
  "/applications",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  PresidentController.list,
);

// admin creates a president directly
router.post(
  "/create",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  PresidentController.createPresident,
);

router.get(
  "/vendors",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.listVendors,
);

router.post(
  "/vendors",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.createVendor,
);

router.patch(
  "/vendors/:id",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.updateVendor,
);

router.delete(
  "/vendors/:id",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.deleteVendor,
);

router.get(
  "/stalls",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.getStallsByEvent,
);

router.get(
  "/stalls/available",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.getAvailableStallsByEvent,
);

router.get(
  "/stalls/map",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.getStallMapData,
);

router.post(
  "/stalls/assign",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.assignStallToVendor,
);

router.patch(
  "/stalls/:stallId",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.updateStallAllocation,
);

router.patch(
  "/stalls/:stallId/release",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "CLUB_PRESIDENT"),
  PresidentController.releaseStall,
);



// admin approve/reject
router.patch(
  "/applications/:id/approve",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  PresidentController.approve,
);

router.patch(
  "/applications/:id/reject",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  PresidentController.reject,
);


export default router;
