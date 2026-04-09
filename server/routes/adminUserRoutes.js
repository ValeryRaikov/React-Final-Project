import { Router } from 'express';
import { authenticateJWT } from '../middleware/adminAuthMiddleware.js';
import { canManageUser } from '../middleware/roleAuthMiddleware.js';
import {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/adminUserController.js';

const router = Router();

// Admin user management routes - all require authentication
router.post('/admin-user-create', authenticateJWT, addUser);
router.get('/admin-users', authenticateJWT, getAllUsers);
router.get('/admin-user/:id', authenticateJWT, getUser);
router.put('/admin-user-update/:id', authenticateJWT, canManageUser, updateUser);
router.delete('/admin-user-delete/:id', authenticateJWT, canManageUser, deleteUser);

export default router;
