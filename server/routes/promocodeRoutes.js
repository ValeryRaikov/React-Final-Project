import { Router } from 'express';
import * as c from '../controllers/promocodeController.js';

const router = Router();

// Apply promo code (no auth required for now)
router.post('/apply', c.applyPromo);

// PROMOCODES CRUD for admin
router.post('/add-promocode', c.createPromocode);
router.get('/all-promocodes', c.getPromocodes);
router.put('/promocode/:id', c.updatePromocode);
router.delete('/promocode/:id', c.deletePromocode);

export default router;