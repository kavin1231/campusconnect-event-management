import prisma from "../prisma/client.js";
import {
  validateAsset,
  validateAssetRequest,
  validateQuantityAvailability,
  validateDateRange,
  sanitizeInput,
} from "../utils/logisticsValidations.js";

const normalizeBookingStatus = (status) =>
  String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

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
      const { status, search, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status.toUpperCase();
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const assets = await prisma.asset.findMany({
        where,
        include: {
          club: { select: { id: true, name: true } },
          _count: { select: { bookings: true } },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.asset.count({ where });

      const bookingsForAssets = await prisma.assetBooking.findMany({
        where: {
          assetId: { in: assets.map((asset) => asset.id) },
        },
        select: {
          assetId: true,
          status: true,
          quantityRequested: true,
        },
      });

      const bookedQuantityByAsset = bookingsForAssets.reduce(
        (accumulator, booking) => {
          const normalizedStatus = normalizeBookingStatus(booking.status);
          if (!["APPROVED", "CHECKED_OUT"].includes(normalizedStatus)) {
            return accumulator;
          }
          accumulator[booking.assetId] =
            (accumulator[booking.assetId] || 0) + booking.quantityRequested;
          return accumulator;
        },
        {},
      );

      const formattedAssets = assets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        description: asset.description,
        category: asset.description || "",
        condition: "Good",
        ownerId: asset.ownerId,
        club: asset.club?.name || "Unknown",
        owner: asset.club,
        status: asset.status,
        quantity: asset.quantity,
        available: Math.max(
          0,
          asset.quantity - (bookedQuantityByAsset[asset.id] || 0),
        ),
        availableQty: Math.max(
          0,
          asset.quantity - (bookedQuantityByAsset[asset.id] || 0),
        ),
        bookingCount: asset._count.bookings,
        createdAt: asset.createdAt,
      }));

      res.json({
        success: true,
        assets: formattedAssets,
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
      const { name, description, ownerId, quantity, imageUrl } = req.body;
      const userId = req.user?.id || req.userId;

      // Validate input
      const validation = validateAsset({
        name,
        description,
        quantity,
        imageUrl,
      });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }

      // Use provided ownerId or fallback to current user
      const assignedOwnerId = ownerId ? parseInt(ownerId) : userId;

      const asset = await prisma.asset.create({
        data: {
          name: sanitizeInput(name),
          description: sanitizeInput(description),
          imageUrl:
            imageUrl ||
            "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?auto=format&fit=crop&q=80&w=400",
          ownerId: assignedOwnerId,
          quantity: parseInt(quantity),
          status: "AVAILABLE",
        },
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
      const { name, description, status, quantity } = req.body;

      const asset = await prisma.asset.update({
        where: { id: parseInt(assetId) },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(status && { status }),
          ...(quantity !== undefined &&
            quantity !== null && { quantity: parseInt(quantity) }),
        },
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
          club: { select: { id: true, name: true } },
          _count: { select: { bookings: true } },
        },
      });

      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }

      const bookingsForAsset = await prisma.assetBooking.findMany({
        where: {
          assetId: asset.id,
        },
        select: {
          status: true,
          quantityRequested: true,
        },
      });

      const bookedQuantity = bookingsForAsset.reduce((sum, booking) => {
        const normalizedStatus = normalizeBookingStatus(booking.status);
        if (!["APPROVED", "CHECKED_OUT"].includes(normalizedStatus)) {
          return sum;
        }
        return sum + booking.quantityRequested;
      }, 0);
      const availableQuantity = Math.max(0, asset.quantity - bookedQuantity);

      const formattedAsset = {
        id: asset.id,
        name: asset.name,
        description: asset.description,
        category: asset.description || "",
        condition: "Good",
        ownerId: asset.ownerId,
        club: asset.club?.name || "Unknown",
        owner: asset.club,
        status: asset.status,
        quantity: asset.quantity,
        available: availableQuantity,
        availableQty: availableQuantity,
        bookingCount: asset._count.bookings,
        createdAt: asset.createdAt,
      };

      res.json({ success: true, asset: formattedAsset });
    } catch (error) {
      console.error("Get asset by id error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== AVAILABILITY ENGINE ==========

  static async checkAvailability(req, res) {
    try {
      const { assetId, startDate, endDate } = req.body;

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
      });

      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }

      // Check for conflicting bookings during the requested timeframe
      const conflictingBooking = await prisma.assetBooking.findFirst({
        where: {
          assetId: parseInt(assetId),
          status: { in: ["APPROVED", "CHECKED_OUT"] },
          OR: [
            {
              startDate: { lte: new Date(endDate) },
              endDate: { gte: new Date(startDate) },
            },
          ],
        },
      });

      const isAvailable = !conflictingBooking;

      res.json({
        success: true,
        isAvailable,
        assetId: asset.id,
        assetName: asset.name,
      });
    } catch (error) {
      console.error("Check availability error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== BOOKING MANAGEMENT ==========

  static async createBooking(req, res) {
    try {
      const { assetId, requesterId, startDate, endDate } = req.body;
      const userId = req.user?.id;

      // Use provided requesterId or current user
      const assignedRequesterId = requesterId ? parseInt(requesterId) : userId;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!assetId || !assignedRequesterId) {
        return res.status(400).json({
          success: false,
          message: "assetId and requesterId are required",
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

      // Verify asset exists
      const asset = await prisma.asset.findUnique({
        where: { id: parseInt(assetId) },
      });

      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }

      const booking = await prisma.assetBooking.create({
        data: {
          assetId: parseInt(assetId),
          requesterId: assignedRequesterId,
          startDate: start,
          endDate: end,
          status: "PENDING",
        },
        include: {
          asset: { select: { id: true, name: true, description: true } },
          requester: { select: { id: true, name: true, email: true } },
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

      // Comprehensive validation
      const validation = validateAssetRequest({
        quantity,
        neededDate,
        returnDate,
        purpose,
        contact,
      });

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }

      // Verify user is authenticated
      if (!req.user || !req.user.id) {
        console.error("User not authenticated or missing user ID");
        return res.status(401).json({
          success: false,
          message: "User authentication failed",
        });
      }

      const start = new Date(neededDate);
      const end = new Date(returnDate);
      const qty = parseInt(quantity);

      // Find asset
      const asset = await prisma.asset.findUnique({
        where: { id: parseInt(assetId) },
        include: { club: true },
      });

      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }

      // Check quantity availability
      const quantityCheck = validateQuantityAvailability(asset.quantity, qty);
      if (!quantityCheck.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: quantityCheck.errors,
          availableQuantity: asset.quantity,
        });
      }

      // Check date availability
      const availability = await LogisticsController.checkAssetAvailability(
        asset.id,
        start,
        end,
        qty,
      );

      if (!availability.isAvailable) {
        return res.status(400).json({
          success: false,
          message: "Asset not available for requested dates",
          reason: availability.reason,
          availableQuantity: availability.availableQuantity,
        });
      }

      // Get requesting user's club through club memberships
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true },
      });

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "Current user not found",
        });
      }

      // Get user's primary club membership if any
      let userClubId = null;
      const userClubMembership = await prisma.clubMember.findFirst({
        where: { userId: req.user.id },
        select: { clubId: true },
      });

      if (userClubMembership) {
        userClubId = userClubMembership.clubId;
      }

      // Create booking request
      try {
        const booking = await prisma.assetBooking.create({
          data: {
            assetId: asset.id,
            requestingClubId: userClubId,
            owningClubId: asset.clubId,
            requesterId: req.user.id,
            quantityRequested: qty,
            startDate: start,
            endDate: end,
            purpose: sanitizeInput(purpose),
            status: "PENDING",
          },
          include: {
            asset: { select: { id: true, name: true, description: true } },
            requester: { select: { id: true, name: true, email: true } },
          },
        });

        res
          .status(201)
          .json({ success: true, message: "Booking request created", booking });
      } catch (bookingError) {
        console.error("Booking creation error:", bookingError);
        throw bookingError;
      }
    } catch (error) {
      console.error("Asset request error:", error);
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

      // Admins see all requests, others see only their own
      const where = {};

      // Only filter by user if not an admin
      if (req.user.role !== "SYSTEM_ADMIN") {
        where.requesterId = req.user.id;
      }

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
          asset: { select: { id: true, name: true, description: true } },
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
          asset: b.asset.name, // Return just the asset name as string
          assetDetails: {
            id: b.asset.id,
            name: b.asset.name,
            description: b.asset.description,
          },
          owner: b.requester.name, // Return just the requester name as string
          ownerEmail: b.requester.email, // Include email separately if needed
          ownerDetails: {
            id: b.requester.id,
            name: b.requester.name,
            email: b.requester.email,
          },
          club: b.owningClub?.name || "Unknown Club", // Return just the club name as string
          clubDetails: b.owningClub, // Full club object for reference
          quantity: b.quantityRequested,
          quantityRequested: b.quantityRequested,
          status: statusLabel,
          neededDate: dateToString(b.startDate),
          returnDate: dateToString(b.endDate),
          startDate: dateToString(b.startDate),
          endDate: dateToString(b.endDate),
          requestDate: dateToString(b.createdAt),
          createdAt: dateToString(b.createdAt),
          approvedAt: dateToString(b.approvedAt),
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
          asset: { select: { id: true, name: true, description: true } },
          requester: { select: { id: true, name: true, email: true } },
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

      const booking = await prisma.assetBooking.update({
        where: { id: parseInt(bookingId) },
        data: {
          status: "REJECTED",
        },
        include: {
          asset: { select: { id: true, name: true, description: true } },
          requester: { select: { id: true, name: true, email: true } },
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
    requestedQuantity,
  ) {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset)
      return {
        isAvailable: false,
        reason: "Asset not found",
        availableQuantity: 0,
      };

    // Check quantity available
    if (asset.quantity < requestedQuantity) {
      return {
        isAvailable: false,
        reason: "Insufficient quantity available",
        availableQuantity: asset.quantity,
      };
    }

    // Check if there are any conflicting approved or checked out bookings
    const conflictingBookings = await prisma.assetBooking.findMany({
      where: {
        assetId: assetId,
        status: { in: ["APPROVED", "CHECKED_OUT"] },
        OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
      },
    });

    // Calculate available quantity after accounting for active bookings
    let bookedQuantity = 0;
    for (const booking of conflictingBookings) {
      bookedQuantity += booking.quantityRequested;
    }

    const availableQuantity = asset.quantity - bookedQuantity;

    return {
      isAvailable: availableQuantity >= requestedQuantity,
      reason:
        availableQuantity < requestedQuantity
          ? "Insufficient quantity available for the requested period"
          : null,
      availableQuantity: Math.max(0, availableQuantity),
    };
  }

  // ========== ADMIN ANALYTICS ==========

  static async getLogisticsStats(req, res) {
    try {
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
      const checkedOutRequests = await prisma.assetBooking.count({
        where: { status: "CHECKED_OUT" },
      });
      const returnedRequests = await prisma.assetBooking.count({
        where: { status: "RETURNED" },
      });

      const recentBookings = await prisma.assetBooking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          asset: { select: { id: true, name: true, description: true } },
          requester: { select: { id: true, name: true, email: true } },
        },
      });

      res.json({
        success: true,
        stats: {
          totalAssets,
          bookingStats: {
            pending: pendingRequests,
            approved: approvedRequests,
            rejected: rejectedRequests,
            checkedOut: checkedOutRequests,
            returned: returnedRequests,
          },
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
