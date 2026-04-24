import express from "express";
import DelegateController from "../controllers/delegateController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * All routes under /api/event-requests/:eventRequestId/delegates
 */

// Add a delegate to event
router.post(
  "/",
  verifyToken,
  DelegateController.addEventDelegate
);

// Get all delegates for event
router.get(
  "/",
  verifyToken,
  DelegateController.getEventDelegates
);

// Get delegate history/audit log
router.get(
  "/history",
  verifyToken,
  DelegateController.getDelegateHistory
);

// Update delegate role
router.patch(
  "/:delegateId",
  verifyToken,
  DelegateController.updateDelegateRole
);

// Remove delegate
router.delete(
  "/:delegateId",
  verifyToken,
  DelegateController.removeEventDelegate
);

export default router;
