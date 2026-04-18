import prisma from "../prisma/client.js";

const STAGE_FLOW = ["LEAD", "CONTACTED", "PROPOSAL", "NEGOTIATION", "CONFIRMED"];

const toInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const canMoveStage = (current, next) => {
  const currentIndex = STAGE_FLOW.indexOf(current);
  const nextIndex = STAGE_FLOW.indexOf(next);
  return nextIndex === currentIndex + 1;
};

class OperationsController {
  static async getOverview(req, res) {
    try {
      const [organizations, leads, budgets, vendors, stalls] = await Promise.all([
        prisma.organization.count(),
        prisma.sponsorshipLead.findMany({ select: { stage: true, confirmedValue: true } }),
        prisma.organizationBudget.findMany({ select: { plannedAmount: true, actualAmount: true } }),
        prisma.vendorPartner.count(),
        prisma.stallSlot.count({ where: { vendorId: { not: null } } }),
      ]);

      const stageCounts = STAGE_FLOW.reduce((acc, stage) => {
        acc[stage] = 0;
        return acc;
      }, {});

      let confirmedRevenue = 0;
      for (const lead of leads) {
        stageCounts[lead.stage] += 1;
        confirmedRevenue += lead.confirmedValue || 0;
      }

      let plannedTotal = 0;
      let actualTotal = 0;
      for (const entry of budgets) {
        plannedTotal += entry.plannedAmount;
        actualTotal += entry.actualAmount;
      }

      return res.json({
        success: true,
        overview: {
          organizations,
          stageCounts,
          confirmedRevenue,
          plannedBudget: plannedTotal,
          actualSpend: actualTotal,
          variance: plannedTotal - actualTotal,
          vendors,
          allocatedStalls: stalls,
        },
      });
    } catch (error) {
      console.error("Operations overview error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async listOrganizations(req, res) {
    try {
      const organizations = await prisma.organization.findMany({
        include: {
          manager: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return res.json({ success: true, organizations });
    } catch (error) {
      console.error("List organizations error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async createOrganization(req, res) {
    try {
      const { name, faculty, contactEmail, contactPhone, description, logoUrl, themePrimary, themeAccent } = req.body;
      if (!name || !faculty || !contactEmail) {
        return res.status(400).json({ success: false, message: "Name, faculty and contactEmail are required" });
      }

      const organization = await prisma.organization.create({
        data: {
          name,
          faculty,
          contactEmail,
          contactPhone,
          description,
          logoUrl,
          themePrimary,
          themeAccent,
          managerId: req.user.id,
        },
      });

      return res.status(201).json({ success: true, organization });
    } catch (error) {
      console.error("Create organization error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async updateOrganizationBranding(req, res) {
    try {
      const organizationId = toInt(req.params.id);
      if (!organizationId) {
        return res.status(400).json({ success: false, message: "Invalid organization id" });
      }

      const { logoUrl, themePrimary, themeAccent, description, contactPhone } = req.body;

      const updated = await prisma.organization.update({
        where: { id: organizationId },
        data: { logoUrl, themePrimary, themeAccent, description, contactPhone },
      });

      return res.json({ success: true, organization: updated });
    } catch (error) {
      console.error("Update organization branding error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async listSponsorships(req, res) {
    try {
      const stage = req.query.stage;
      const where = stage ? { stage } : {};
      const sponsorships = await prisma.sponsorshipLead.findMany({
        where,
        include: {
          organization: { select: { id: true, name: true } },
          contributions: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      return res.json({ success: true, sponsorships });
    } catch (error) {
      console.error("List sponsorships error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async createSponsorship(req, res) {
    try {
      const {
        organizationId,
        sponsorName,
        sponsorEmail,
        contactPerson,
        packageTier,
        expectedValue,
        benefitsChecklist,
        notes,
      } = req.body;

      if (!organizationId || !sponsorName) {
        return res.status(400).json({ success: false, message: "organizationId and sponsorName are required" });
      }

      const sponsorship = await prisma.sponsorshipLead.create({
        data: {
          organizationId: Number(organizationId),
          sponsorName,
          sponsorEmail,
          contactPerson,
          packageTier,
          expectedValue,
          benefitsChecklist,
          notes,
          managedById: req.user.id,
        },
      });

      return res.status(201).json({ success: true, sponsorship });
    } catch (error) {
      console.error("Create sponsorship error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async moveSponsorshipStage(req, res) {
    try {
      const sponsorshipId = toInt(req.params.id);
      const { stage } = req.body;

      if (!sponsorshipId || !stage || !STAGE_FLOW.includes(stage)) {
        return res.status(400).json({ success: false, message: "Invalid sponsorship id or stage" });
      }

      const existing = await prisma.sponsorshipLead.findUnique({ where: { id: sponsorshipId } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Sponsorship not found" });
      }

      const isAdminOverride = req.user.role === "SYSTEM_ADMIN";
      if (!isAdminOverride && !canMoveStage(existing.stage, stage)) {
        return res.status(400).json({
          success: false,
          message: "Invalid stage transition. Non-admin users can only move to the next stage.",
        });
      }

      const updated = await prisma.sponsorshipLead.update({
        where: { id: sponsorshipId },
        data: {
          stage,
          lastMovedAt: new Date(),
          managedById: req.user.id,
        },
      });

      return res.json({ success: true, sponsorship: updated });
    } catch (error) {
      console.error("Move sponsorship stage error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async addContribution(req, res) {
    try {
      const sponsorshipId = toInt(req.params.id);
      const { type, amount, inKindValue, description } = req.body;
      if (!sponsorshipId || !type) {
        return res.status(400).json({ success: false, message: "sponsorship id and type are required" });
      }

      const contribution = await prisma.sponsorContribution.create({
        data: {
          sponsorshipId,
          type,
          amount,
          inKindValue,
          description,
        },
      });

      return res.status(201).json({ success: true, contribution });
    } catch (error) {
      console.error("Add contribution error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async listBudgets(req, res) {
    try {
      const organizationId = toInt(req.query.organizationId);
      const where = organizationId ? { organizationId } : {};
      const budgets = await prisma.organizationBudget.findMany({
        where,
        include: {
          organization: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: "desc" },
      });
      return res.json({ success: true, budgets });
    } catch (error) {
      console.error("List budgets error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async createBudgetEntry(req, res) {
    try {
      const { organizationId, eventId, category, plannedAmount, actualAmount, notes } = req.body;
      if (!organizationId || !category || plannedAmount === undefined) {
        return res.status(400).json({ success: false, message: "organizationId, category and plannedAmount are required" });
      }

      const entry = await prisma.organizationBudget.create({
        data: {
          organizationId: Number(organizationId),
          eventId: eventId ? Number(eventId) : null,
          category,
          plannedAmount: Number(plannedAmount),
          actualAmount: Number(actualAmount || 0),
          notes,
          createdById: req.user.id,
        },
      });

      return res.status(201).json({ success: true, entry });
    } catch (error) {
      console.error("Create budget entry error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async listVendors(req, res) {
    try {
      const vendors = await prisma.vendorPartner.findMany({
        include: {
          organization: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return res.json({ success: true, vendors });
    } catch (error) {
      console.error("List vendors error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async createVendor(req, res) {
    try {
      const {
        organizationId,
        name,
        companyName,
        serviceCategory,
        contactName,
        contactPhone,
        contactEmail,
        address,
        requirements,
      } = req.body;
      if (!name || !contactName || !contactPhone) {
        return res.status(400).json({
          success: false,
          message: "name, contactName and contactPhone are required",
        });
      }

      const vendor = await prisma.vendorPartner.create({
        data: {
          name,
          companyName: companyName || name,
          serviceCategory: serviceCategory || requirements || "General",
          contactName,
          contactPhone,
          contactEmail,
          address: address || "",
          requirements,
          status: "ACTIVE",
          ...(organizationId
            ? { organization: { connect: { id: Number(organizationId) } } }
            : {}),
        },
      });

      return res.status(201).json({ success: true, vendor });
    } catch (error) {
      console.error("Create vendor error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async updateVendorAgreementStatus(req, res) {
    try {
      const vendorId = toInt(req.params.id);
      const { agreementStatus } = req.body;
      if (!vendorId || !agreementStatus) {
        return res.status(400).json({ success: false, message: "vendor id and agreementStatus are required" });
      }

      const vendor = await prisma.vendorPartner.update({
        where: { id: vendorId },
        data: {
          agreementStatus,
          approvedById: req.user.id,
        },
      });

      return res.json({ success: true, vendor });
    } catch (error) {
      console.error("Update vendor agreement status error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async listStalls(req, res) {
    try {
      const organizationId = toInt(req.query.organizationId);
      const where = organizationId ? { organizationId } : {};
      const stalls = await prisma.stallSlot.findMany({
        where,
        include: {
          vendor: { select: { id: true, name: true, agreementStatus: true } },
          organization: { select: { id: true, name: true } },
        },
        orderBy: [{ eventDate: "asc" }, { startTime: "asc" }],
      });
      return res.json({ success: true, stalls });
    } catch (error) {
      console.error("List stalls error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async createStall(req, res) {
    try {
      const { organizationId, slotCode, location, eventDate, startTime, endTime } = req.body;
      if (!organizationId || !slotCode || !location || !eventDate || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: "organizationId, slotCode, location, eventDate, startTime, endTime are required",
        });
      }

      const start = new Date(startTime);
      const end = new Date(endTime);
      if (end <= start) {
        return res.status(400).json({ success: false, message: "endTime must be after startTime" });
      }

      const stall = await prisma.stallSlot.create({
        data: {
          organizationId: Number(organizationId),
          slotCode,
          location,
          eventDate: new Date(eventDate),
          startTime: start,
          endTime: end,
        },
      });

      return res.status(201).json({ success: true, stall });
    } catch (error) {
      console.error("Create stall error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async allocateStall(req, res) {
    try {
      const stallId = toInt(req.params.id);
      const { vendorId } = req.body;
      if (!stallId || !vendorId) {
        return res.status(400).json({ success: false, message: "stall id and vendorId are required" });
      }

      const stall = await prisma.stallSlot.findUnique({ where: { id: stallId } });
      if (!stall) {
        return res.status(404).json({ success: false, message: "Stall not found" });
      }

      const overlap = await prisma.stallSlot.findFirst({
        where: {
          vendorId: Number(vendorId),
          id: { not: stallId },
          eventDate: stall.eventDate,
          AND: [{ startTime: { lt: stall.endTime } }, { endTime: { gt: stall.startTime } }],
        },
      });

      if (overlap) {
        return res.status(400).json({
          success: false,
          message: "Vendor already has another stall allocated for an overlapping time slot",
        });
      }

      const updated = await prisma.stallSlot.update({
        where: { id: stallId },
        data: {
          vendorId: Number(vendorId),
          allocatedById: req.user.id,
        },
      });

      return res.json({ success: true, stall: updated });
    } catch (error) {
      console.error("Allocate stall error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async getIntelligence(req, res) {
    try {
      const [overviewData, confirmedLeads] = await Promise.all([
        prisma.organizationBudget.findMany({
          select: { plannedAmount: true, actualAmount: true, createdAt: true },
        }),
        prisma.sponsorshipLead.findMany({
          where: { stage: "CONFIRMED" },
          select: { confirmedValue: true, updatedAt: true },
        }),
      ]);

      const monthlyBudget = {};
      for (const entry of overviewData) {
        const key = entry.createdAt.toISOString().slice(0, 7);
        if (!monthlyBudget[key]) {
          monthlyBudget[key] = { month: key, planned: 0, actual: 0 };
        }
        monthlyBudget[key].planned += entry.plannedAmount;
        monthlyBudget[key].actual += entry.actualAmount;
      }

      const monthlySponsors = {};
      for (const lead of confirmedLeads) {
        const key = lead.updatedAt.toISOString().slice(0, 7);
        monthlySponsors[key] = (monthlySponsors[key] || 0) + (lead.confirmedValue || 0);
      }

      const budgetTrend = Object.values(monthlyBudget).sort((a, b) => a.month.localeCompare(b.month));
      const sponsorTrend = Object.keys(monthlySponsors)
        .sort((a, b) => a.localeCompare(b))
        .map((month) => ({ month, confirmedRevenue: monthlySponsors[month] }));

      const recent = sponsorTrend.slice(-3);
      const forecast = recent.length
        ? Math.round(recent.reduce((sum, item) => sum + item.confirmedRevenue, 0) / recent.length)
        : 0;

      return res.json({
        success: true,
        intelligence: {
          budgetTrend,
          sponsorTrend,
          nextMonthRevenueForecast: forecast,
        },
      });
    } catch (error) {
      console.error("Get intelligence error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default OperationsController;
