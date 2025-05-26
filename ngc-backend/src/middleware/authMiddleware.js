const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as necessary

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) { // Alternative: token from cookie
    //     token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route (no token)' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
             return res.status(401).json({ success: false, message: 'Not authorized to access this route (user not found)' });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Not authorized to access this route (token failed)' });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`,
            });
        }
        next();
    };
};

// Check if user is premium
exports.isPremiumUser = (req, res, next) => {
    if (!req.user || !req.user.isPremium) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Premium membership required for this resource.',
        });
    }
    next();
};