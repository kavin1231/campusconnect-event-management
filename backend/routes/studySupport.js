import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import studySupportController from '../controllers/studySupportController.js';

const router = express.Router();

// ADMIN ROUTES - Study Materials
router.post(
    '/materials',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.createStudyMaterial
);

router.put(
    '/materials/:id',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.updateStudyMaterial
);

router.delete(
    '/materials/:id',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.deleteStudyMaterial
);

router.get(
    '/admin/materials',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.getAllMaterials
);

// ADMIN ROUTES - Study Sessions
router.post(
    '/sessions',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.createStudySession
);

router.put(
    '/sessions/:id',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.updateStudySession
);

router.delete(
    '/sessions/:id',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.deleteStudySession
);

router.get(
    '/admin/sessions',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.getAllSessions
);

// ADMIN DASHBOARD
router.get(
    '/admin/dashboard',
    verifyToken,
    requireRole(['SYSTEM_ADMIN']),
    studySupportController.getStudySupportDashboard
);

// STUDENT ROUTES - View Materials
router.get(
    '/materials',
    verifyToken,
    requireRole(['STUDENT']),
    studySupportController.getStudentMaterials
);

// STUDENT ROUTES - View Sessions
router.get(
    '/sessions',
    verifyToken,
    requireRole(['STUDENT']),
    studySupportController.getStudentSessions
);

export default router;
