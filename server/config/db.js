import mongoose from 'mongoose';

// MongoDB connection 
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
        console.log('MongoDB database name:', mongoose.connection.name);
    } catch (err) {
        console.error('MongoDB error:', err.message);
        process.exit(1);
    }
};