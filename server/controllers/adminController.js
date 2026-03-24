/*
const admins = {
    'admin1@gmail.com': 'admin_pass',
    'admin2@gmail.com': 'admin_1234',
};

// Admin login
exports.adminLogin = (req, res) => {
    const { email, password } = req.body;

    if (admins[email] === password) {
        return res.json({ message: 'Login successful', token: 'admin-token' });
    }

    res.status(401).json({ message: 'Invalid credentials' });
};
*/

const Admin = require('../models/Admin');

// Admin login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if account is active
        if (!admin.isActive) {
            return res.status(403).json({ message: 'Account disabled' });
        }

        // Compare hashed password
        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.json({
            message: 'Login successful',
            token: 'admin-token' // (you can replace with JWT later)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};