import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

async function addOfficeIds() {
    try {
        console.log('Starting migration: Adding officeIds field to products...');
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update all products that don't have officeIds field
        const result = await Product.updateMany(
            { officeIds: { $exists: false } },
            { $set: { officeIds: [] } }
        );

        console.log(`Migration complete!`);
        console.log(`   - Modified: ${result.modifiedCount} products`);
        console.log(`   - Matched: ${result.matchedCount} products`);
        
        if (result.modifiedCount === 0) {
            console.log('ℹAll products already have officeIds field');
        } else {
            console.log('All products now have the officeIds field (initialized as empty array)');
            console.log('You can now assign offices to products via the admin panel');
        }

        process.exit(0);

    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

addOfficeIds();
