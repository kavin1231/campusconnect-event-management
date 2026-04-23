import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getStallCoordinate } from "../utils/stallCoordinates.js";

class PresidentController {
  static getTierByAmount(amount) {
    const numericAmount = Number(amount || 0);
    if (numericAmount >= 300000) return "PLATINUM";
    if (numericAmount >= 150000) return "GOLD";
    if (numericAmount >= 50000) return "SILVER";
    return "BRONZE";
  }

  static buildDefaultCoordinate(stallNumber) {
    return getStallCoordinate(stallNumber);
  }

  static async ensureEventStalls(eventId, db = prisma) {
    const normalizedEventId = Number(eventId);
    if (!normalizedEventId || Number.isNaN(normalizedEventId)) {
      return;
    }

    for (let stallNumber = 1; stallNumber <= 20; stallNumber += 1) {
      const { mapX, mapY } = PresidentController.buildDefaultCoordinate(stallNumber);
      await db.eventStall.upsert({
        where: {
          eventId_stallNumber: {
            eventId: normalizedEventId,
            stallNumber,
          },
        },
        create: {
          eventId: normalizedEventId,
          stallNumber,
          status: "AVAILABLE",
          mapX,
          mapY,
        },
        update: {
          mapX,
          mapY,
        },
      });
    }
  }

  static buildHttpError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  static async assignVendorToStallTx(
    db,
    { eventId, vendorId, stallId, stallNumber },
  ) {
    const normalizedEventId = Number(eventId);
    const normalizedVendorId = Number(vendorId);
    const normalizedStallId = stallId ? Number(stallId) : null;
    const normalizedStallNumber = stallNumber ? Number(stallNumber) : null;

    if (!normalizedEventId || !normalizedVendorId) {
      throw PresidentController.buildHttpError("eventId and vendorId are required", 400);
    }

    if (!normalizedStallId && !normalizedStallNumber) {
      throw PresidentController.buildHttpError("stallId or stallNumber is required", 400);
    }

    const [event, vendor] = await Promise.all([
      db.event.findUnique({ where: { id: normalizedEventId }, select: { id: true } }),
      db.vendorPartner.findUnique({
        where: { id: normalizedVendorId },
        select: { id: true, serviceCategory: true },
      }),
    ]);

    if (!event) {
      throw PresidentController.buildHttpError("Event not found", 404);
    }

    if (!vendor) {
      throw PresidentController.buildHttpError("Vendor not found", 404);
    }

    await PresidentController.ensureEventStalls(normalizedEventId, db);

    const targetStall = await db.eventStall.findFirst({
      where: {
        eventId: normalizedEventId,
        ...(normalizedStallId
          ? { id: normalizedStallId }
          : { stallNumber: normalizedStallNumber }),
      },
    });

    if (!targetStall) {
      throw PresidentController.buildHttpError("Stall not found for selected event", 404);
    }

    if (targetStall.vendorId && targetStall.vendorId !== normalizedVendorId) {
      throw PresidentController.buildHttpError(
        `Stall ${targetStall.stallNumber} is already allocated for this event`,
        409,
      );
    }

    await db.eventStall.updateMany({
      where: {
        eventId: normalizedEventId,
        vendorId: normalizedVendorId,
        id: { not: targetStall.id },
      },
      data: {
        vendorId: null,
        status: "AVAILABLE",
        serviceCategory: null,
      },
    });

    return db.eventStall.update({
      where: { id: targetStall.id },
      data: {
        vendorId: normalizedVendorId,
        status: "RESERVED",
        serviceCategory: vendor.serviceCategory || null,
      },
      include: {
        event: { select: { id: true, title: true } },
        vendor: { select: { id: true, name: true, serviceCategory: true } },
      },
    });
  }

  // student applies for club/faculty president
  static async apply(req, res) {
    try {
      const studentId = req.user.id;
      const {
        presidentName,
        candidateId,
        clubOrFacultyType,
        clubOrFacultyName,
        currentQualification,
        email,
      } = req.body;

      // Validate required fields
      if (
        !presidentName ||
        !candidateId ||
        !clubOrFacultyType ||
        !clubOrFacultyName ||
        !currentQualification ||
        !email
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required: presidentName, candidateId, clubOrFacultyType, clubOrFacultyName, currentQualification, email",
        });
      }

      // Validate clubOrFacultyType
      if (!["CLUB", "FACULTY"].includes(clubOrFacultyType)) {
        return res.status(400).json({
          success: false,
          message: 'clubOrFacultyType must be "CLUB" or "FACULTY"',
        });
      }

      // Ensure the student exists
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });
      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "Student not found" });
      }

      // Check if they already have a pending application
      const existing = await prisma.presidentApplication.findFirst({
        where: { studentId, status: "PENDING" },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "You already have a pending application",
        });
      }

      // Check if email is already used (for president account)
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already registered for president account",
        });
      }

      const application = await prisma.presidentApplication.create({
        data: {
          studentId,
          presidentName,
          candidateId,
          clubOrFacultyType,
          clubOrFacultyName,
          currentQualification,
          email,
        },
        include: { student: true },
      });

      res.status(201).json({ success: true, application });
    } catch (err) {
      console.error("President apply error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // admin views all applications (optionally filter by status)
  static async list(req, res) {
    try {
      const { status } = req.query;
      const where = status ? { status } : {};
      const apps = await prisma.presidentApplication.findMany({
        where,
        include: {
          student: {
            select: { id: true, name: true, email: true, studentId: true },
          },
          approvedBy: { select: { id: true, name: true } },
        },
        orderBy: { appliedAt: "desc" },
      });
      res.json({ success: true, applications: apps });
    } catch (err) {
      console.error("List applications error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // admin approves an application
  static async approve(req, res) {
    try {
      const adminId = req.user.id;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid application id" });
      }
      const app = await prisma.presidentApplication.findUnique({
        where: { id },
        include: { student: true },
      });
      if (!app) {
        return res
          .status(404)
          .json({ success: false, message: "Application not found" });
      }
      if (app.status !== "PENDING") {
        return res
          .status(400)
          .json({ success: false, message: "Application is not pending" });
      }

      // Generate random password
      const generated = crypto.randomBytes(6).toString("hex").toUpperCase();
      const hashed = await bcrypt.hash(generated, 10);

      // Create user account for president
      const user = await prisma.user.create({
        data: {
          name: app.presidentName,
          email: app.email,
          password: hashed,
          role: "CLUB_PRESIDENT",
          clubName: app.clubName,
          profileImage: null,
        },
      });

      // Update application status
      const updated = await prisma.presidentApplication.update({
        where: { id },
        data: {
          status: "APPROVED",
          approvedById: adminId,
          approvedRejectAt: new Date(),
        },
      });

      // Create notification alert for student with password
      await prisma.studentNotification.create({
        data: {
          studentId: app.studentId,
          type: "PRESIDENT_APPROVED",
          title: "President Application Approved ✅",
          message: `Congratulations! Your application for ${app.clubOrFacultyType === "CLUB" ? "Club" : "Faculty"} President at ${app.clubOrFacultyName} has been approved!`,
          data: JSON.stringify({
            presidentEmail: app.email,
            autoGeneratedPassword: generated,
            loginUrl: "/login",
            note: "Please save your auto-generated password. You can change it after logging in.",
          }),
          isRead: false,
        },
      });

      console.log("President account created", {
        email: app.email,
        password: generated,
        studentId: app.studentId,
      });

      res.json({
        success: true,
        message: "Application approved and notification sent to student",
        application: updated,
        newUser: {
          id: user.id,
          email: user.email,
          presidentName: app.presidentName,
          candidateId: app.candidateId,
        },
      });
    } catch (err) {
      console.error("Approve application error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // admin rejects an application
  static async reject(req, res) {
    try {
      const adminId = req.user.id;
      const id = parseInt(req.params.id);
      const { reason } = req.body;

      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid application id" });
      }

      const app = await prisma.presidentApplication.findUnique({
        where: { id },
      });
      if (!app) {
        return res
          .status(404)
          .json({ success: false, message: "Application not found" });
      }
      if (app.status !== "PENDING") {
        return res
          .status(400)
          .json({ success: false, message: "Application is not pending" });
      }

      const updated = await prisma.presidentApplication.update({
        where: { id },
        data: {
          status: "REJECTED",
          rejectionReason: reason || "Rejection reason not provided",
          approvedById: adminId,
          approvedRejectAt: new Date(),
        },
      });

      // Create notification alert for student with rejection reason
      await prisma.studentNotification.create({
        data: {
          studentId: app.studentId,
          type: "PRESIDENT_REJECTED",
          title: "President Application Rejected ❌",
          message: `Your application for ${app.clubOrFacultyType === "CLUB" ? "Club" : "Faculty"} President at ${app.clubOrFacultyName} has been rejected.`,
          data: JSON.stringify({
            reason: reason || "No reason provided",
            clubOrFacultyName: app.clubOrFacultyName,
            note: "You can apply again after 30 days or contact admin for more information.",
          }),
          isRead: false,
        },
      });

      res.json({
        success: true,
        message: "Application rejected and notification sent to student",
        application: updated,
      });
    } catch (err) {
      console.error("Reject application error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // admin creates a president directly (no application)
  static async createPresident(req, res) {
    try {
      const { name, email, clubName, password } = req.body;
      if (!name || !email || !clubName || !password) {
        return res
          .status(400)
          .json({ success: false, message: "name, email, clubName, and password are required" });
      }

      // check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email },
      });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "A user with this email already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          role: "CLUB_PRESIDENT",
          clubName,
        },
      });

      res.status(201).json({ 
        success: true, 
        message: "President created successfully",
        user: { id: user.id, name: user.name, email: user.email, clubName: user.clubName }
      });
    } catch (err) {
      console.error("Direct president creation error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  // Get student notifications
  static async getStudentNotifications(req, res) {
    try {
      const studentId = req.user.id;
      const notifications = await prisma.studentNotification.findMany({
        where: { studentId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      res.json({ success: true, notifications });
    } catch (err) {
      console.error("Get notifications error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // Mark notification as read
  static async markNotificationRead(req, res) {
    try {
      const { notificationId } = req.params;
      const notification = await prisma.studentNotification.update({
        where: { id: parseInt(notificationId) },
        data: { isRead: true },
      });
      res.json({ success: true, notification });
    } catch (err) {
      console.error("Mark notification read error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // Get student's president application status
  static async getApplicationStatus(req, res) {
    try {
      const studentId = req.user.id;
      const application = await prisma.presidentApplication.findFirst({
        where: { studentId },
        orderBy: { appliedAt: "desc" },
      });

      if (!application) {
        return res.json({
          success: true,
          hasApplication: false,
          application: null,
        });
      }

      res.json({
        success: true,
        hasApplication: true,
        application: {
          id: application.id,
          presidentName: application.presidentName,
          clubOrFacultyName: application.clubOrFacultyName,
          status: application.status,
          appliedAt: application.appliedAt,
          approvedRejectAt: application.approvedRejectAt,
          rejectionReason: application.rejectionReason,
        },
      });
    } catch (err) {
      console.error("Get application status error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // vendor management for president dashboard
  static async listVendors(req, res) {
    try {
      const { search = "", status = "ALL", serviceCategory = "ALL" } = req.query;

      const where = {};
      if (status && status !== "ALL") {
        where.status = status.toUpperCase();
      }
      if (serviceCategory && serviceCategory !== "ALL") {
        where.serviceCategory = serviceCategory;
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } },
          { serviceCategory: { contains: search, mode: "insensitive" } },
          { contactName: { contains: search, mode: "insensitive" } },
          { contactEmail: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ];
      }

      const vendors = await prisma.vendorPartner.findMany({
        where,
        include: {
          organization: { select: { id: true, name: true } },
          eventStallAllocations: {
            where: { status: "RESERVED" },
            include: { event: { select: { id: true, title: true } } },
            orderBy: { updatedAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ success: true, vendors });
    } catch (err) {
      console.error("List vendors error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async createVendor(req, res) {
    try {
      const {
        organizationId,
        name,
        companyName,
        serviceCategory,
        vendorFee,
        contactName,
        contactPhone,
        contactEmail,
        address,
        status = "ACTIVE",
        requirements,
        eventId,
        stallId,
        stallNumber,
      } = req.body;

      if (!name || !companyName || !serviceCategory || !contactName || !contactPhone || !address) {
        return res.status(400).json({
          success: false,
          message: "name, companyName, serviceCategory, contactName, contactPhone and address are required",
        });
      }

      const parsedVendorFee = Number(vendorFee ?? 0);
      if (!Number.isFinite(parsedVendorFee) || parsedVendorFee < 0) {
        return res.status(400).json({
          success: false,
          message: "vendorFee must be a non-negative number",
        });
      }

      const vendor = await prisma.$transaction(async (tx) => {
        const created = await tx.vendorPartner.create({
          data: {
            name,
            companyName,
            serviceCategory,
            vendorFee: parsedVendorFee,
            contactName,
            contactPhone,
            contactEmail: contactEmail || null,
            address,
            status,
            requirements: requirements || null,
            ...(organizationId
              ? { organization: { connect: { id: Number(organizationId) } } }
              : {}),
          },
        });

        if (eventId && (stallId || stallNumber)) {
          await PresidentController.assignVendorToStallTx(tx, {
            eventId,
            vendorId: created.id,
            stallId,
            stallNumber,
          });
        }

        return tx.vendorPartner.findUnique({
          where: { id: created.id },
          include: {
            organization: { select: { id: true, name: true } },
            eventStallAllocations: {
              where: { status: "RESERVED" },
              include: { event: { select: { id: true, title: true } } },
              orderBy: { updatedAt: "desc" },
            },
          },
        });
      });

      res.status(201).json({ success: true, vendor });
    } catch (err) {
      console.error("Create vendor error:", err);
      res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message || "Server error", error: err.message });
    }
  }

  static async updateVendor(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid vendor id" });
      }

      const {
        organizationId,
        name,
        companyName,
        serviceCategory,
        vendorFee,
        contactName,
        contactPhone,
        contactEmail,
        address,
        status,
        requirements,
        eventId,
        stallId,
        stallNumber,
      } = req.body;

      if (vendorFee !== undefined) {
        const parsedVendorFee = Number(vendorFee);
        if (!Number.isFinite(parsedVendorFee) || parsedVendorFee < 0) {
          return res.status(400).json({
            success: false,
            message: "vendorFee must be a non-negative number",
          });
        }
      }

      const vendor = await prisma.$transaction(async (tx) => {
        const updated = await tx.vendorPartner.update({
          where: { id },
          data: {
            ...(organizationId !== undefined
              ? organizationId
                ? { organization: { connect: { id: Number(organizationId) } } }
                : { organization: { disconnect: true } }
              : {}),
            ...(name !== undefined ? { name } : {}),
            ...(companyName !== undefined ? { companyName } : {}),
            ...(serviceCategory !== undefined ? { serviceCategory } : {}),
            ...(vendorFee !== undefined ? { vendorFee: Number(vendorFee) } : {}),
            ...(contactName !== undefined ? { contactName } : {}),
            ...(contactPhone !== undefined ? { contactPhone } : {}),
            ...(contactEmail !== undefined ? { contactEmail } : {}),
            ...(address !== undefined ? { address } : {}),
            ...(status !== undefined ? { status } : {}),
            ...(requirements !== undefined ? { requirements } : {}),
          },
        });

        if (serviceCategory !== undefined) {
          await tx.eventStall.updateMany({
            where: { vendorId: id, status: "RESERVED" },
            data: { serviceCategory },
          });
        }

        if (eventId && (stallId || stallNumber)) {
          await PresidentController.assignVendorToStallTx(tx, {
            eventId,
            vendorId: id,
            stallId,
            stallNumber,
          });
        }

        return tx.vendorPartner.findUnique({
          where: { id: updated.id },
          include: {
            organization: { select: { id: true, name: true } },
            eventStallAllocations: {
              where: { status: "RESERVED" },
              include: { event: { select: { id: true, title: true } } },
              orderBy: { updatedAt: "desc" },
            },
          },
        });
      });

      res.json({ success: true, vendor });
    } catch (err) {
      console.error("Update vendor error:", err);
      res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message || "Server error", error: err.message });
    }
  }

  static async deleteVendor(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid vendor id" });
      }

      await prisma.$transaction([
        prisma.stallSlot.updateMany({ where: { vendorId: id }, data: { vendorId: null } }),
        prisma.eventStall.updateMany({
          where: { vendorId: id },
          data: { vendorId: null, status: "AVAILABLE", serviceCategory: null },
        }),
        prisma.vendorPartner.delete({ where: { id } }),
      ]);

      res.json({ success: true, message: "Vendor deleted successfully" });
    } catch (err) {
      console.error("Delete vendor error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async getStallsByEvent(req, res) {
    try {
      const eventId = Number(req.query.eventId);
      const { status = "ALL", serviceCategory = "ALL", search = "" } = req.query;

      if (!eventId || Number.isNaN(eventId)) {
        return res.status(400).json({ success: false, message: "Valid eventId is required" });
      }

      await PresidentController.ensureEventStalls(eventId);

      const where = { eventId };

      if (status && status !== "ALL") {
        where.status = status.toUpperCase();
      }

      if (serviceCategory && serviceCategory !== "ALL") {
        where.serviceCategory = serviceCategory;
      }

      if (search) {
        const searchText = String(search).trim();
        const parsedNumber = Number(searchText);
        where.OR = [
          { vendor: { name: { contains: searchText, mode: "insensitive" } } },
          ...(Number.isNaN(parsedNumber) ? [] : [{ stallNumber: parsedNumber }]),
        ];
      }

      const stalls = await prisma.eventStall.findMany({
        where,
        include: {
          vendor: { select: { id: true, name: true, serviceCategory: true } },
          event: { select: { id: true, title: true } },
        },
        orderBy: { stallNumber: "asc" },
      });

      res.json({ success: true, stalls });
    } catch (err) {
      console.error("Get stalls by event error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async getAvailableStallsByEvent(req, res) {
    try {
      const eventId = Number(req.query.eventId);
      const vendorId = req.query.vendorId ? Number(req.query.vendorId) : null;

      if (!eventId || Number.isNaN(eventId)) {
        return res.status(400).json({ success: false, message: "Valid eventId is required" });
      }

      await PresidentController.ensureEventStalls(eventId);

      const currentVendorStall = vendorId
        ? await prisma.eventStall.findFirst({
            where: { eventId, vendorId },
            select: { id: true },
          })
        : null;

      const stalls = await prisma.eventStall.findMany({
        where: {
          eventId,
          OR: [
            { status: "AVAILABLE" },
            ...(currentVendorStall ? [{ id: currentVendorStall.id }] : []),
          ],
        },
        select: {
          id: true,
          stallNumber: true,
          status: true,
          vendorId: true,
          serviceCategory: true,
        },
        orderBy: { stallNumber: "asc" },
      });

      res.json({ success: true, stalls });
    } catch (err) {
      console.error("Get available stalls error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async assignStallToVendor(req, res) {
    try {
      const { eventId, vendorId, stallId, stallNumber } = req.body;

      const allocation = await prisma.$transaction(async (tx) => {
        return PresidentController.assignVendorToStallTx(tx, {
          eventId,
          vendorId,
          stallId,
          stallNumber,
        });
      });

      res.status(201).json({ success: true, allocation });
    } catch (err) {
      console.error("Assign stall error:", err);
      res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message || "Server error", error: err.message });
    }
  }

  static async updateStallAllocation(req, res) {
    try {
      const stallId = Number(req.params.stallId);
      const { vendorId } = req.body;

      if (!stallId || Number.isNaN(stallId)) {
        return res.status(400).json({ success: false, message: "Invalid stall id" });
      }

      const currentStall = await prisma.eventStall.findUnique({
        where: { id: stallId },
        select: { id: true, eventId: true },
      });

      if (!currentStall) {
        return res.status(404).json({ success: false, message: "Stall not found" });
      }

      if (!vendorId) {
        const released = await prisma.eventStall.update({
          where: { id: stallId },
          data: { vendorId: null, status: "AVAILABLE", serviceCategory: null },
          include: {
            event: { select: { id: true, title: true } },
            vendor: { select: { id: true, name: true, serviceCategory: true } },
          },
        });

        return res.json({ success: true, allocation: released });
      }

      const allocation = await prisma.$transaction(async (tx) => {
        return PresidentController.assignVendorToStallTx(tx, {
          eventId: currentStall.eventId,
          vendorId,
          stallId,
        });
      });

      res.json({ success: true, allocation });
    } catch (err) {
      console.error("Update stall allocation error:", err);
      res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message || "Server error", error: err.message });
    }
  }

  static async releaseStall(req, res) {
    try {
      const stallId = Number(req.params.stallId);
      if (!stallId || Number.isNaN(stallId)) {
        return res.status(400).json({ success: false, message: "Invalid stall id" });
      }

      const released = await prisma.eventStall.update({
        where: { id: stallId },
        data: { vendorId: null, status: "AVAILABLE", serviceCategory: null },
        include: {
          event: { select: { id: true, title: true } },
          vendor: { select: { id: true, name: true, serviceCategory: true } },
        },
      });

      res.json({ success: true, allocation: released });
    } catch (err) {
      console.error("Release stall error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async getStallMapData(req, res) {
    try {
      const eventId = Number(req.query.eventId);
      if (!eventId || Number.isNaN(eventId)) {
        return res.status(400).json({ success: false, message: "Valid eventId is required" });
      }

      await PresidentController.ensureEventStalls(eventId);

      const stalls = await prisma.eventStall.findMany({
        where: { eventId },
        include: {
          event: { select: { id: true, title: true } },
          vendor: { select: { id: true, name: true, serviceCategory: true } },
        },
        orderBy: { stallNumber: "asc" },
      });

      res.json({ success: true, stalls });
    } catch (err) {
      console.error("Get stall map data error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async listSponsorships(req, res) {
    try {
      const {
        search = "",
        eventId,
        sponsorTier = "ALL",
        paymentStatus = "ALL",
        status = "ALL",
      } = req.query;

      const where = {};

      if (eventId) {
        where.eventId = Number(eventId);
      }

      if (sponsorTier && sponsorTier !== "ALL") {
        where.sponsorTier = sponsorTier.toUpperCase();
      }

      if (paymentStatus && paymentStatus !== "ALL") {
        where.paymentStatus = paymentStatus.toUpperCase();
      }

      if (status && status !== "ALL") {
        where.status = status.toUpperCase();
      }

      if (search) {
        where.OR = [
          { sponsorName: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } },
          { contactPerson: { contains: search, mode: "insensitive" } },
          { sponsorEmail: { contains: search, mode: "insensitive" } },
        ];
      }

      const sponsorships = await prisma.sponsorshipLead.findMany({
        where,
        include: {
          event: { select: { id: true, title: true } },
          organization: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const summary = sponsorships.reduce(
        (acc, sponsorship) => {
          const amount = Number(sponsorship.sponsorshipAmount || 0);
          acc.totalSponsors += 1;
          acc.totalAmount += amount;
          if ((sponsorship.paymentStatus || "").toUpperCase() === "PAID") {
            acc.paidSponsors += 1;
          }
          if ((sponsorship.status || "").toUpperCase() === "ACTIVE") {
            acc.activeSponsors += 1;
          }
          return acc;
        },
        { totalSponsors: 0, totalAmount: 0, paidSponsors: 0, activeSponsors: 0 },
      );

      res.json({ success: true, sponsorships, summary });
    } catch (err) {
      console.error("List sponsorships error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async createSponsorship(req, res) {
    try {
      const {
        sponsorName,
        companyName,
        contactPerson,
        contactPhone,
        sponsorEmail,
        eventId,
        sponsorshipAmount,
        sponsorshipType,
        paymentStatus = "PENDING",
        notes,
        status = "ACTIVE",
        organizationId,
      } = req.body;

      if (
        !sponsorName ||
        !companyName ||
        !contactPerson ||
        !contactPhone ||
        !sponsorEmail ||
        !eventId
      ) {
        return res.status(400).json({
          success: false,
          message: "sponsorName, companyName, contactPerson, contactPhone, sponsorEmail and eventId are required",
        });
      }

      const amount = Number(sponsorshipAmount || 0);
      if (Number.isNaN(amount) || amount < 0) {
        return res.status(400).json({ success: false, message: "Invalid sponsorship amount" });
      }

      const tier = PresidentController.getTierByAmount(amount);

      const sponsorship = await prisma.sponsorshipLead.create({
        data: {
          sponsorName,
          companyName,
          contactPerson,
          contactPhone,
          sponsorEmail,
          eventId: Number(eventId),
          sponsorshipAmount: amount,
          sponsorshipType: sponsorshipType || null,
          paymentStatus: paymentStatus.toUpperCase(),
          sponsorTier: tier,
          status: status.toUpperCase(),
          notes: notes || null,
          packageTier: tier,
          confirmedValue: amount,
          managedById: req.user.id,
          organizationId: organizationId ? Number(organizationId) : null,
        },
        include: {
          event: { select: { id: true, title: true } },
          organization: { select: { id: true, name: true } },
        },
      });

      res.status(201).json({ success: true, sponsorship });
    } catch (err) {
      console.error("Create sponsorship error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async updateSponsorship(req, res) {
    try {
      const id = Number(req.params.id);
      if (!id || Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid sponsorship id" });
      }

      const existing = await prisma.sponsorshipLead.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Sponsorship not found" });
      }

      const amount =
        req.body.sponsorshipAmount !== undefined
          ? Number(req.body.sponsorshipAmount)
          : Number(existing.sponsorshipAmount || 0);

      if (Number.isNaN(amount) || amount < 0) {
        return res.status(400).json({ success: false, message: "Invalid sponsorship amount" });
      }

      const tier = PresidentController.getTierByAmount(amount);

      const sponsorship = await prisma.sponsorshipLead.update({
        where: { id },
        data: {
          ...(req.body.sponsorName !== undefined ? { sponsorName: req.body.sponsorName } : {}),
          ...(req.body.companyName !== undefined ? { companyName: req.body.companyName } : {}),
          ...(req.body.contactPerson !== undefined ? { contactPerson: req.body.contactPerson } : {}),
          ...(req.body.contactPhone !== undefined ? { contactPhone: req.body.contactPhone } : {}),
          ...(req.body.sponsorEmail !== undefined ? { sponsorEmail: req.body.sponsorEmail } : {}),
          ...(req.body.eventId !== undefined ? { eventId: Number(req.body.eventId) } : {}),
          sponsorshipAmount: amount,
          ...(req.body.sponsorshipType !== undefined ? { sponsorshipType: req.body.sponsorshipType } : {}),
          ...(req.body.paymentStatus !== undefined
            ? { paymentStatus: String(req.body.paymentStatus).toUpperCase() }
            : {}),
          ...(req.body.notes !== undefined ? { notes: req.body.notes } : {}),
          ...(req.body.status !== undefined ? { status: String(req.body.status).toUpperCase() } : {}),
          sponsorTier: tier,
          packageTier: tier,
          confirmedValue: amount,
          ...(req.body.organizationId !== undefined
            ? {
                organizationId: req.body.organizationId
                  ? Number(req.body.organizationId)
                  : null,
              }
            : {}),
          managedById: req.user.id,
        },
        include: {
          event: { select: { id: true, title: true } },
          organization: { select: { id: true, name: true } },
        },
      });

      res.json({ success: true, sponsorship });
    } catch (err) {
      console.error("Update sponsorship error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async deleteSponsorship(req, res) {
    try {
      const id = Number(req.params.id);
      if (!id || Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid sponsorship id" });
      }

      await prisma.sponsorshipLead.delete({ where: { id } });
      res.json({ success: true, message: "Sponsorship deleted successfully" });
    } catch (err) {
      console.error("Delete sponsorship error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
}


export default PresidentController;
