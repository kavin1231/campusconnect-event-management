import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register - Register new student
router.post('/register', AuthController.register);

// POST /api/auth/login - Login student
router.post('/login', AuthController.login);

// GET /api/auth/profile - Get current user profile (optional - for future use)
// router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;

