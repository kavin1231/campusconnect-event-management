import express from "express";
import MerchandiseController from "../controllers/merchandiseController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";
import merchandiseImageUpload from "../middleware/merchandiseImageUpload.js";
import paymentSlipUpload from "../middleware/paymentSlipUpload.js";

const router = express.Router();

// Products
router.get("/products", MerchandiseController.getProducts);
router.get("/products/:id", MerchandiseController.getProductById);
router.get("/products/:id/orders", verifyToken, MerchandiseController.getOrdersByProduct);
router.post(
  "/products/:id/distribute",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"),
  MerchandiseController.distributeProductOrders,
);
router.post(
  "/products/upload-image",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT"),
  merchandiseImageUpload.single("image"),
  MerchandiseController.uploadProductImage,
);
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

// Payment Slips
router.post(
  "/upload-payment-slip",
  verifyToken,
  requireRole("STUDENT", "CLUB_PRESIDENT"),
  paymentSlipUpload.single("slip"),
  MerchandiseController.uploadPaymentSlip,
);

// Orders
router.get("/orders", verifyToken, MerchandiseController.getOrders);
router.get("/orders/:id", verifyToken, MerchandiseController.getOrderById);
router.post(
  "/orders",
  verifyToken,
  requireRole("SYSTEM_ADMIN", "EVENT_ORGANIZER", "CLUB_PRESIDENT", "STUDENT"),
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
