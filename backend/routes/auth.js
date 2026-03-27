import express from 'express';
import AuthController from '../controllers/authController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';


const router = express.Router();

// POST /api/auth/register - Register new student
router.post('/register', AuthController.register);

// POST /api/auth/login - Unified login for all roles
router.post('/login', AuthController.login);

// GET /api/auth/profile - Get current user profile
router.get('/profile', verifyToken, AuthController.getProfile);

// PUT /api/auth/profile - Update student profile
router.put('/profile', verifyToken, AuthController.updateProfile);

// POST /api/auth/change-password - Change user password
router.post('/change-password', verifyToken, AuthController.changePassword);

// GET /api/auth/students - Get all students (Admin only)
router.get('/students', verifyToken, requireRole('SYSTEM_ADMIN'), AuthController.getAllStudents);

// GET /api/auth/users - Get all users (Admin only)
router.get('/users', verifyToken, requireRole('SYSTEM_ADMIN'), AuthController.getAllUsers);

// POST /api/auth/assign-role - Assign role to student (Admin only)
router.post('/assign-role', verifyToken, requireRole('SYSTEM_ADMIN'), AuthController.assignRole);

export default router;


