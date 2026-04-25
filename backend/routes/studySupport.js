import express from 'express';
import { verifyToken, requireRole, verifyStudent } from '../middleware/authMiddleware.js';
import studySupportController from '../controllers/studySupportController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Material Upload route
router.post(
    '/upload-material',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
    upload.single('file'),
    (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            const fileUrl = `http://localhost:5000/uploads/materials/${req.file.filename}`;
            res.status(200).json({
                success: true,
                message: 'File uploaded successfully',
                url: fileUrl
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

// ADMIN ROUTES - Study Materials
router.post(
    '/materials',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
    studySupportController.createStudyMaterial
);

router.put(
    '/materials/:id',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
    studySupportController.updateStudyMaterial
);

router.delete(
    '/materials/:id',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
    studySupportController.deleteStudyMaterial
);

router.get(
    '/admin/materials',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
    studySupportController.getAllMaterials
);

// ADMIN ROUTES - Study Sessions
router.post(
    '/sessions',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
    studySupportController.createStudySession
);

router.put(
    '/sessions/:id',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
    studySupportController.updateStudySession
);

router.delete(
    '/sessions/:id',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
    studySupportController.deleteStudySession
);

router.get(
    '/admin/sessions',
    verifyToken,
    requireRole('SYSTEM_ADMIN'),
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
    verifyStudent,
    studySupportController.getStudentMaterials
);

// STUDENT ROUTES - View Sessions
router.get(
    '/sessions',
    verifyStudent,
    studySupportController.getStudentSessions
);

export default router;
