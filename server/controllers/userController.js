// User controller for handling registration, login, profile management, and Google Sign-In

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isValidName, isValidEmail, isValidPassword, generateSecurePassword } from '../utils/validators.js';
import { verifyRecaptcha } from '../utils/recaptcha.js';
import { verifyGoogleCode } from '../utils/googleAuth.js';

// User registration
const signup = async (req, res) => {
    const { name, email, password, agree, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    if (!recaptchaToken) {
        return res.status(400).json({
            success: false,
            errors: 'reCAPTCHA verification is required'
        });
    }

    // Verify reCAPTCHA token with Google API
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaResult.success) {
        return res.status(400).json({
            success: false,
            errors: 'reCAPTCHA verification failed'
        });
    }

    // Validate input fields are present
    if (!name || !email || !password || agree === undefined) {
        return res.status(400).json({
            success: false,
            errors: 'Name, email, password, and agreement are required'
        });
    }

    // Validate agreement to terms
    if (!agree) {
        return res.status(400).json({
            success: false,
            errors: 'You must agree to the terms and conditions'
        });
    }

    // Validate name, email, and password formats
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

    // Check if user already exists
    const exists = await User.findOne({ email });

    if (exists) {
        return res.status(400).json({
            success: false,
            errors: 'User already exists'
        });
    }

    // Create new user
    const user = new User({ 
        name,
        email,
        password,
        agree,
        cartData: []
    });

    await user.save();

    // Generate JWT token for authentication of the newly registered user
    const token = jwt.sign(
        { user: { id: user.id, username: user.name } },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
    );

    res.json({ success: true, token });
};

// User login
const login = async (req, res) => {
    const { email, password, recaptchaToken } = req.body;

    if (!recaptchaToken) {
        return res.status(400).json({
            success: false,
            errors: 'reCAPTCHA verification is required'
        });
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaResult.success) {
        return res.status(400).json({
            success: false,
            errors: 'reCAPTCHA verification failed'
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ success: false, errors: 'Wrong Email' });
    }

    // Compare hashed password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.json({ success: false, errors: 'Wrong Password' });
    }

    // Generate JWT token for authentication of the logged-in user
    const token = jwt.sign(
        { user: { id: user.id, username: user.name } },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
    );

    res.json({ success: true, token });
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        // Fetch user from DB (excluding password)
        const user = await User.findById(req.user.id).select('-password');

        res.json({ success: true, user });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Change user password
const changePassword = async (req, res) => {
    try {
        // Get old and new passwords from request body
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await user.matchPassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({ error: 'Wrong current password' });
        }

        // Set new password (will be hashed in pre-save hook)
        user.password = newPassword;
        await user.save();

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete user account
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

// Google Sign-In - handles authentication via Google OAuth, user creation if new, and JWT token generation for frontend authentication
const googleSignin = async (req, res) => {
    try {
        const { code, recaptchaToken } = req.body;

        // Validate that both authorization code and reCAPTCHA token are provided
        if (!code || !recaptchaToken) {
            return res.status(400).json({
                success: false,
                errors: 'Authorization code and reCAPTCHA token are required'
            });
        }

        // Verify reCAPTCHA
        const recaptchaResult = await verifyRecaptcha(recaptchaToken);

        if (!recaptchaResult.success) {
            return res.status(400).json({
                success: false,
                errors: 'reCAPTCHA verification failed'
            });
        }

        // Verify Google authorization code
        const googleResult = await verifyGoogleCode(code);

        if (!googleResult.success) {
            return res.status(400).json({
                success: false,
                errors: 'Google authentication failed'
            });
        }

        // Extract user info from Google result
        const { email, name } = googleResult.data;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user from Google data
            user = new User({
                name: name || 'Google User',
                email,
                password: generateSecurePassword(), // Generate a strong random password for Google users
                agree: true,
                cartData: [],
                googleId: googleResult.data.id,
            });

            await user.save();
        } else if (!user.googleId) {
            // Link Google ID to existing account
            user.googleId = googleResult.data.id;
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { user: { id: user.id, username: user.name } },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        res.json({ 
            success: true, 
            token,
            isNewUser: !user 
        });

    } catch (err) {
        console.error('Google sign-in error:', err);
        res.status(500).json({
            success: false,
            errors: 'Server error during Google sign-in'
        });
    }
};

export { 
    signup, 
    login,
    googleSignin,
    getProfile, 
    changePassword, 
    deleteAccount 
};