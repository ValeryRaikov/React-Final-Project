import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const migrateSavedItems = async () => {
    try {
        console.log('Starting migration: Adding savedItems field to users...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Shopkees');

        // Update all users that don't have savedItems field
        const result = await User.updateMany(
            { savedItems: { $exists: false } },
            { $set: { savedItems: [] } }
        );

        console.log(`Migration completed successfully!`);
        console.log(`Users updated: ${result.modifiedCount}`);
        console.log(`Users matched: ${result.matchedCount}`);

        // Verify the migration
        const users = await User.find({});
        console.log(`Total users with savedItems field: ${users.filter(u => u.savedItems).length}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrateSavedItems();
