import express from "express";
import SportController from "../controllers/sportController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// public/student/admin routes
router.get("/", SportController.getAllSports);

// admin routes
router.post(
  "/",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  SportController.createSport
);

router.put(
  "/:id",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  SportController.updateSport
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("SYSTEM_ADMIN"),
  SportController.deleteSport
);

export default router;
