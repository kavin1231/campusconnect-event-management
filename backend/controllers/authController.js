import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import StudentModel from '../models/studentModel.js';
import UserModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class AuthController {
  // Register new student
  static async register(req, res) {
    try {
      const { name, email, password, studentId, department, year } = req.body;

      // Validation
      if (!name || !email || !password || !studentId || !department || !year) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Check if email already exists in User OR Student table
      const userEmailExists = await UserModel.emailExists(email);
      const studentEmailExists = await StudentModel.emailExists(email);

      if (userEmailExists || studentEmailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Check if studentId already exists
      const studentIdExists = await StudentModel.studentIdExists(studentId);
      if (studentIdExists) {
        return res.status(409).json({
          success: false,
          message: 'Student ID already registered'
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
        year: parseInt(year)
      });

      // Generate JWT token including role
      const token = jwt.sign(
        {
          id: student.id,
          email: student.email,
          role: 'STUDENT'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        token,
        user: {
          id: student.id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          role: 'STUDENT'
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
        error: error.message
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
          message: 'Email and password are required'
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
          role = 'STUDENT';
        }
      }

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token with role
      const token = jwt.sign(
        {
          id: userData.id,
          email: userData.email,
          role: role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: role,
          studentId: userData.studentId || undefined
        }
      });

    } catch (error) {
      console.error('Login error full:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const email = req.user.email;

      // Try User table first (Admin/Organizer/President)
      const user = await UserModel.findByEmail(email);
      if (user) {
        return res.status(200).json({
          success: true,
          profile: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            createdAt: user.createdAt
          }
        });
      }

      // Try Student table next
      const student = await StudentModel.findByEmail(email);
      if (student) {
        return res.status(200).json({
          success: true,
          profile: {
            id: student.id,
            name: student.name,
            email: student.email,
            studentId: student.studentId,
            department: student.department,
            year: student.year,
            profileImage: student.profileImage,
            createdAt: student.createdAt,
            role: 'STUDENT'
          }
        });
      }

      return res.status(404).json({ success: false, message: 'User not found' });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }

  // Update student profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;

      if (role !== 'STUDENT') {
        return res.status(403).json({ success: false, message: 'Only students can update their profile here.' });
      }

      const { name, department, year, profileImage } = req.body;

      if (!name || !department || !year) {
        return res.status(400).json({ success: false, message: 'Name, department, and year are required.' });
      }

      const updated = await StudentModel.update(userId, {
        name,
        department,
        year: parseInt(year),
        profileImage
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        profile: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          studentId: updated.studentId,
          department: updated.department,
          year: updated.year,
          profileImage: updated.profileImage,
          createdAt: updated.createdAt,
          role: 'STUDENT'
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }

  // Change password for both Student and User
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
      }

      let userData = null;
      let Model = null;

      if (role === 'STUDENT') {
        userData = await StudentModel.findById(userId);
        Model = StudentModel;
      } else {
        userData = await UserModel.findById(userId);
        Model = UserModel;
      }

      if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, userData.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Incorrect current password' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await Model.update(userId, { password: hashedPassword });

      res.status(200).json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ success: false, message: 'Server error during password change', error: error.message });
    }
  }

  // Get all students (Admin only)
  static async getAllStudents(req, res) {
    try {
      const students = await StudentModel.findAll();
      res.status(200).json({
        success: true,
        students
      });
    } catch (error) {
      console.error('Get all students error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching students',
        error: error.message
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
        ...staff.map(u => ({ ...u })),
        ...students.map(s => ({ ...s, role: 'STUDENT' }))
      ];

      res.status(200).json({
        success: true,
        users: allUsers
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching all users',
        error: error.message
      });
    }
  }

  // Assign a student to a role (e.g. Club President)
  static async assignRole(req, res) {
    try {
      const { studentId, role, clubOrFacultyName, clubOrFacultyType } = req.body;

      if (!studentId || !role) {
        return res.status(400).json({
          success: false,
          message: 'Student ID and role are required'
        });
      }

      // 1. Find the student
      const student = await prisma.student.findUnique({
        where: { id: parseInt(studentId) }
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // 2. Check if user record already exists for this email
      let user = await prisma.user.findUnique({
        where: { email: student.email }
      });

      if (user) {
        // Update existing user role and club info
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            role,
            clubOrFacultyName,
            clubOrFacultyType
          }
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
            profileImage: student.profileImage
          }
        });
      }

      res.status(200).json({
        success: true,
        message: `Successfully assigned ${student.name} as ${role} for ${clubOrFacultyName}`,
        user
      });

    } catch (error) {
      console.error('Assign role error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during role assignment',
        error: error.message
      });
    }
  }
}


export default AuthController;
