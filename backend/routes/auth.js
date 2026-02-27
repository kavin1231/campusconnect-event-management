import express from 'express';
import AuthController from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register - Register new student
router.post('/register', AuthController.register);

// POST /api/auth/login - Unified login for all roles
router.post('/login', AuthController.login);

// GET /api/auth/profile - Get current user profile
router.get('/profile', verifyToken, AuthController.getProfile);

export default router;

