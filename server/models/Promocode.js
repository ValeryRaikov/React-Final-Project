import mongoose from 'mongoose';

const promocodeSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    discount: { 
        type: Number, 
        required: true 
    }, 
    active: { 
        type: Boolean, 
        default: true 
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 30 * 24 * 60 * 60 * 1000
    }
},{ timestamps: true });

export default mongoose.model('Promocode', promocodeSchema);