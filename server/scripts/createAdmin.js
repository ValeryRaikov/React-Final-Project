const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existing = await Admin.findOne({ email: 'superadmin@example.com' });

        if (existing) {
            console.log('Superadmin already exists');
            process.exit();
        }

        await Admin.create({
            email: 'superadmin@example.com',
            password: 'superadmin123',
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