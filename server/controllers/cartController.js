import User from '../models/User.js';

// Add an item to the cart
const addToCart = async (req, res) => {
    try {
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({ error: 'itemId required' });
        }

        await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { [`cartData.${itemId}`]: 1 } },
            { upsert: true }
        );

        res.send('Added to cart');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove an item from the cart
const removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize cartData if it doesn't exist
        if (!user.cartData || typeof user.cartData !== 'object') {
            user.cartData = {};
        }

        const itemId = req.body.itemId;
        
        // Initialize item count if not present
        if (!user.cartData[itemId]) {
            user.cartData[itemId] = 0;
        }

        if (user.cartData[itemId] > 0) {
            user.cartData[itemId]--;
        }

        user.markModified('cartData');
        await user.save();
        res.send('Removed from cart');
    } catch (err) {
        console.error('Remove from cart error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get the current cart data
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize cartData if it doesn't exist
        if (!user.cartData || typeof user.cartData !== 'object') {
            user.cartData = {};
            await user.save();
        }

        res.json(user.cartData);
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export { addToCart, removeFromCart, getCart };