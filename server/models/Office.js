import mongoose from 'mongoose';

// Schema for office locations in MongoDB
const officeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    location: {
        lat: { 
            type: Number, 
            required: true 
        },
        lng: { 
            type: Number, 
            required: true 
        }
    },
    isOpen: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Office', officeSchema);