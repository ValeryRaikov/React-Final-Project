// controllers/productController.js - Controller for handling product-related API requests, including CRUD operations, likes/dislikes, comments, and fetching products for different sections (new collection, popular

import Product from '../models/Product.js';
import User from '../models/User.js';

// Create a new product
const addProduct = async (req, res) => {
    // Generate new product ID by finding the max existing ID and adding 1
    const products = await Product.find({});
    const id = products.length ? products.slice(-1)[0].id + 1 : 1;

    // Handle officeIds and set availability based on whether any offices are selected
    const officeIds = req.body.officeIds || [];
    
    // Create new product with provided data and generated ID
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
    
    // If officeIds is provided, ensure it's included in the update data
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
    // Default sorting by ID ascending
    const sortOption = req.query.sort || 'id-asc';

    // Map of sorting options to MongoDB sort objects
    const sortMap = {
        'newPrice-desc': { newPrice: -1 },
        'newPrice-asc': { newPrice: 1 },
        'id-desc': { _id: -1 },
        'id-asc': { _id: 1 },
    };

    // Fetch products with the specified sorting option (default to ID ascending if invalid option provided)
    const products = await Product.find({}).sort(sortMap[sortOption]);
    res.send(products);
};

// Get a single product by ID
const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id })
            .populate('comments.user', '_id name');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).json({ error: 'Invalid product id' });
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
        
        // Only add like if the user hasn't already liked the product
        if (!isAlreadyLiked) {
            product.likes.push(req.user.id);
            await product.save();

            // use atomic update to avoid version conflicts and ensure like is added correctly even with concurrent requests
            // await Product.updateOne(
            //     { id: req.params.id },
            //     { $addToSet: { likes: req.user.id } }
            // );
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

        // Convert req.user.id to string for comparison
        const userIdStr = String(req.user.id);

        // Remove the user's like if it exists
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

        // Check if the user has already commented on this product
        // Safely handle null user references from deleted accounts
        const alreadyCommented = product.comments.some(c => {
            const commentUserId = c.user?._id || c.user;
            return commentUserId?.toString() === req.user.id;
        });

        if (alreadyCommented) {
            return res.status(400).json({ error: 'You have already commented on this product.' });
        }

        // Fetch user from DB
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create new comment object
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

        // Find the comment by ID
        const comment = product.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Safely handle null user references from deleted accounts
        if (!comment.user || comment.user.toString() !== req.user.id) {
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

// Get new collection products - we take the last 8 products added
const newCollection = async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.send(products.slice(0, 8));
};

// Get women popular products
const popularWomen = async (req, res) => {
    const products = await Product.find({ category: 'women' });
    res.send(products.slice(0, 4));
};

// Track a product view (add to recently viewed)
const trackProductView = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId || isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Verify product exists
        const product = await Product.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Use atomic findByIdAndUpdate with aggregation pipeline to avoid version conflicts and ensure recentlyViewed is updated correctly even with concurrent requests
        await User.findByIdAndUpdate(
            req.user.id,
            [
                {
                    $set: {
                        recentlyViewed: {
                            $slice: [
                                {
                                    $concatArrays: [
                                        [{ productId, viewedAt: new Date() }],
                                        {
                                            $filter: {
                                                input: { $ifNull: ['$recentlyViewed', []] },
                                                as: 'item',
                                                cond: { $ne: ['$$item.productId', productId] }
                                            }
                                        }
                                    ]
                                },
                                8
                            ]
                        }
                    }
                }
            ],
            { new: true }
        );

        res.json({ success: true });

    } catch (err) {
        console.error('Track product view error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get recently viewed products
const getRecentlyViewed = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Handle users without recentlyViewed field (existing users)
        if (!user.recentlyViewed || user.recentlyViewed.length === 0) {
            return res.json([]);
        }

        // Get product IDs from recently viewed
        const productIds = user.recentlyViewed.map(item => item.productId);

        if (productIds.length === 0) {
            return res.json([]);
        }

        // Fetch full product details
        const products = await Product.find({ id: { $in: productIds } });

        // Sort products in the order they appear in recently viewed
        const sortedProducts = productIds
            .map(id => products.find(p => p.id === id))
            .filter(p => p !== undefined);

        res.json(sortedProducts);

    } catch (err) {
        console.error('Get recently viewed error:', err);
        res.status(500).json({ error: 'Server error' });
    }
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
    popularWomen,
    trackProductView,
    getRecentlyViewed
};