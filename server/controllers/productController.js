import Product from '../models/Product.js';
import User from '../models/User.js';

// Create a new product
const addProduct = async (req, res) => {
    const products = await Product.find({});
    const id = products.length ? products.slice(-1)[0].id + 1 : 1;

    const officeIds = req.body.officeIds || [];
    
    const product = new Product({ 
        id, 
        ...req.body, 
        likes: [],
        officeIds: officeIds,
        // Automatically set available: true if any offices selected, false if none
        available: officeIds.length > 0
    });
    await product.save();

    res.json({ success: true, name: req.body.name });
};

// Update an existing product
const updateProduct = async (req, res) => {
    const officeIds = req.body.officeIds || [];
    
    const updateData = {
        ...req.body,
        // Automatically set available based on whether offices are selected
        available: officeIds.length > 0
    };
    
    await Product.findOneAndUpdate(
        { id: req.params.id },
        { $set: updateData }
    );
    res.json({ success: true, name: req.body.name });
};

// Delete a product
const deleteProduct = async (req, res) => {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
};

// Get all products with sorting options
const getAllProducts = async (req, res) => {
    const sortOption = req.query.sort || 'id-asc';

    const sortMap = {
        'newPrice-desc': { newPrice: -1 },
        'newPrice-asc': { newPrice: 1 },
        'id-desc': { _id: -1 },
        'id-asc': { _id: 1 },
    };

    const products = await Product.find({}).sort(sortMap[sortOption]);
    res.send(products);
};

// Get a single product by ID
const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id })
            .populate('comments.user', 'username');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);

    } catch (err) {
        console.error('Get product error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Like a product
const likeProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Convert req.user.id to string for comparison
        const userIdStr = String(req.user.id);
        const isAlreadyLiked = product.likes.some(id => id.toString() === userIdStr);
        
        if (!isAlreadyLiked) {
            product.likes.push(req.user.id);
            await product.save();
        }

        res.json({ likes: product.likes.length });

    } catch (err) {
        console.error('Like product error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Dislike a product
const dislikeProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const userIdStr = String(req.user.id);
        product.likes = product.likes.filter(
            userId => userId.toString() !== userIdStr
        );

        await product.save();

        res.json({ likes: product.likes.length });

    } catch (err) {
        console.error('Dislike product error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add a comment to a product
const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Comment cannot be empty' });
        }

        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const alreadyCommented = product.comments.some(
            c => c.user.toString() === req.user.id
        );

        if (alreadyCommented) {
            return res.status(400).json({ error: 'You have already commented on this product.' });
        }

        // Fetch user from DB
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newComment = {
            user: user._id,
            username: user.name,
            text,
            createdAt: new Date(),
        };

        product.comments.push(newComment);
        await product.save();

        res.json({ success: true, comments: product.comments });

    } catch (err) {
        console.error('Add comment error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a comment from a product
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const comment = product.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        comment.deleteOne();
        await product.save();

        res.json({ success: true, comments: product.comments });

    } catch (err) {
        console.error('Delete comment error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get new collection products
const newCollection = async (req, res) => {
    const products = await Product.find({});
    res.send(products.slice(1).slice(-8));
};

// Get popular in women
const popularWomen = async (req, res) => {
    const products = await Product.find({ category: 'women' });
    res.send(products.slice(0, 4));
};

export { 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getAllProducts, 
    getProduct, 
    likeProduct, 
    dislikeProduct, 
    addComment,
    deleteComment,
    newCollection, 
    popularWomen 
};