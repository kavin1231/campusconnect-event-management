import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

class PresidentController {
  // student applies for club/faculty president
  static async apply(req, res) {
    try {
      const studentId = req.user.id;
      const { clubName, email } = req.body;
      if (!clubName || !email) {
        return res
          .status(400)
          .json({ success: false, message: "clubName and email are required" });
      }

      // ensure the student exists
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });
      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "Student not found" });
      }

      // check if they already have a pending application
      const existing = await prisma.presidentApplication.findFirst({
        where: { studentId, status: "PENDING" },
      });
      if (existing) {
        return res
          .status(409)
          .json({
            success: false,
            message: "You already have a pending application",
          });
      }

      const application = await prisma.presidentApplication.create({
        data: { studentId, clubName, email },
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
          student: { select: { id: true, name: true, email: true } },
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

      // generate random password
      const generated = crypto.randomBytes(6).toString("base64");
      const hashed = await bcrypt.hash(generated, 10);

      // create user account
      const user = await prisma.user.create({
        data: {
          name: app.student.name,
          email: app.email,
          password: hashed,
          role: "CLUB_PRESIDENT",
          clubName: app.clubName,
        },
      });


      // update application
      const updated = await prisma.presidentApplication.update({
        where: { id },
        data: { status: "APPROVED", approvedById: adminId },
      });

      // TODO: send email to app.email with generated password
      console.log("President account created", {
        email: app.email,
        password: generated,
      });

      res.json({
        success: true,
        application: updated,
        newUser: { id: user.id, email: user.email },
      });
    } catch (err) {
      console.error("Approve application error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async reject(req, res) {
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
        data: { status: "REJECTED", approvedById: adminId },
      });
      res.json({ success: true, application: updated });
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
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }
}


export default PresidentController;
