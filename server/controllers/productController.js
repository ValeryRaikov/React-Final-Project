const Product = require('../models/Product');

// Create a new product
exports.addProduct = async (req, res) => {
    const products = await Product.find({});
    const id = products.length ? products.slice(-1)[0].id + 1 : 1;

    const product = new Product({ id, ...req.body });
    await product.save();

    res.json({ success: true, name: req.body.name });
};

// Update an existing product
exports.updateProduct = async (req, res) => {
    await Product.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body }
    );
    res.json({ success: true, name: req.body.name });
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
};

// Get all products with sorting options
exports.getAllProducts = async (req, res) => {
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
exports.getProduct = async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    res.send(product);
};

// Like a product
exports.likeProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Prevent duplicate likes using toString() for comparison
        const userIdStr = req.user.id.toString();
        const isAlreadyLiked = product.likes.some(id => id.toString() === userIdStr);
        
        if (!isAlreadyLiked) {
            product.likes.push(req.user.id);
            await product.save();
        }

        res.json({ likes: product.likes.length });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Dislike a product
exports.dislikeProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        product.likes = product.likes.filter(
            userId => userId.toString() !== req.user.id
        );

        await product.save();

        res.json({ likes: product.likes.length });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get new collection products
exports.newCollection = async (req, res) => {
    const products = await Product.find({});
    res.send(products.slice(1).slice(-8));
};

// Get popular in women
exports.popularWomen = async (req, res) => {
    const products = await Product.find({ category: 'women' });
    res.send(products.slice(0, 4));
};