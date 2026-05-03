import { Router } from 'express';
import auth from '../middleware/clientAuthMiddleware.js';
import { getUserOrders } from '../controllers/orderController.js';

const router = Router();

router.get('/my-orders', auth, getUserOrders);

export default router;