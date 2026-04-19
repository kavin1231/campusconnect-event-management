import express from "express";
import MerchandiseController from "../controllers/merchandiseController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Products
router.get("/products", verifyToken, MerchandiseController.getProducts);
router.get("/products/:id", verifyToken, MerchandiseController.getProductById);
router.post(
  "/products",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"),
  MerchandiseController.createProduct,
);
router.patch(
  "/products/:id",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"),
  MerchandiseController.updateProduct,
);
router.delete(
  "/products/:id",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"),
  MerchandiseController.deleteProduct,
);

// Orders
router.get("/orders", verifyToken, MerchandiseController.getOrders);
router.get("/orders/:id", verifyToken, MerchandiseController.getOrderById);
router.post(
  "/orders",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"),
  MerchandiseController.createOrder,
);
router.patch(
  "/orders/:id",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"),
  MerchandiseController.updateOrder,
);
router.delete(
  "/orders/:id",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"),
  MerchandiseController.deleteOrder,
);

export default router;
