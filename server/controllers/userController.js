const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User registration
exports.signup = async (req, res) => {
    const exists = await User.findOne({ email: req.body.email });

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
        { user: { id: user.id } },
        process.env.JWT_SECRET
    );

    res.json({ success: true, token });
};

// User login
exports.login = async (req, res) => {
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
        { user: { id: user.id } },
        process.env.JWT_SECRET
    );

    res.json({ success: true, token });
};