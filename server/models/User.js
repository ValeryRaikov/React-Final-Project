// models/User.js - Mongoose schema for user accounts, including authentication and cart data

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { emailRegex, passwordRegex } from '../utils/regex.js';
 
const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: [emailRegex, 'Invalid email format'] // Ensure email is in valid format
    },
    password: {
        type: String,
        required: true,
        match: [passwordRegex, 'Invalid password format'] // Ensure password meets complexity requirements
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    agree: {
        type: Boolean,
        required: true
    },
    cartData: [{ // Array of items in the user's cart
        productId: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    savedItems: [{ // Array of items saved by the user
        productId: {
            type: Number,
            required: true
        }
    }],
    recentlyViewed: [{ // Array of items recently viewed by the user
        productId: {
            type: Number,
            required: true
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    }],
    date: { 
        type: Date, 
        default: Date.now 
    },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) 
        return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);