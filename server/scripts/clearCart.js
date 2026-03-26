import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

try {
    await mongoose.connect(process.env.MONGODB_URI);

    const result = await User.updateMany(
        {},
        { $set: { cartData: [] } } 
    );

    console.log(`Updated ${result.modifiedCount} users`);

    await mongoose.connection.close(); 
    process.exit(0);

} catch (err) {
    console.error(err);
    process.exit(1);
}