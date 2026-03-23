const prisma = require('../prisma/client');

// Semester validation
const VALID_SEMESTERS = ['Y1S1', 'Y1S2', 'Y2S1', 'Y2S2', 'Y3S1', 'Y3S2', 'Y4S1', 'Y4S2'];

// Helper function to get student's semester
const getStudentSemester = (year) => {
    // Assuming year is 1, 2, 3, or 4
    // We can extend this if needed (e.g., based on enrollment date)
    // For now, show both semesters for the student's year
    return [`Y${year}S1`, `Y${year}S2`];
};

// ADMIN: Create Study Material
exports.createStudyMaterial = async (req, res) => {
    try {
        const { semester, title, description, materialType, contentUrl } = req.body;
        const userId = req.user.id;

        // Validate semester
        if (!VALID_SEMESTERS.includes(semester)) {
            return res.status(400).json({
                success: false,
                message: `Invalid semester. Must be one of: ${VALID_SEMESTERS.join(', ')}`
            });
        }

        // Validate material type
        const validTypes = ['pdf', 'link', 'video', 'other'];
        if (!validTypes.includes(materialType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid material type. Must be one of: ${validTypes.join(', ')}`
            });
        }

        const material = await prisma.studyMaterial.create({
            data: {
                semester,
                title,
                description,
                materialType,
                contentUrl,
                createdBy: userId
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Study material created successfully',
            data: material
        });
    } catch (error) {
        console.error('Error creating study material:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create study material',
            error: error.message
        });
    }
};

// ADMIN: Update Study Material
exports.updateStudyMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { semester, title, description, materialType, contentUrl } = req.body;

        // Validate semester if provided
        if (semester && !VALID_SEMESTERS.includes(semester)) {
            return res.status(400).json({
                success: false,
                message: `Invalid semester. Must be one of: ${VALID_SEMESTERS.join(', ')}`
            });
        }

        const material = await prisma.studyMaterial.update({
            where: { id: parseInt(id) },
            data: {
                ...(semester && { semester }),
                ...(title && { title }),
                ...(description && { description }),
                ...(materialType && { materialType }),
                ...(contentUrl && { contentUrl })
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Study material updated successfully',
            data: material
        });
    } catch (error) {
        console.error('Error updating study material:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update study material',
            error: error.message
        });
    }
};

// ADMIN: Delete Study Material
exports.deleteStudyMaterial = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.studyMaterial.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Study material deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting study material:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete study material',
            error: error.message
        });
    }
};

// ADMIN: Get all materials (for management dashboard)
exports.getAllMaterials = async (req, res) => {
    try {
        const { semester, materialType, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (semester) filter.semester = semester;
        if (materialType) filter.materialType = materialType;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [materials, total] = await Promise.all([
            prisma.studyMaterial.findMany({
                where: filter,
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { uploadedAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.studyMaterial.count({ where: filter })
        ]);

        res.json({
            success: true,
            data: materials,
            pagination: {
                total,
                pages: Math.ceil(total / parseInt(limit)),
                currentPage: parseInt(page),
                pageSize: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch materials',
            error: error.message
        });
    }
};

// STUDENT: Get materials for their semester
exports.getStudentMaterials = async (req, res) => {
    try {
        const studentId = req.student.id;
        const year = req.student.year;

        // Get materials for both semesters of student's year
        const semesters = getStudentSemester(year);

        const materials = await prisma.studyMaterial.findMany({
            where: {
                semester: {
                    in: semesters
                }
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { uploadedAt: 'desc' }
        });

        res.json({
            success: true,
            studentYear: year,
            availableSemesters: semesters,
            data: materials
        });
    } catch (error) {
        console.error('Error fetching student materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch materials',
            error: error.message
        });
    }
};

// ADMIN: Create Study Session
exports.createStudySession = async (req, res) => {
    try {
        const { semester, title, description, sessionDate, sessionLink, sessionNotes } = req.body;
        const userId = req.user.id;

        // Validate semester
        if (!VALID_SEMESTERS.includes(semester)) {
            return res.status(400).json({
                success: false,
                message: `Invalid semester. Must be one of: ${VALID_SEMESTERS.join(', ')}`
            });
        }

        const session = await prisma.studySession.create({
            data: {
                semester,
                title,
                description,
                sessionDate: new Date(sessionDate),
                sessionLink,
                sessionNotes,
                createdBy: userId
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Study session created successfully',
            data: session
        });
    } catch (error) {
        console.error('Error creating study session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create study session',
            error: error.message
        });
    }
};

// ADMIN: Update Study Session
exports.updateStudySession = async (req, res) => {
    try {
        const { id } = req.params;
        const { semester, title, description, sessionDate, sessionLink, sessionNotes } = req.body;

        // Validate semester if provided
        if (semester && !VALID_SEMESTERS.includes(semester)) {
            return res.status(400).json({
                success: false,
                message: `Invalid semester. Must be one of: ${VALID_SEMESTERS.join(', ')}`
            });
        }

        const session = await prisma.studySession.update({
            where: { id: parseInt(id) },
            data: {
                ...(semester && { semester }),
                ...(title && { title }),
                ...(description && { description }),
                ...(sessionDate && { sessionDate: new Date(sessionDate) }),
                ...(sessionLink && { sessionLink }),
                ...(sessionNotes && { sessionNotes })
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Study session updated successfully',
            data: session
        });
    } catch (error) {
        console.error('Error updating study session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update study session',
            error: error.message
        });
    }
};

// ADMIN: Delete Study Session
exports.deleteStudySession = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.studySession.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Study session deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting study session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete study session',
            error: error.message
        });
    }
};

// ADMIN: Get all sessions (for management dashboard)
exports.getAllSessions = async (req, res) => {
    try {
        const { semester, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (semester) filter.semester = semester;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [sessions, total] = await Promise.all([
            prisma.studySession.findMany({
                where: filter,
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { sessionDate: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.studySession.count({ where: filter })
        ]);

        res.json({
            success: true,
            data: sessions,
            pagination: {
                total,
                pages: Math.ceil(total / parseInt(limit)),
                currentPage: parseInt(page),
                pageSize: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sessions',
            error: error.message
        });
    }
};

// STUDENT: Get sessions for their semester
exports.getStudentSessions = async (req, res) => {
    try {
        const studentId = req.student.id;
        const year = req.student.year;

        // Get sessions for both semesters of student's year
        const semesters = getStudentSemester(year);

        const sessions = await prisma.studySession.findMany({
            where: {
                semester: {
                    in: semesters
                }
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { sessionDate: 'desc' }
        });

        res.json({
            success: true,
            studentYear: year,
            availableSemesters: semesters,
            data: sessions
        });
    } catch (error) {
        console.error('Error fetching student sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sessions',
            error: error.message
        });
    }
};

// ADMIN: Get combined study support dashboard data
exports.getStudySupportDashboard = async (req, res) => {
    try {
        const [materials, sessions] = await Promise.all([
            prisma.studyMaterial.findMany({
                select: { semester: true, id: true }
            }),
            prisma.studySession.findMany({
                select: { semester: true, id: true }
            })
        ]);

        // Group by semester
        const dashboard = {};
        VALID_SEMESTERS.forEach(sem => {
            dashboard[sem] = {
                materials: materials.filter(m => m.semester === sem).length,
                sessions: sessions.filter(s => s.semester === sem).length
            };
        });

        res.json({
            success: true,
            data: dashboard
        });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard',
            error: error.message
        });
    }
};
