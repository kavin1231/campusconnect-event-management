import express from "express";
import SponsorshipController from "../controllers/sponsorshipController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

const protectSponsorshipRoutes = (req, res, next) => {
	const hasAuthHeader = Boolean(req.headers.authorization);

	// In local development, allow dashboard testing without JWT setup.
	if (process.env.NODE_ENV !== "production" && !hasAuthHeader) {
		return next();
	}

	return verifyToken(req, res, () =>
		requireRole("CLUB_PRESIDENT")(req, res, next),
	);
};

router.use(protectSponsorshipRoutes);

router.post("/", SponsorshipController.createSponsorship);
router.get("/", SponsorshipController.listSponsorships);
router.get("/:id", SponsorshipController.getSponsorshipById);
router.put("/:id", SponsorshipController.updateSponsorship);
router.delete("/:id", SponsorshipController.deleteSponsorship);

export default router;
