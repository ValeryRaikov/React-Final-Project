import mongoose from 'mongoose';
import CommentSchema from './Comment.js';

// Schema for products in MongoDB
const ProductSchema = new mongoose.Schema({
    id: Number,
    name: { 
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '',
        maxlength: [255, 'Description must be less than 255 characters']
    },
    image: { 
        type: String,
        required: true
    },
    category: { 
        type: String,
        enum: ['men', 'women', 'kids'],
        required: true
    },
    subcategory: {
        type: String,
        enum: ['shirts', 'pants', 'dresses', 'tops', 'jackets', 'shoes'],
        required: true
    },
    newPrice: { 
        type: Number,
        required: true
    },
    oldPrice: { 
        type: Number,
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    available: { 
        type: Boolean, 
        default: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    comments: {
        type: [CommentSchema],
        default: []
    },
    officeIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Office',
        default: []
    }
});

export default mongoose.model('Product', ProductSchema);