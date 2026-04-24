import { Router } from 'express';
import auth from '../middleware/clientAuthMiddleware.js';
import * as c from '../controllers/productController.js';

const router = Router();

router.post('/add-product', c.addProduct);
router.put('/update-product/:id', c.updateProduct);
router.delete('/remove-product/:id', c.deleteProduct);

router.get('/all-products', c.getAllProducts);
router.get('/product/:id', c.getProduct);

router.post('/product/:id/like', auth, c.likeProduct);
router.post('/product/:id/dislike', auth, c.dislikeProduct);

router.post('/product/:id/comment', auth, c.addComment);
router.delete('/product/:id/comment/:commentId', auth, c.deleteComment);

router.get('/new-collection', c.newCollection);
router.get('/popular-in-women', c.popularWomen);

router.post('/track-view', auth, c.trackProductView);
router.get('/recently-viewed', auth, c.getRecentlyViewed);

export default router;