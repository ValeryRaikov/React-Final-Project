import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import promocodeRoutes from './routes/promocodeRoutes.js';

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Static
app.use('/images', express.static('upload/images'));

// Routes
app.use('/', uploadRoutes);
app.use('/', productRoutes);
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/', cartRoutes);
app.use('/', promocodeRoutes);

// Root
app.get('/', (req, res) => {
    res.send('Express App is running');
});

// Start server
const start = async () => {
    await connectDB();
    
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
};

start();