import express from "express";
import LogisticsController from "../controllers/logisticsController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// assets
router.get("/assets", verifyToken, LogisticsController.listAssets);
router.post(
  "/assets",
  verifyToken,
  requireRole("EVENT_ORGANIZER", "SYSTEM_ADMIN"),
  LogisticsController.createAsset,
);
router.get("/assets/:id", verifyToken, LogisticsController.getAsset);

// booking requests
router.post(
  "/assets/:id/request",
  verifyToken,
  LogisticsController.requestAsset,
);
router.get("/requests", verifyToken, LogisticsController.listRequests);

// owner actions
router.patch(
  "/requests/:id/approve",
  verifyToken,
  requireRole("EVENT_ORGANIZER", "SYSTEM_ADMIN"),
  LogisticsController.approveRequest,
);
router.patch(
  "/requests/:id/reject",
  verifyToken,
  requireRole("EVENT_ORGANIZER", "SYSTEM_ADMIN"),
  LogisticsController.rejectRequest,
);

// lifecycle updates
router.patch(
  "/requests/:id/checkout",
  verifyToken,
  LogisticsController.checkOutAsset,
);
router.patch(
  "/requests/:id/return",
  verifyToken,
  LogisticsController.returnAsset,
);
router.patch(
  "/requests/:id/damage",
  verifyToken,
  LogisticsController.reportDamage,
);

export default router;
