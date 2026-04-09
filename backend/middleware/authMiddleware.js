import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Verify token and attach user info to request
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
            error: error.message
        });
    }
};

// Guard middleware to check user roles
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Role information missing.'
            });
        }

        // Flatten allowedRoles in case an array was passed as a single argument
        const flatRoles = allowedRoles.flat();

        if (!flatRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Role '${req.user.role}' is not authorized.`
            });
        }

        next();
    };
};

export const verifyStudent = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'STUDENT') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Student authorization required.'
            });
        }
        next();
    });
};
