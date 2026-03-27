import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

async function removeOfficeIds() {
    try {
        console.log('WARNING: This script will remove officeIds from all products');
        console.log('All office associations will be lost permanently!');
        console.log('');
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Remove officeIds field from all products
        const result = await Product.updateMany(
            {},
            { $unset: { officeIds: 1 } }
        );

        console.log(`Rollback complete!`);
        console.log(`- Modified: ${result.modifiedCount} products`);
        console.log('');
        console.log('The officeIds field has been removed from all products');
        console.log('Your database is now reverted to the previous version');

        process.exit(0);

    } catch (err) {
        console.error('Rollback failed:', err.message);
        process.exit(1);
    }
}

removeOfficeIds();
