import Order from '../models/Order.js';

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ createdAt: -1 }); // newest first

        res.json({
            success: true,
            data: orders
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};