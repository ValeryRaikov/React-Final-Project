const mongoose = require('mongoose');

// Schema for products in MongoDB
const ProductSchema = new mongoose.Schema({
    id: Number,
    name: { 
        type: String,
        required: true
    },
    image: { 
        type: String,
        required: true
    },
    category: { 
        type: String,
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
    }
});

module.exports = mongoose.model('Product', ProductSchema);