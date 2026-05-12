// routes/adminRoutes.js - Routes for admin-related operations (login, statistics, etc.)

import { Router } from 'express';
import { adminLogin, verifyToken, getStatistics } from '../controllers/adminController.js';
import { getCompletedOrders } from '../controllers/orderController.js';
import { authenticateJWT } from '../middleware/adminAuthMiddleware.js';

const router = Router();

router.post('/admin-login', adminLogin);
router.get('/admin-verify', authenticateJWT, verifyToken);
router.get('/admin-statistics', authenticateJWT, getStatistics);
router.get('/admin/completed-orders', authenticateJWT, getCompletedOrders);

export default router;