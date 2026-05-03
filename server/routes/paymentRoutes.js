import { Router } from 'express';
import auth from '../middleware/clientAuthMiddleware.js';
import { createCheckoutSession, confirmPayment } from '../controllers/paymentController.js';

const router = Router();

router.post('/create-checkout-session', auth, createCheckoutSession);
router.post('/confirm-payment', auth, confirmPayment);

export default router;