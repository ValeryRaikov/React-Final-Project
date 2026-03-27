import mongoose from 'mongoose';
import Product from '../models/Product.js';
import * as dotenv from 'dotenv';

dotenv.config();

const updateProductAvailability = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all products
        const allProducts = await Product.find({});
        console.log(`\nFound ${allProducts.length} products to process`);

        let updatedCount = 0;

        // Update each product
        for (const product of allProducts) {
            const hasOffices = product.officeIds && product.officeIds.length > 0;
            const shouldBeAvailable = hasOffices;
            
            // Only update if availability status differs
            if (product.available !== shouldBeAvailable) {
                await Product.findByIdAndUpdate(
                    product._id,
                    { available: shouldBeAvailable }
                );
                updatedCount++;
                console.log(
                    `Product "${product.name}" - ${product.officeIds.length} offices - available: ${shouldBeAvailable}`
                );
            }
        }

        console.log(`\nSuccessfully updated ${updatedCount} products`);
        console.log(`All products now have correct availability status based on office assignments`);

        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error updating product availability:', error.message);
        process.exit(1);
    }
};

updateProductAvailability();
