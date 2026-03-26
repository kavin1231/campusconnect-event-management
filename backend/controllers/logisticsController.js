import prisma from "../prisma/client.js";

class LogisticsController {
  // ========== CLUB MANAGEMENT ==========

  static async getAllClubs(req, res) {
    try {
      const { status, search, clubType, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (clubType) where.clubType = clubType;
      if (search) {
        where.name = {
          contains: search,
          mode: "insensitive",
        };
      }

      const clubs = await prisma.club.findMany({
        where,
        include: {
          president: { select: { id: true, name: true, email: true } },
          members: { select: { id: true, name: true, clubRole: true } },
          _count: {
            select: {
              assets: true,
              members: true,
              requestsSent: true,
              requestsReceived: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.club.count({ where });

      res.json({
        success: true,
        clubs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all clubs error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getClubById(req, res) {
    try {
      const { clubId } = req.params;

      const club = await prisma.club.findUnique({
        where: { id: parseInt(clubId) },
        include: {
          president: true,
          members: {
            select: {
              id: true,
              name: true,
              email: true,
              clubRole: true,
              profileImage: true,
            },
          },
          assets: { include: { _count: { select: { bookings: true } } } },
          damageReports: {
            include: { reporter: { select: { id: true, name: true } } },
          },
          _count: { select: { requestsSent: true, requestsReceived: true } },
        },
      });

      if (!club) {
        return res
          .status(404)
          .json({ success: false, message: "Club not found" });
      }

      res.json({ success: true, club });
    } catch (error) {
      console.error("Get club error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createClub(req, res) {
    try {
      const { name, description, clubType, logo, presidentId } = req.body;

      const club = await prisma.club.create({
        data: {
          name,
          description,
          clubType,
          logo,
          presidentId: presidentId ? parseInt(presidentId) : null,
          status: "ACTIVE",
        },
        include: {
          president: true,
          members: true,
        },
      });

      res
        .status(201)
        .json({ success: true, message: "Club created successfully", club });
    } catch (error) {
      console.error("Create club error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateClub(req, res) {
    try {
      const { clubId } = req.params;
      const { name, description, clubType, logo, status, presidentId } =
        req.body;

      const club = await prisma.club.update({
        where: { id: parseInt(clubId) },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(clubType && { clubType }),
          ...(logo && { logo }),
          ...(status && { status }),
          ...(presidentId && { presidentId: parseInt(presidentId) }),
        },
        include: { president: true, members: true },
      });

      res.json({ success: true, message: "Club updated successfully", club });
    } catch (error) {
      console.error("Update club error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== ASSET MANAGEMENT ==========

  static async getAllAssets(req, res) {
    try {
      const {
        clubId,
        category,
        status,
        condition,
        search,
        page = 1,
        limit = 10,
      } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (clubId) where.clubId = parseInt(clubId);
      if (category) where.category = category;
      if (status) where.status = status;
      if (condition) where.condition = condition;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const assets = await prisma.asset.findMany({
        where,
        include: {
          club: { select: { id: true, name: true, logo: true } },
          _count: { select: { bookings: true, damageReports: true } },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.asset.count({ where });

      res.json({
        success: true,
        assets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all assets error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createAsset(req, res) {
    try {
      const {
        name,
        description,
        category,
        quantity,
        condition,
        clubId,
        images,
        thumbnail,
        value,
      } = req.body;

      const asset = await prisma.asset.create({
        data: {
          name,
          description,
          category,
          quantity: parseInt(quantity),
          availableQty: parseInt(quantity),
          condition,
          clubId: parseInt(clubId),
          images: images || [],
          thumbnail,
          value: value ? parseFloat(value) : null,
          status: "AVAILABLE",
        },
        include: { club: true },
      });

      res
        .status(201)
        .json({ success: true, message: "Asset created successfully", asset });
    } catch (error) {
      console.error("Create asset error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateAsset(req, res) {
    try {
      const { assetId } = req.params;
      const {
        name,
        description,
        category,
        quantity,
        condition,
        status,
        images,
        value,
      } = req.body;

      const asset = await prisma.asset.update({
        where: { id: parseInt(assetId) },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(category && { category }),
          ...(quantity && { quantity: parseInt(quantity) }),
          ...(condition && { condition }),
          ...(status && { status }),
          ...(images && { images }),
          ...(value && { value: parseFloat(value) }),
        },
        include: { club: true },
      });

      res.json({ success: true, message: "Asset updated successfully", asset });
    } catch (error) {
      console.error("Update asset error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteAsset(req, res) {
    try {
      const { assetId } = req.params;

      await prisma.asset.delete({
        where: { id: parseInt(assetId) },
      });

      res.json({ success: true, message: "Asset deleted successfully" });
    } catch (error) {
      console.error("Delete asset error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAssetById(req, res) {
    try {
      const { assetId } = req.params;

      const asset = await prisma.asset.findUnique({
        where: { id: parseInt(assetId) },
        include: {
          club: { select: { id: true, name: true, logo: true } },
          _count: { select: { bookings: true, damageReports: true } },
        },
      });

      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }

      res.json({ success: true, asset });
    } catch (error) {
      console.error("Get asset by id error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== AVAILABILITY ENGINE ==========

  static async checkAvailability(req, res) {
    try {
      const { assetId, startDate, endDate, quantityNeeded = 1 } = req.body;

      if (!assetId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "assetId, startDate and endDate are required",
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format" });
      }

      if (start > end) {
        return res.status(400).json({
          success: false,
          message: "startDate must be before or equal to endDate",
        });
      }

      const asset = await prisma.asset.findUnique({
        where: { id: parseInt(assetId) },
        include: {
          bookings: {
            where: {
              status: { in: ["APPROVED", "CHECKED_OUT"] },
              OR: [
                {
                  startDate: { lte: new Date(endDate) },
                  endDate: { gte: new Date(startDate) },
                },
              ],
            },
          },
        },
      });

      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }

      const bookedQuantity = asset.bookings.reduce(
        (sum, booking) => sum + booking.quantityRequested,
        0,
      );
      const availableQuantity = asset.quantity - bookedQuantity;
      const isAvailable = availableQuantity >= parseInt(quantityNeeded);

      res.json({
        success: true,
        isAvailable,
        availableQuantity,
        totalQuantity: asset.quantity,
        bookedQuantity,
        requestedQuantity: parseInt(quantityNeeded),
      });
    } catch (error) {
      console.error("Check availability error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== BOOKING MANAGEMENT ==========

  static async createBooking(req, res) {
    try {
      const {
        assetId,
        requestingClubId,
        owningClubId,
        requesterId,
        quantityRequested,
        startDate,
        endDate,
        purpose,
      } = req.body;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!assetId || !requestingClubId || !owningClubId || !requesterId) {
        return res.status(400).json({
          success: false,
          message:
            "assetId, requestingClubId, owningClubId and requesterId are required",
        });
      }

      if (isNaN(start) || isNaN(end)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format" });
      }

      if (start > end) {
        return res.status(400).json({
          success: false,
          message: "startDate must be before or equal to endDate",
        });
      }

      if (!quantityRequested || parseInt(quantityRequested) <= 0) {
        return res.status(400).json({
          success: false,
          message: "quantityRequested must be greater than 0",
        });
      }

      const availCheck = await this.checkAssetAvailability(
        parseInt(assetId),
        start,
        end,
        parseInt(quantityRequested),
      );

      if (!availCheck.isAvailable) {
        return res.status(400).json({
          success: false,
          message: "Asset not available for requested dates",
        });
      }

      const booking = await prisma.assetBooking.create({
        data: {
          assetId: parseInt(assetId),
          requestingClubId: parseInt(requestingClubId),
          owningClubId: parseInt(owningClubId),
          requesterId: parseInt(requesterId),
          quantityRequested: parseInt(quantityRequested),
          startDate: start,
          endDate: end,
          purpose,
          status: "PENDING",
        },
        include: {
          asset: true,
          requester: { select: { id: true, name: true, email: true } },
          requestingClub: { select: { id: true, name: true } },
          owningClub: { select: { id: true, name: true } },
        },
      });

      res
        .status(201)
        .json({ success: true, message: "Booking request created", booking });
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Simpler request API used by frontend: POST /assets/:assetId/request
  static async requestAsset(req, res) {
    try {
      const { assetId } = req.params;
      const { quantity, neededDate, returnDate, purpose, contact } = req.body;

      if (!assetId || !neededDate || !returnDate || !quantity) {
        return res.status(400).json({
          success: false,
          message: "assetId, quantity, neededDate and returnDate are required",
        });
      }

      const start = new Date(neededDate);
      const end = new Date(returnDate);

      if (isNaN(start) || isNaN(end)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format" });
      }

      if (start > end) {
        return res.status(400).json({
          success: false,
          message: "neededDate must be before or equal to returnDate",
        });
      }

      const qty = parseInt(quantity);
      if (!qty || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "quantity must be greater than 0",
        });
      }

      const asset = await prisma.asset.findUnique({
        where: { id: parseInt(assetId) },
      });

      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }

      const availability = await this.checkAssetAvailability(
        asset.id,
        start,
        end,
        qty,
      );

      if (!availability.isAvailable) {
        return res.status(400).json({
          success: false,
          message: "Asset not available for requested dates or quantity",
          availableQuantity: availability.availableQuantity,
        });
      }

      // Try to resolve requesting club from user account, fall back to asset's club
      let requestingClubId = asset.clubId;
      try {
        const currentUser = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { clubId: true },
        });
        if (currentUser?.clubId) {
          requestingClubId = currentUser.clubId;
        }
      } catch (e) {
        // If lookup fails we keep fallback club
        console.error("Resolve requesting club error:", e.message);
      }

      const booking = await prisma.assetBooking.create({
        data: {
          assetId: asset.id,
          requestingClubId,
          owningClubId: asset.clubId,
          requesterId: req.user.id,
          quantityRequested: qty,
          startDate: start,
          endDate: end,
          purpose: contact
            ? `${purpose || ""} (Contact: ${contact})`.trim()
            : purpose,
          status: "PENDING",
        },
        include: {
          asset: true,
          requester: { select: { id: true, name: true, email: true } },
          requestingClub: { select: { id: true, name: true } },
          owningClub: { select: { id: true, name: true } },
        },
      });

      res.status(201).json({
        success: true,
        message: "Request submitted successfully",
        request: booking,
      });
    } catch (error) {
      console.error("Request asset error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllBookings(req, res) {
    try {
      const { clubId, status, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (clubId) {
        where.OR = [
          { requestingClubId: parseInt(clubId) },
          { owningClubId: parseInt(clubId) },
        ];
      }

      const bookings = await prisma.assetBooking.findMany({
        where,
        include: {
          asset: true,
          requester: { select: { id: true, name: true, email: true } },
          requestingClub: { select: { id: true, name: true, logo: true } },
          owningClub: { select: { id: true, name: true, logo: true } },
          approvedBy: { select: { id: true, name: true } },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.assetBooking.count({ where });

      res.json({
        success: true,
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all bookings error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Alias used by frontend logisticsAPI.listRequests ("requests" terminology)
  static async getRequests(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) {
        if (status === "active") {
          where.status = "CHECKED_OUT";
        } else if (status === "pending") {
          where.status = "PENDING";
        } else if (status === "returned") {
          where.status = "RETURNED";
        } else {
          where.status = status.toUpperCase();
        }
      }

      const bookings = await prisma.assetBooking.findMany({
        where,
        include: {
          asset: true,
          requester: { select: { id: true, name: true, email: true } },
          requestingClub: { select: { id: true, name: true } },
          owningClub: { select: { id: true, name: true } },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      });

      const now = new Date();

      const requests = bookings.map((b) => {
        let statusLabel = b.status.toLowerCase();
        if (b.status === "CHECKED_OUT") {
          statusLabel = b.endDate < now ? "overdue" : "checked_out";
        } else if (b.status === "RETURNED") {
          statusLabel = "returned";
        }

        const dateToString = (d) => (d ? d.toISOString().split("T")[0] : null);

        return {
          id: b.id,
          asset: b.asset.name,
          owner: b.owningClub?.name || b.requestingClub?.name || "Unknown",
          club: b.requestingClub?.name || "Unknown",
          quantity: b.quantityRequested,
          status: statusLabel,
          neededDate: dateToString(b.startDate),
          returnDate: dateToString(b.endDate),
          requestDate: dateToString(b.createdAt),
          dueDate: dateToString(b.endDate),
          checkedOutDate: dateToString(b.checkedOutAt),
          returnedDate: dateToString(b.returnedAt),
          borrowerContact: null,
          condition: b.asset.condition.toLowerCase(),
          notes: b.purpose || null,
        };
      });

      const total = await prisma.assetBooking.count({ where });

      res.json({
        success: true,
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get requests error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async approveBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const { approvedById } = req.body;

      const booking = await prisma.assetBooking.update({
        where: { id: parseInt(bookingId) },
        data: {
          status: "APPROVED",
          approvedById: parseInt(approvedById),
          approvedAt: new Date(),
        },
        include: {
          asset: true,
          requester: true,
          requestingClub: true,
        },
      });

      res.json({ success: true, message: "Booking approved", booking });
    } catch (error) {
      console.error("Approve booking error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async rejectBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const { rejectionReason } = req.body;

      const booking = await prisma.assetBooking.update({
        where: { id: parseInt(bookingId) },
        data: {
          status: "REJECTED",
          rejectionReason,
        },
        include: {
          asset: true,
          requester: true,
        },
      });

      res.json({ success: true, message: "Booking rejected", booking });
    } catch (error) {
      console.error("Reject booking error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async checkoutAsset(req, res) {
    try {
      const { bookingId } = req.params;

      const booking = await prisma.assetBooking.update({
        where: { id: parseInt(bookingId) },
        data: {
          status: "CHECKED_OUT",
          checkedOutAt: new Date(),
        },
        include: { asset: true, requester: true, requestingClub: true },
      });

      res.json({ success: true, message: "Asset checked out", booking });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async returnAsset(req, res) {
    try {
      const { bookingId } = req.params;
      const { approvedReturnBy } = req.body;

      const booking = await prisma.assetBooking.update({
        where: { id: parseInt(bookingId) },
        data: {
          status: "RETURNED",
          returnedAt: new Date(),
          approvedReturnBy: parseInt(approvedReturnBy),
        },
        include: { asset: true, requester: true },
      });

      res.json({
        success: true,
        message: "Asset returned successfully",
        booking,
      });
    } catch (error) {
      console.error("Return asset error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== DAMAGE REPORTING ==========

  static async reportDamage(req, res) {
    try {
      const {
        bookingId,
        assetId,
        clubId,
        reportedBy,
        title,
        description,
        damageType,
        severity,
        images,
        estimatedCost,
      } = req.body;

      const damageReport = await prisma.damageReport.create({
        data: {
          ...(bookingId && { bookingId: parseInt(bookingId) }),
          assetId: parseInt(assetId),
          clubId: parseInt(clubId),
          reportedBy: parseInt(reportedBy),
          title,
          description,
          damageType,
          severity,
          images: images || [],
          estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
          status: "PENDING",
        },
        include: {
          asset: true,
          reporter: { select: { id: true, name: true, email: true } },
        },
      });

      res.status(201).json({
        success: true,
        message: "Damage report submitted",
        damageReport,
      });
    } catch (error) {
      console.error("Report damage error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getDamageReports(req, res) {
    try {
      const { clubId, status, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (clubId) where.clubId = parseInt(clubId);
      if (status) where.status = status;

      const reports = await prisma.damageReport.findMany({
        where,
        include: {
          asset: true,
          club: { select: { id: true, name: true } },
          reporter: { select: { id: true, name: true, email: true } },
          approvedBy: { select: { id: true, name: true } },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.damageReport.count({ where });

      res.json({
        success: true,
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get damage reports error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async approveDamageReport(req, res) {
    try {
      const { reportId } = req.params;
      const { approvedById, actualCost, penalty, resolutionNotes } = req.body;

      const damageReport = await prisma.damageReport.update({
        where: { id: parseInt(reportId) },
        data: {
          status: "RESOLVED",
          approvedById: parseInt(approvedById),
          actualCost: actualCost ? parseFloat(actualCost) : null,
          penalty: penalty ? parseFloat(penalty) : null,
          resolutionNotes,
          resolvedAt: new Date(),
        },
        include: { asset: true, club: true },
      });

      if (damageReport.bookingId) {
        await prisma.assetBooking.update({
          where: { id: damageReport.bookingId },
          data: { penalty: penalty ? parseFloat(penalty) : null },
        });
      }

      res.json({
        success: true,
        message: "Damage report approved",
        damageReport,
      });
    } catch (error) {
      console.error("Approve damage report error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async rejectDamageReport(req, res) {
    try {
      const { reportId } = req.params;
      const { approvedById, resolutionNotes } = req.body;

      const damageReport = await prisma.damageReport.update({
        where: { id: parseInt(reportId) },
        data: {
          status: "REJECTED",
          approvedById: parseInt(approvedById),
          resolutionNotes,
          resolvedAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: "Damage report rejected",
        damageReport,
      });
    } catch (error) {
      console.error("Reject damage report error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== HELPER FUNCTIONS ==========

  static async checkAssetAvailability(
    assetId,
    startDate,
    endDate,
    quantityNeeded,
  ) {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        bookings: {
          where: {
            status: { in: ["APPROVED", "CHECKED_OUT"] },
            OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
          },
        },
      },
    });

    if (!asset) return { isAvailable: false, reason: "Asset not found" };

    const bookedQuantity = asset.bookings.reduce(
      (sum, booking) => sum + booking.quantityRequested,
      0,
    );
    const availableQuantity = asset.quantity - bookedQuantity;

    return {
      isAvailable: availableQuantity >= quantityNeeded,
      availableQuantity,
    };
  }

  // ========== ADMIN ANALYTICS ==========

  static async getLogisticsStats(req, res) {
    try {
      const totalClubs = await prisma.club.count();
      const totalAssets = await prisma.asset.count();
      const pendingRequests = await prisma.assetBooking.count({
        where: { status: "PENDING" },
      });
      const approvedRequests = await prisma.assetBooking.count({
        where: { status: "APPROVED" },
      });
      const rejectedRequests = await prisma.assetBooking.count({
        where: { status: "REJECTED" },
      });
      const totalDamageReports = await prisma.damageReport.count();
      const totalPenalties = await prisma.damageReport.aggregate({
        _sum: { penalty: true },
      });

      const recentBookings = await prisma.assetBooking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { asset: true, requestingClub: true, owningClub: true },
      });

      res.json({
        success: true,
        stats: {
          totalClubs,
          totalAssets,
          bookingStats: {
            pending: pendingRequests,
            approved: approvedRequests,
            rejected: rejectedRequests,
          },
          damageReports: totalDamageReports,
          totalPenalties: totalPenalties._sum.penalty || 0,
          recentBookings,
        },
      });
    } catch (error) {
      console.error("Get logistics stats error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default LogisticsController;
