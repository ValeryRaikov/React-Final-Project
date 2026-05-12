// middleware/clientAuthMiddleware.js - Middleware to authenticate regular users using JWT

import jwt from 'jsonwebtoken';

// Middleware to fetch user from JWT token
// This middleware will be used to protect routes that require authentication imported as 'auth' in route files
export default function fetchUser(req, res, next) {
    // Get token from header
    const token = req.header('auth-token');

    // Check if token is present
    if (!token) {
        return res.status(401).json({ error: 'No token. Please log in first.' });
    }

    try {
        // Verify token and get user data
        const data = jwt.verify(token, process.env.JWT_SECRET);

        req.user = data.user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }

        return res.status(401).json({ error: "Invalid token." });
    }
};