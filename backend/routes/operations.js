import express from "express";
import OperationsController from "../controllers/operationsController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

const operationsGuard = [
  verifyToken,
  requireRole("OPERATIONS_MANAGER", "SYSTEM_ADMIN"),
];

router.get("/overview", ...operationsGuard, OperationsController.getOverview);
router.get("/intelligence", ...operationsGuard, OperationsController.getIntelligence);

router.get("/organizations", ...operationsGuard, OperationsController.listOrganizations);
router.post("/organizations", ...operationsGuard, OperationsController.createOrganization);
router.patch(
  "/organizations/:id/branding",
  ...operationsGuard,
  OperationsController.updateOrganizationBranding,
);

router.get("/sponsorships", ...operationsGuard, OperationsController.listSponsorships);
router.post("/sponsorships", ...operationsGuard, OperationsController.createSponsorship);
router.patch(
  "/sponsorships/:id/stage",
  ...operationsGuard,
  OperationsController.moveSponsorshipStage,
);
router.post(
  "/sponsorships/:id/contributions",
  ...operationsGuard,
  OperationsController.addContribution,
);

router.get("/budgets", ...operationsGuard, OperationsController.listBudgets);
router.post("/budgets", ...operationsGuard, OperationsController.createBudgetEntry);

router.get("/vendors", ...operationsGuard, OperationsController.listVendors);
router.post("/vendors", ...operationsGuard, OperationsController.createVendor);
router.patch(
  "/vendors/:id/agreement",
  ...operationsGuard,
  OperationsController.updateVendorAgreementStatus,
);

router.get("/stalls", ...operationsGuard, OperationsController.listStalls);
router.post("/stalls", ...operationsGuard, OperationsController.createStall);
router.patch("/stalls/:id/allocate", ...operationsGuard, OperationsController.allocateStall);

export default router;
