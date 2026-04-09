import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard routes require a valid STUDENT or CLUB_PRESIDENT token
router.use(verifyToken);
router.use(requireRole(['STUDENT', 'CLUB_PRESIDENT']));

// GET  /api/dashboard/stats
router.get('/stats', DashboardController.getStats);

// GET  /api/dashboard/events?filter=all|registered|upcoming|past|explore&category=&search=
router.get('/events', DashboardController.getEvents);

// POST /api/dashboard/register/:eventId
router.post('/register/:eventId', DashboardController.registerEvent);

// DELETE /api/dashboard/register/:eventId
router.delete('/register/:eventId', DashboardController.unregisterEvent);

export default router;
