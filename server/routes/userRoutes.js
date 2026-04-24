import { Router } from 'express';
import auth from '../middleware/clientAuthMiddleware.js';
import * as c from '../controllers/userController.js';

const router = Router();

router.post('/signup', c.signup);
router.post('/login', c.login);
router.post('/google-signin', c.googleSignin);

router.get('/profile', auth, c.getProfile);
router.put('/change-password', auth, c.changePassword);
router.delete('/delete-account', auth, c.deleteAccount);

export default router;