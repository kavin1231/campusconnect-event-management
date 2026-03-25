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
