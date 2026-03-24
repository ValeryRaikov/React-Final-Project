import { Router } from 'express';
import upload from '../utils/multer.js';

const router = Router();

router.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        imageUrl: `http://localhost:${process.env.PORT}/images/${req.file.filename}`,
    });
});

export default router;