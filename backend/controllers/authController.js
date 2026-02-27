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
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: error.message
      });
    }
  }

  // Get current user profile (optional - for future use)
  static async getProfile(req, res) {
    try {
      const studentId = req.user.id; // Assuming middleware sets req.user

      const student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      res.status(200).json({
        success: true,
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          department: student.department,
          year: student.year,
          createdAt: student.createdAt
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

export default AuthController;
