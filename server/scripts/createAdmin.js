import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

// create the first superadmin manually using this script, then you can use the API to create more admins if needed
// run this script with: node server/scripts/createAdmin.js
const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existing = await Admin.findOne({ email: 'superadmin@example.com' });

        if (existing) {
            console.log('Superadmin already exists');
            process.exit();
        }

        await Admin.create({
            email: 'superadmin@mail.com',
            password: '?SuperAdmin123',
            role: 'superadmin'
        });

        console.log('Superadmin created successfully');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();