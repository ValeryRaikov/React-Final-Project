import Product from '../models/Product.js';

// Create a new product
const addProduct = async (req, res) => {
    const products = await Product.find({});
    const id = products.length ? products.slice(-1)[0].id + 1 : 1;

    const product = new Product({ id, ...req.body, likes: [] });
    await product.save();

    res.json({ success: true, name: req.body.name });
};

// Update an existing product
const updateProduct = async (req, res) => {
    await Product.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body }
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
    const product = await Product.findOne({ id: req.params.id });
    res.send(product);
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
    newCollection, 
    popularWomen 
};