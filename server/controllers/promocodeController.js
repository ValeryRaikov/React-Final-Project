import Promocode from '../models/Promocode.js';

export const applyPromo = async (req, res) => {
    try {
        const { code, subtotal } = req.body;

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