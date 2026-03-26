import mongoose from 'mongoose';
import 'dotenv/config';
import Promocode from '../models/Promocode.js';

const seedPromocodes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected');

        await Promocode.deleteMany();

        const promoCodes = [
            {
                code: 'LOYAL5',
                discount: 0.95
            },
            {
                code: 'HAPPY10',
                discount: 0.90
            },
            {
                code: 'MAGIC20',
                discount: 0.80
            }
        ];

        await Promocode.insertMany(promoCodes);

        console.log('Promo codes seeded successfully');
        process.exit();

    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedPromocodes();