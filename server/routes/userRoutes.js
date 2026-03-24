import { Router } from 'express';
import * as c from '../controllers/userController.js';

const router = Router();

router.post('/signup', c.signup);
router.post('/login', c.login);

export default router;