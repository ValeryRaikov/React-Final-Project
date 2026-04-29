import User from '../models/User.js';

// Add an item to the cart
const addToCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const itemId = Number(req.body.itemId);

        if (!itemId || isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid itemId' });
        }

        if (!user.cartData) {
            user.cartData = [];
        }

        // Check if product already exists in cart
        const existingItem = user.cartData.find(
            item => item.productId === itemId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartData.push({
                productId: itemId,
                quantity: 1
            });
        }

        await user.save();

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

        const itemId = Number(req.body.itemId);

        if (!itemId || isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid itemId' });
        }

        const itemIndex = user.cartData.findIndex(
            item => item.productId === itemId
        );

        if (itemIndex === -1) {
            return res.status(400).json({ error: 'Item not in cart' });
        }

        if (user.cartData[itemIndex].quantity > 1) {
            user.cartData[itemIndex].quantity -= 1;
        } else {
            // Remove item completely if quantity = 1
            user.cartData.splice(itemIndex, 1);
        }

        await user.save();

        res.send('Removed from cart');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const removeEntirelyFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const itemId = Number(req.body.itemId);

        if (!itemId || isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid itemId' });
        }

        // Remove item completely (no quantity logic)
        user.cartData = user.cartData.filter(
            item => item.productId !== itemId
        );

        await user.save();

        res.send('Item removed completely from cart');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get the current cart data
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json(user.cartData || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export { addToCart, removeFromCart, removeEntirelyFromCart, getCart };