// models/Comment.js - Mongoose schema for product comments, including user reference and timestamps

import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    text: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default CommentSchema;