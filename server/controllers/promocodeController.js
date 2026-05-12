// controllers/promocodeController.js - handles promo code application and management (CRUD) for admin

import Promocode from '../models/Promocode.js';

// Apply a promo code to calculate discounted total
const applyPromo = async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        // Validate input
        if (!code || !subtotal) {
            return res.status(400).json({
                valid: false,
                message: 'Missing code or subtotal'
            });
        }

        // Trim and check the promo code (case-insensitive)
        const promo = await Promocode.findOne({
            code: code.trim(),
            active: true
        });

        // Check if promo code exists and is active
        if (!promo) {
            return res.status(400).json({
                valid: false,
                message: 'Invalid promo code'
            });
        }

        // Check expiration date
        if (promo.expiresAt && promo.expiresAt < new Date()) {
            return res.status(400).json({
                valid: false,
                message: 'Promo code expired'
            });
        }

        // Calculate discounted total
        const total = subtotal * promo.discount;

        return res.json({
            valid: true,
            discount: promo.discount,
            total: parseFloat(total.toFixed(2))
        });

    } catch (err) {
        console.error('Promo apply error:', err);
        res.status(500).json({
            valid: false,
            message: 'Server error'
        });
    }
};

// Create promocode
const createPromocode = async (req, res) => {
    try {
        const { code, discount, expiresAt } = req.body;

        // Validate input
        if (!code || !discount) {
            return res.status(400).json({
                success: false,
                message: 'Code and discount are required'
            });
        }

        // Check if code already exists
        const existing = await Promocode.findOne({ code });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Promocode already exists'
            });
        }

        // Validate discount value
        if (discount <= 0 || discount > 1) {
            return res.status(400).json({
                success: false,
                message: 'Discount multiplier must be between 0 and 1 (e.g., 0.8 for 20% off)'
            });
        }

        // Create and save the new promocode
        const promocode = new Promocode({
            code: code.toUpperCase().trim(),
            discount,
            expiresAt
        });

        await promocode.save();

        res.json({
            success: true,
            message: 'Promocode created successfully',
            promocode
        });

    } catch (err) {
        console.error('Create promocode error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Get all promocodes
const getPromocodes = async (req, res) => {
    try {
        const promocodes = await Promocode.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            promocodes
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Update promocode
const updatePromocode = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discount, active, expiresAt } = req.body;

        const promocode = await Promocode.findById(id);

        // Check if promocode exists
        if (!promocode) {
            return res.status(404).json({
                success: false,
                message: 'Promocode not found'
            });
        }

        // Update fields if provided
        if (code) 
            promocode.code = code.toUpperCase().trim();

        if (discount !== undefined) 
            promocode.discount = discount;

        if (active !== undefined) 
            promocode.active = active;

        if (expiresAt) 
            promocode.expiresAt = expiresAt;

        if (discount !== undefined) {
            if (discount <= 0 || discount > 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Discount multiplier must be between 0 and 1'
                });
            }
            promocode.discount = discount;
        }

        await promocode.save();

        res.json({
            success: true,
            message: 'Promocode updated successfully',
            promocode
        });

    } catch (err) {
        console.error('Update promocode error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Delete promocode
const deletePromocode = async (req, res) => {
    try {
        const { id } = req.params;

        const promocode = await Promocode.findByIdAndDelete(id);

        // Check if promocode existed and was deleted
        if (!promocode) {
            return res.status(404).json({
                success: false,
                message: 'Promocode not found'
            });
        }

        res.json({
            success: true,
            message: 'Promocode deleted successfully'
        });

    } catch (err) {
        console.error('Delete promocode error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export {
    applyPromo,
    createPromocode,
    getPromocodes,
    updatePromocode,
    deletePromocode
};