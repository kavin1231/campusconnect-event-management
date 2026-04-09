import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

class PresidentController {
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
        contactName,
        contactPhone,
        contactEmail,
        address,
        status = "ACTIVE",
        requirements,
      } = req.body;

      if (!name || !companyName || !serviceCategory || !contactName || !contactPhone || !address) {
        return res.status(400).json({
          success: false,
          message: "name, companyName, serviceCategory, contactName, contactPhone and address are required",
        });
      }

      const vendor = await prisma.vendorPartner.create({
        data: {
          name,
          companyName,
          serviceCategory,
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
        include: {
          organization: { select: { id: true, name: true } },
        },
      });

      res.status(201).json({ success: true, vendor });
    } catch (err) {
      console.error("Create vendor error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
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
        contactName,
        contactPhone,
        contactEmail,
        address,
        status,
        requirements,
      } = req.body;

      const vendor = await prisma.vendorPartner.update({
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
          ...(contactName !== undefined ? { contactName } : {}),
          ...(contactPhone !== undefined ? { contactPhone } : {}),
          ...(contactEmail !== undefined ? { contactEmail } : {}),
          ...(address !== undefined ? { address } : {}),
          ...(status !== undefined ? { status } : {}),
          ...(requirements !== undefined ? { requirements } : {}),
        },
        include: {
          organization: { select: { id: true, name: true } },
        },
      });

      res.json({ success: true, vendor });
    } catch (err) {
      console.error("Update vendor error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
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
        prisma.vendorPartner.delete({ where: { id } }),
      ]);

      res.json({ success: true, message: "Vendor deleted successfully" });
    } catch (err) {
      console.error("Delete vendor error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
}


export default PresidentController;
