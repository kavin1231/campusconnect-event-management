import express from "express";
import AnalyticsController from "../controllers/analyticsController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All analytics routes require authentication and SYSTEM_ADMIN role
router.use(verifyToken);
router.use(requireRole("SYSTEM_ADMIN"));

// GET /api/analytics/user-activity
router.get("/user-activity", AnalyticsController.getUserActivity);

export default router;
