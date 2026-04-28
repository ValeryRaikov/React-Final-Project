import 'dotenv/config';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';

// Admin login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({
            success: false,
            errors: 'Password must be at least 8 chars, include uppercase, lowercase, number, and special character'
        });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    if (!admin.isActive) {
        return res.status(403).json({
            success: false,
            message: 'Account disabled'
        });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        { user: { id: admin._id, username: admin.name, role: admin.role || 'admin' } },
        process.env.JWT_SECRET_ADMIN,
        { expiresIn: "12h" }
    );

    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role || 'admin'
        }
    });
};

const verifyToken = async (req, res) => {
    const admin = await Admin.findById(req.user.id); 

    res.json({
        success: true,
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    });
};

// Get admin statistics
const getStatistics = async (req, res) => {
    try {
        // Total customers
        const totalCustomers = await User.countDocuments();

        // Total products
        const totalProducts = await Product.countDocuments();

        // Products by category
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    available: {
                        $sum: { $cond: ['$available', 1, 0] }
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Products by subcategory
        const productsBySubcategory = await Product.aggregate([
            {
                $group: {
                    _id: '$subcategory',
                    count: { $sum: 1 },
                    category: { $first: '$category' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Most liked products (top 5)
        const mostLiked = await Product.find()
            .select('id name category image newPrice likes')
            .lean()
            .sort({ 'likes': -1 })
            .limit(5);

        const mostLikedProducts = mostLiked.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image,
            price: p.newPrice,
            likes: p.likes.length
        }));

        // Most commented products (top 5)
        const mostCommented = await Product.aggregate([
            {
                $project: {
                    id: 1,
                    name: 1,
                    category: 1,
                    image: 1,
                    newPrice: 1,
                    commentCount: { $size: '$comments' }
                }
            },
            { $match: { commentCount: { $gt: 0 } } },
            { $sort: { commentCount: -1 } },
            { $limit: 5 }
        ]);

        const mostCommentedProducts = mostCommented.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image,
            price: p.newPrice,
            comments: p.commentCount
        }));

        // Products distribution
        const availableProducts = await Product.countDocuments({ available: true });
        const unavailableProducts = totalProducts - availableProducts;

        // Average products per category
        const avgProductsPerCategory = totalProducts > 0 
            ? (totalProducts / productsByCategory.length).toFixed(2)
            : 0;

        // Products by office
        const productsByOffice = await Product.aggregate([
            {
                $unwind: {
                    path: '$officeIds',
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $group: {
                    _id: '$officeIds',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'offices',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'officeInfo'
                }
            },
            {
                $unwind: {
                    path: '$officeInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    officeName: { $ifNull: ['$officeInfo.name', 'Unknown Office'] }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            statistics: {
                totalCustomers,
                totalProducts,
                availableProducts,
                unavailableProducts,
                avgProductsPerCategory: parseFloat(avgProductsPerCategory),
                productsByCategory,
                productsBySubcategory,
                productsByOffice,
                mostLikedProducts,
                mostCommentedProducts
            }
        });

    } catch (err) {
        console.error('Get statistics error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export { adminLogin, verifyToken, getStatistics };