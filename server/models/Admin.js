import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { emailRegex, passwordRegex } from '../utils/regex.js';

// Schema for Admin model in MongoDB
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [emailRegex, 'Invalid email format']
    },
    password: {
        type: String,
        required: true,
        match: [passwordRegex, 'Invalid password format']
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'operator'],
        default: 'admin'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) 
        return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords during login
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Admin', adminSchema);