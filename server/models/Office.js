// models/Office.js - Mongoose schema for office locations, including name, coordinates, and open status

import mongoose from 'mongoose';

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