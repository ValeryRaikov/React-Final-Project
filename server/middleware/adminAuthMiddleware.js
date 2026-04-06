import 'dotenv/config';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const authenticateJWT = async (req, res, next) => {
    const token = req.header('auth-token'); 

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token. Please log in.' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

        const admin = await Admin.findById(data.user.id).select('-password');

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        req.user = data.admin;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired" });
        }

        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};