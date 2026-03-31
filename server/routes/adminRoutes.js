import { Router } from 'express';
import { adminLogin, verifyToken } from '../controllers/adminController.js';
import { authenticateJWT } from '../middleware/adminAuthMiddleware.js';

const router = Router();

router.post('/admin-login', adminLogin);
router.get('/admin-verify', authenticateJWT, verifyToken);

export default router;