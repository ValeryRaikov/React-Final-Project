import cors from 'cors';

// CORS middleware configuration
export default cors({
    origin: (origin, callback) => {
        // Parse allowed origins from environment variable
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',');
        
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
});