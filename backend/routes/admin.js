import express from "express";
import AdminController from "../controllers/adminController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create staff user (SYSTEM_ADMIN / EVENT_ORGANIZER / CLUB_PRESIDENT)
router.post(
  "/users",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  AdminController.createUser,
);

export default router;
