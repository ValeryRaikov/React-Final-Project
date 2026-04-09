import { Router } from 'express';
import auth from '../middleware/clientAuthMiddleware.js';
import * as s from '../controllers/savedItemsController.js';

const router = Router();

router.post('/add-to-saved', auth, s.addToSavedItems);
router.post('/remove-from-saved', auth, s.removeFromSavedItems);
router.post('/get-saved', auth, s.getSavedItems);

export default router;
