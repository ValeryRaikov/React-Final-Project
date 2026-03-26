import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { emailRegex, passwordRegex } from '../utils/regex.js';

// Schema for User model in MongoDB 
const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        // required: true 
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
    agree: {
        type: Boolean,
        required: true
    },
    cartData: [{
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
    date: { 
        type: Date, 
        default: Date.now 
    },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);