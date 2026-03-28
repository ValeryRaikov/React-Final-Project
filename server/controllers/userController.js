import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isValidName, isValidEmail, isValidPassword } from '../utils/validators.js';

// User registration
const signup = async (req, res) => {
    const { name, email, password, agree } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            errors: 'Name, email, and password are required'
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

    const cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new User({ 
        ...req.body, 
        cartData: cart 
    });

    await user.save();

    const token = jwt.sign(
        { user: { id: user.id, username: user.username } },
        process.env.JWT_SECRET
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
        { user: { id: user.id, username: user.username } },
        process.env.JWT_SECRET
    );

    res.json({ success: true, token });
};

export { signup, login };