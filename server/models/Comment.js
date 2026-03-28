import mongoose from 'mongoose';

// Schema for comments related to products in MongoDB
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