import User from '../models/User.js';

// Add an item to saved items
const addToSavedItems = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const itemId = Number(req.body.itemId);

        if (!itemId || isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid itemId' });
        }

        if (!user.savedItems) {
            user.savedItems = [];
        }

        // Check if product already exists in saved items
        const existingItem = user.savedItems.find(
            item => item.productId === itemId
        );

        if (existingItem) {
            return res.status(400).json({ error: 'Item already saved' });
        }

        user.savedItems.push({
            productId: itemId
        });

        await user.save();

        res.send('Added to saved items');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove an item from saved items
const removeFromSavedItems = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const itemId = Number(req.body.itemId);

        if (!itemId || isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid itemId' });
        }

        const itemIndex = user.savedItems.findIndex(
            item => item.productId === itemId
        );

        if (itemIndex === -1) {
            return res.status(400).json({ error: 'Item not in saved items' });
        }

        user.savedItems.splice(itemIndex, 1);

        await user.save();

        res.send('Removed from saved items');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all saved items
const getSavedItems = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json(user.savedItems || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export { addToSavedItems, removeFromSavedItems, getSavedItems };
