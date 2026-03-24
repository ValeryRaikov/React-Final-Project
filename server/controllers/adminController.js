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

    res.json({
        success: true,
        message: 'Login successful',
        token: 'admin-token'
    });
};

export { adminLogin };