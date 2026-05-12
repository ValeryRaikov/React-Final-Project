// middleware/adminAuthMiddleware.js - Middleware to authenticate admin users using JWT

import 'dotenv/config';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Middleware to authenticate admin users using JWT
export const authenticateJWT = async (req, res, next) => {
    // Get token from header
    const token = req.header('auth-token'); 

    // Check if token is present
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token. Please log in.' });
    }

    try {
        // Verify token and get user data
        const data = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

        // Check if admin exists in DB
        const admin = await Admin.findById(data.user.id).select('-password');

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        req.user = data.user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired" });
        }

        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};