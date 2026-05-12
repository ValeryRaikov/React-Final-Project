// controllers/cartController.js - Handles cart operations: add, remove, get cart data

import User from '../models/User.js';

// Add an item to the cart
const addToCart = async (req, res) => {
    try {
        // Find the user by ID from the authenticated request
        const user = await User.findById(req.user.id);

        // Validate itemId from request body
        const itemId = Number(req.body.itemId);

        // Check if itemId is valid
        if (!itemId || isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid itemId' });
        }

        // Initialize cartData if it doesn't exist
        if (!user.cartData) {
            user.cartData = [];
        }

        // Check if product already exists in cart
        const existingItem = user.cartData.find(
            item => item.productId === itemId
        );

        // If it exists, increment quantity, otherwise add new item with quantity 1
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

        // Find the item in the cart
        const itemIndex = user.cartData.findIndex(
            item => item.productId === itemId
        );

        // If item is not found in cart, return error
        if (itemIndex === -1) {
            return res.status(400).json({ error: 'Item not in cart' });
        }

        // If quantity is greater than 1, decrement it. Otherwise, remove the item from the cart.
        if (user.cartData[itemIndex].quantity > 1) {
            user.cartData[itemIndex].quantity -= 1;
        } else {
            user.cartData.splice(itemIndex, 1);
        }

        await user.save();

        res.send('Removed from cart');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove an item completely from the cart (regardless of quantity)
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