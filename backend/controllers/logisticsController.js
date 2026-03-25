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

  // ========== AVAILABILITY ENGINE ==========

  static async checkAvailability(req, res) {
    try {
      const { assetId, startDate, endDate, quantityNeeded = 1 } = req.body;

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

      const availCheck = await this.checkAssetAvailability(
        parseInt(assetId),
        new Date(startDate),
        new Date(endDate),
        parseInt(quantityRequested),
      );

      if (!availCheck.isAvailable) {
        return res
          .status(400)
          .json({
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
          startDate: new Date(startDate),
          endDate: new Date(endDate),
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

      res
        .status(201)
        .json({
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
