import { Router } from 'express';
import * as c from '../controllers/promocodeController.js';

const router = Router();

// Apply promo code (no auth required for now)
router.post('/apply', c.applyPromo);

export default router;