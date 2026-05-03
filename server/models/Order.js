import mongoose from 'mongoose';
import orderItemSchema from './OrderItem.js';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'paid'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Order', orderSchema);