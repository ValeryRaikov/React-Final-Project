// routes/productRoutes.js - Routes for product-related operations (CRUD, likes/dislikes, comments, collections, etc.)

import { Router } from 'express';
import auth from '../middleware/clientAuthMiddleware.js';
import * as c from '../controllers/productController.js';

const router = Router();

// Admin routes for product management
router.post('/add-product', c.addProduct);
router.put('/update-product/:id', c.updateProduct);
router.delete('/remove-product/:id', c.deleteProduct);

// Public routes for product browsing and interactions
router.get('/all-products', c.getAllProducts);
router.get('/product/:id', c.getProduct);

// User interactions with products
router.post('/product/:id/like', auth, c.likeProduct);
router.post('/product/:id/dislike', auth, c.dislikeProduct);

// Comments on products
router.post('/product/:id/comment', auth, c.addComment);
router.delete('/product/:id/comment/:commentId', auth, c.deleteComment);

// Routes for collections and product browsing
router.get('/new-collection', c.newCollection);
router.get('/popular-in-women', c.popularWomen);

// Routes for tracking recently viewed products
router.post('/track-view', auth, c.trackProductView);
router.get('/recently-viewed', auth, c.getRecentlyViewed);

export default router;