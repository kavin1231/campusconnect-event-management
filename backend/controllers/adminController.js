import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";

class AdminController {
  // Create a new staff user (e.g. EVENT_ORGANIZER, SYSTEM_ADMIN, CLUB_PRESIDENT)
  static async createUser(req, res) {
    try {
      const { name, email, password, role, profileImage, clubId, clubRole } =
        req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "name, email, password and role are required",
        });
      }

      // Only allow non-student roles here
      const allowedRoles = [
        "EVENT_ORGANIZER",
        "SYSTEM_ADMIN",
        "CLUB_PRESIDENT",
      ];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `role must be one of: ${allowedRoles.join(", ")}`,
        });
      }

      const emailExists = await UserModel.emailExists(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        name,
        email,
        password: hashed,
        role,
        profileImage: profileImage || null,
        clubId: clubId ?? null,
        clubRole: clubRole ?? null,
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Create admin/organizer error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
}

export default AdminController;
