import 'dotenv/config';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';

// Admin login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({
            success: false,
            errors: 'Password must be at least 8 chars, include uppercase, lowercase, number, and special character'
        });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    if (!admin.isActive) {
        return res.status(403).json({
            success: false,
            message: 'Account disabled'
        });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        { user: { id: admin._id, username: admin.name, role: admin.role || 'admin' } },
        process.env.JWT_SECRET_ADMIN,
        { expiresIn: "12h" }
    );

    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role || 'admin'
        }
    });
};

const verifyToken = async (req, res) => {
    const admin = await Admin.findById(req.user.id); 

    res.json({
        success: true,
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    });
};

export { adminLogin, verifyToken };