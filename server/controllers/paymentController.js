// controllers/paymentController.js - Controller for handling payment-related API requests, including creating checkout sessions and confirming payments (mock implementation)

import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
// import nodemailer from 'nodemailer'; (OMITTED - using console.log instead for mock email)

// 1. Create checkout session (mock implementation)
const createCheckoutSession = async (req, res) => {
    const CLIENT_URL = req.headers.origin;
    
    try {
        // Get user and cart data from DB
        const user = await User.findById(req.user.id);

        // Validate cart data
        if (!user.cartData || user.cartData.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Fetch real products from DB
        const productIds = user.cartData.map(item => item.productId);

        // Calculate subtotal by matching cart items with product prices
        const products = await Product.find({
            id: { $in: productIds }
        });

        let subtotal = 0;

        user.cartData.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);

            if (!product) 
                return;

            subtotal += product.newPrice * cartItem.quantity;
        });

        // Apply discount (if provided)
        const { discount = 1 } = req.body; // comes from frontend

        const total = subtotal * discount;

        const sessionId = `sess_${Date.now()}`;

        res.json({
            url: `${CLIENT_URL}/mock-checkout?sessionId=${sessionId}&amount=${total.toFixed(2)}` 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 2. Confirm payment (mock success)
const confirmPayment = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.cartData || user.cartData.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const productIds = user.cartData.map(i => i.productId);

        const products = await Product.find({
            id: { $in: productIds }
        });

        let total = 0;

        // Create order items by matching cart items with product details and calculating total price
        const orderItems = user.cartData.map(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            if (!product) return null;

            const itemTotal = product.newPrice * cartItem.quantity;
            total += itemTotal;

            return {
                productId: product.id,
                name: product.name,
                price: product.newPrice,
                quantity: cartItem.quantity,
                image: product.image
            };
        }).filter(Boolean);

        // Apply discount (if provided)
        const { discount = 1 } = req.body; // comes from frontend

        const finalTotal = total * discount;

        // Create order
        const order = new Order({
            userId: user._id,
            items: orderItems,
            totalPrice: finalTotal,
        });

        await order.save();

        // Clear cart
        user.cartData = [];
        await user.save();

        // Send email (OMITTED - using console.log instead for mock email)
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // });

        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER,
        //     to: user.email,
        //     subject: 'Order Confirmation',
        //     html: `
        //         <h2>Order Confirmed</h2>
        //         <p>Your payment was successful.</p>
        //         <p>Thank you for your purchase!</p>
        //     `
        // });

        console.log(' MOCK EMAIL SENT');
        console.log('To:', user.email);
        console.log('Subject: Order Confirmed');
        console.log('Body: Your payment was successful.');

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Payment failed' });
    }
};

export { createCheckoutSession, confirmPayment };