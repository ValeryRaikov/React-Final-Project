// models/Product.js - Mongoose schema for products, including fields for name, description, price, category, and comments

import mongoose from 'mongoose';
import CommentSchema from './Comment.js';

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
        enum: ['men', 'women', 'kids'], // Define possible categories
        required: true
    },
    subcategory: {
        type: String,
        enum: ['shirts', 'pants', 'dresses', 'tops', 'jackets', 'shoes'], // Define possible subcategories
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
        type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who liked the product
        default: []
    },
    comments: {
        type: [CommentSchema], // Array of comments using the CommentSchema
        default: []
    },
    officeIds: {
        type: [mongoose.Schema.Types.ObjectId], // Array of office IDs where the product is available
        ref: 'Office',
        default: []
    }
});

export default mongoose.model('Product', ProductSchema);