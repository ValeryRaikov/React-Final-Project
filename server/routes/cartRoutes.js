import { Router } from 'express';
import auth from '../middleware/clientAuthMiddleware.js';
import * as c from '../controllers/cartController.js';

const router = Router();

router.post('/add-to-cart', auth, c.addToCart);
router.post('/remove-from-cart', auth, c.removeFromCart);
router.post('/get-cart', auth, c.getCart);

export default router;