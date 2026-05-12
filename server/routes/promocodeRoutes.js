// routes/promocodeRoutes.js - Routes for promo code application and management (CRUD for admin)

import { Router } from 'express';
import * as c from '../controllers/promocodeController.js';

const router = Router();

// Apply promo code
router.post('/apply', c.applyPromo);

// Promocode CRUD for admin
router.post('/add-promocode', c.createPromocode);
router.get('/all-promocodes', c.getPromocodes);
router.put('/promocode/:id', c.updatePromocode);
router.delete('/promocode/:id', c.deletePromocode);

export default router;