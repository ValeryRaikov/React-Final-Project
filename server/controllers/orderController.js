import Order from '../models/Order.js';
import User from '../models/User.js';

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

/**
 * Fetch all paid orders (admin/operator/superadmin only)
 * Includes user details for each order
 */
export const getCompletedOrders = async (req, res) => {
    try {
        // Get all completed orders and populate user details
        const completedOrders = await Order.find({ status: 'paid' })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 }); // newest first

        res.json({
            success: true,
            data: completedOrders,
            count: completedOrders.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch completed orders' });
    }
};