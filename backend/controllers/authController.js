import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import StudentModel from "../models/studentModel.js";
import UserModel from "../models/userModel.js";
import prisma from "../prisma/client.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

class AuthController {
  // Register new student
  static async register(req, res) {
    try {
      const { name, email, password, studentId, department, year } = req.body;

      // Validation
      if (!name || !email || !password || !studentId || !department || !year) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Check if email already exists in User OR Student table
      const userEmailExists = await UserModel.emailExists(email);
      const studentEmailExists = await StudentModel.emailExists(email);

      if (userEmailExists || studentEmailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Check if studentId already exists
      const studentIdExists = await StudentModel.studentIdExists(studentId);
      if (studentIdExists) {
        return res.status(409).json({
          success: false,
          message: "Student ID already registered",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create student
      const student = await StudentModel.create({
        name,
        email,
        password: hashedPassword,
        studentId,
        department,
        year: parseInt(year),
      });

      // Generate JWT token including role
      const token = jwt.sign(
        {
          id: student.id,
          email: student.email,
          role: "STUDENT",
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.status(201).json({
        success: true,
        message: "Student registered successfully",
        token,
        user: {
          id: student.id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          role: "STUDENT",
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
        error: error.message,
      });
    }
  }

  // Unified login for all roles
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      let userData = null;
      let role = null;

      // 1. Check User table (Admin/Organizer)
      const user = await UserModel.findByEmail(email);
      if (user) {
        userData = user;
        role = user.role;
      } else {
        // 2. Check Student table
        const student = await StudentModel.findByEmail(email);
        if (student) {
          userData = student;
          role = "STUDENT";
        }
      }

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // For CLUB_PRESIDENT, we must ensure the token payload uses their Student.id
      // so student-facing dashboards work correctly.
      let operationalId = userData.id;
      if (role === "CLUB_PRESIDENT") {
        const student = await StudentModel.findByEmail(email);
        if (student) {
          operationalId = student.id;
        }
      }

      // Generate JWT token with role
      const token = jwt.sign(
        {
          id: operationalId,
          email: userData.email,
          role: role,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      // Fetch additional student metadata for hybrid accounts
      let studentMetadata = {};
      if (role === "CLUB_PRESIDENT" || role === "STUDENT") {
        const student = await StudentModel.findByEmail(email);
        if (student) {
          studentMetadata = {
            studentId: student.studentId,
            department: student.department,
            year: student.year,
          };
        }
      }

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: operationalId,
          name: userData.name,
          email: userData.email,
          role: role,
          entityName: userData.clubOrFacultyName || undefined,
          ...studentMetadata,
        },
      });
    } catch (error) {
      console.error("Login error full:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const email = req.user.email;

      // Try to find both Student and User records
      const [studentEntry, userEntry] = await Promise.all([
        StudentModel.findByEmail(email),
        UserModel.findByEmail(email),
      ]);

      if (!studentEntry && !userEntry) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Merge data for hybrid accounts (e.g. Club President)
      const isPresident = userEntry && userEntry.role === "CLUB_PRESIDENT";
      const role = userEntry ? userEntry.role : "STUDENT";
      const entityName = userEntry ? userEntry.clubOrFacultyName : undefined;

      const profileData = {
        id: studentEntry ? studentEntry.id : userEntry ? userEntry.id : null,
        name: userEntry
          ? userEntry.name
          : studentEntry
            ? studentEntry.name
            : "",
        email: email,
        role: role,
        entityName: entityName,
        profileImage: (userEntry && userEntry.profileImage) 
          ? userEntry.profileImage 
          : (studentEntry && studentEntry.profileImage) 
            ? studentEntry.profileImage 
            : null,
        createdAt: userEntry
          ? userEntry.createdAt
          : studentEntry
            ? studentEntry.createdAt
            : null,
        // Student specific fields
        studentId: studentEntry ? studentEntry.studentId : undefined,
        department: studentEntry ? studentEntry.department : undefined,
        year: studentEntry ? studentEntry.year : undefined,
      };

      return res.status(200).json({
        success: true,
        profile: profileData,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Server error",
          error: error.message,
        });
    }
  }

  // Update student profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;

      if (role !== "STUDENT" && role !== "CLUB_PRESIDENT") {
        return res
          .status(403)
          .json({
            success: false,
            message:
              "Only students and presidents can update student profiles.",
          });
      }

      const { name, department, year, profileImage } = req.body;

      if (!name || !department || !year) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Name, department, and year are required.",
          });
      }

      // Find the records to update by email to avoid ID mismatches for hybrid accounts
      const userEmail = req.user.email;
      const [studentEntry, userEntry] = await Promise.all([
        StudentModel.findByEmail(userEmail),
        UserModel.findByEmail(userEmail),
      ]);

      let updated = null;

      // Update Student record if it exists
      if (studentEntry) {
        updated = await StudentModel.update(studentEntry.id, {
          name,
          department,
          year: parseInt(year),
          profileImage,
        });
      }

      // Update User record if it exists (keep data in sync)
      if (userEntry) {
        await UserModel.update(userEntry.id, {
          name,
          profileImage,
        });
        
        // If they updated from a User-only account, use this as 'updated' for response
        if (!updated) {
          updated = userEntry;
          updated.name = name;
          updated.profileImage = profileImage;
        }
      }

      if (!updated) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        profile: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          studentId: updated.studentId,
          department: updated.department,
          year: updated.year,
          profileImage: updated.profileImage,
          createdAt: updated.createdAt,
          role: role, // Return actual role
        },
      });
    } catch (error) {
      console.error("Update profile error details:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Server error",
          error: error.message,
        });
    }
  }

  // Change password for both Student and User
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Current and new passwords are required",
          });
      }

      let userData = null;
      let Model = null;

      if (role === "STUDENT") {
        userData = await StudentModel.findById(userId);
        Model = StudentModel;
      } else {
        userData = await UserModel.findById(userId);
        Model = UserModel;
      }

      if (!userData) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        userData.password,
      );
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect current password" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password in the current role's model
      await Model.update(userId, { password: hashedPassword });

      // If they are a student AND a club president, we must sync the password in the OTHER table
      if (role === "CLUB_PRESIDENT") {
        const student = await StudentModel.findByEmail(userData.email);
        if (student) {
          await StudentModel.update(student.id, { password: hashedPassword });
        }
      } else if (role === "STUDENT") {
        const user = await UserModel.findByEmail(userData.email);
        if (user && user.role === "CLUB_PRESIDENT") {
          await UserModel.update(user.id, { password: hashedPassword });
        }
      }

      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Server error during password change",
          error: error.message,
        });
    }
  }

  // Get all students (Admin only)
  static async getAllStudents(req, res) {
    try {
      const students = await StudentModel.findAll();
      res.status(200).json({
        success: true,
        students,
      });
    } catch (error) {
      console.error("Get all students error:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching students",
        error: error.message,
      });
    }
  }

  // Get all users (Staff + Students) (Admin only)
  static async getAllUsers(req, res) {
    try {
      const staff = await UserModel.findAll();
      const students = await StudentModel.findAll();

      // Combine them
      const allUsers = [
        ...staff.map((u) => ({ ...u })),
        ...students.map((s) => ({ ...s, role: "STUDENT" })),
      ];

      res.status(200).json({
        success: true,
        users: allUsers,
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching all users",
        error: error.message,
      });
    }
  }

  // Assign a student to a role (e.g. Club President)
  static async assignRole(req, res) {
    try {
      const { studentId, role, clubOrFacultyName, clubOrFacultyType } =
        req.body;

      if (!studentId || !role) {
        return res.status(400).json({
          success: false,
          message: "Student ID and role are required",
        });
      }

      // 1. Find the student
      const student = await prisma.student.findUnique({
        where: { id: parseInt(studentId) },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // 1.1 Prevent Event Organizers from becoming Presidents
      if (role === "CLUB_PRESIDENT") {
        const existingUser = await prisma.user.findUnique({
          where: { email: student.email },
        });
        if (existingUser && existingUser.role === "EVENT_ORGANIZER") {
          return res.status(400).json({
            success: false,
            message: "Event Organizers cannot be assigned as Club Presidents.",
          });
        }
      }

      // 2. Check if user record already exists for this email
      let user = await prisma.user.findUnique({
        where: { email: student.email },
      });

      if (user) {
        // Update existing user role and club info
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            role,
            clubOrFacultyName,
            clubOrFacultyType,
          },
        });
      } else {
        // Create new user record from student data
        user = await prisma.user.create({
          data: {
            name: student.name,
            email: student.email,
            password: student.password, // Reuse student password for simplicity
            role,
            clubOrFacultyName,
            clubOrFacultyType,
            profileImage: student.profileImage,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: `Successfully assigned ${student.name} as ${role} for ${clubOrFacultyName}`,
        user,
      });
    } catch (error) {
      console.error("Assign role error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during role assignment",
        error: error.message,
      });
    }
  }

  // Revoke role (demote back to student)
  static async revokeRole(req, res) {
    const { userId } = req.body;
    try {
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (user.role === "SYSTEM_ADMIN") {
        return res
          .status(400)
          .json({ success: false, message: "Cannot revoke System Admin role" });
      }

      // Update user role to STUDENT and clear organizational data
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          role: "STUDENT",
          clubOrFacultyName: null,
          clubOrFacultyType: null,
        },
      });

      res.status(200).json({
        success: true,
        message: `Successfully revoked ${user.role} role from ${user.name}`,
      });
    } catch (error) {
      console.error("Revoke role error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during role revocation",
        error: error.message,
      });
    }
  }

  // Create new user directly (Admin only)
  static async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Check if email exists
      const emailExists = await UserModel.emailExists(email);
      const studentEmailExists = await StudentModel.emailExists(email);

      if (emailExists || studentEmailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).json({
        success: true,
        message: "Staff user created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during user creation",
        error: error.message,
      });
    }
  }

  // Get user by ID (Admin only)
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query; // 'student' or 'staff'

      let userData = null;
      if (type === "student") {
        userData = await StudentModel.findById(parseInt(id));
      } else {
        userData = await UserModel.findById(parseInt(id));
      }

      if (!userData) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        user: userData,
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching user",
        error: error.message,
      });
    }
  }

  // Delete user (Admin only)
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query; // 'student' or 'staff'

      if (!id || !type) {
        return res.status(400).json({
          success: false,
          message: "User ID and type are required",
        });
      }

      const userId = parseInt(id);

      if (type === "student") {
        const student = await StudentModel.findById(userId);
        if (!student) {
          return res.status(404).json({
            success: false,
            message: "Student not found",
          });
        }

        // If they are also in User table (e.g. Club President), delete that record too
        const user = await UserModel.findByEmail(student.email);
        if (user) {
          if (user.role === "SYSTEM_ADMIN") {
            return res.status(400).json({
              success: false,
              message: "Cannot delete a student who is a System Admin",
            });
          }
          await UserModel.delete(user.id);
        }

        await StudentModel.delete(userId);
      } else {
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "Staff user not found",
          });
        }

        if (user.role === "SYSTEM_ADMIN") {
          return res.status(400).json({
            success: false,
            message: "Cannot delete System Admin",
          });
        }

        await UserModel.delete(userId);
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error deleting user",
        error: error.message,
      });
    }
  }
}

export default AuthController;
