import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isValidName, isValidEmail, isValidPassword } from '../utils/validators.js';

// User registration
const signup = async (req, res) => {
    const { name, email, password, agree } = req.body;

    if (!name || !email || !password || agree === undefined) {
        return res.status(400).json({
            success: false,
            errors: 'Name, email, password, and agreement are required'
        });
    }

    if (!agree) {
        return res.status(400).json({
            success: false,
            errors: 'You must agree to the terms and conditions'
        });
    }

    if (!isValidName(name)) {
        return res.status(400).json({
            success: false,
            errors: 'Invalid name format'
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            errors: 'Invalid email format'
        });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({
            success: false,
            errors: 'Password must be at least 8 chars, include uppercase, lowercase, number, and special character'
        });
    }

    const exists = await User.findOne({ email });

    if (exists) {
        return res.status(400).json({
            success: false,
            errors: 'User already exists'
        });
    }

    const user = new User({ 
        name,
        email,
        password,
        agree,
        cartData: []
    });

    await user.save();

    const token = jwt.sign(
        { user: { id: user.id, username: user.name } },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
    );

    res.json({ success: true, token });
};

// User login
const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.json({ success: false, errors: 'Wrong Email' });
    }

    // Compare hashed password
    const isMatch = await user.matchPassword(req.body.password);

    if (!isMatch) {
        return res.json({ success: false, errors: 'Wrong Password' });
    }

    const token = jwt.sign(
        { user: { id: user.id, username: user.name } },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
    );

    res.json({ success: true, token });
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.json({ success: true, user });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await user.matchPassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({ error: 'Wrong current password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.cartData = [];
        await user.save();

        await User.findByIdAndDelete(req.user.id);

        res.json({ success: true });

    } catch (err) {
        console.error('Delete account error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export { 
    signup, 
    login, 
    getProfile, 
    changePassword, 
    deleteAccount 
};