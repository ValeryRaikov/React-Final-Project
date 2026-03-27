import 'dotenv/config';
import mongoose from 'mongoose';
import Office from '../models/Office.js';

// Seed data
const offices = [
    {
        name: 'Main office',
        location: { lat: 42.638383, lng: 23.379608 },
        isOpen: true,
    },
    {
        name: 'Second office',
        location: { lat: 42.673831, lng: 23.319 },
        isOpen: false,
    },
    {
        name: 'Third office',
        location: { lat: 42.726164, lng: 23.2925 },
        isOpen: true,
    },
    {
        name: 'Fourth office',
        location: { lat: 42.15, lng: 24.749997 },
        isOpen: true,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connected to DB');

        await Office.deleteMany(); 
        await Office.insertMany(offices);

        console.log('Offices seeded successfully');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();