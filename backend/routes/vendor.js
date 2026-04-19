import express from "express";
import VendorController from "../controllers/vendorController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

const protectVendorRoutes = (req, res, next) => {
	const hasAuthHeader = Boolean(req.headers.authorization);

	// In local development, allow dashboard testing without JWT setup.
	if (process.env.NODE_ENV !== "production" && !hasAuthHeader) {
		return next();
	}

	return verifyToken(req, res, () =>
		requireRole("CLUB_PRESIDENT")(req, res, next),
	);
};

router.use(protectVendorRoutes);

router.post("/", VendorController.createVendor);
router.get("/", VendorController.listVendors);
router.get("/:id", VendorController.getVendorById);
router.put("/:id", VendorController.updateVendor);
router.delete("/:id", VendorController.deleteVendor);

export default router;
