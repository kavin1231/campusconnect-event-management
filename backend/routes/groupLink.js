import express from "express";
import GroupLinkController from "../controllers/groupLinkController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes (Protected)
router.post("/", verifyToken, requireRole(["SYSTEM_ADMIN"]), GroupLinkController.createLink);
router.put("/:id", verifyToken, requireRole(["SYSTEM_ADMIN"]), GroupLinkController.updateLink);
router.delete("/:id", verifyToken, requireRole(["SYSTEM_ADMIN"]), GroupLinkController.deleteLink);

// Global routes (Any logged in user can view)
router.get("/", verifyToken, GroupLinkController.getAllLinks);

export default router;
