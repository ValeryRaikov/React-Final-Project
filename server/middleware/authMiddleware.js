import jwt from 'jsonwebtoken';

// Middleware to fetch user from JWT token
// This middleware will be used to protect routes that require authentication imported as 'auth' in route files
export default function fetchUser(req, res, next) {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({ error: 'No token' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};