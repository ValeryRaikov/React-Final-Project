import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import savedItemsRoutes from './routes/savedItemsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import promocodeRoutes from './routes/promocodeRoutes.js';
import officeRoutes from './routes/officeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

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
app.use('/', adminUserRoutes);
app.use('/', cartRoutes);
app.use('/', savedItemsRoutes);
app.use('/', promocodeRoutes);
app.use('/', officeRoutes);
app.use('/', paymentRoutes);
app.use('/', orderRoutes);

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