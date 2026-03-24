const auth = require('../middleware/authMiddleware');

const router = require('express').Router();
const c = require('../controllers/productController');

router.post('/add-product', c.addProduct);
router.put('/update-product/:id', c.updateProduct);
router.delete('/remove-product/:id', c.deleteProduct);

router.get('/all-products', c.getAllProducts);
router.get('/product/:id', c.getProduct);

router.post('/product/:id/like', auth, c.likeProduct);
router.post('/product/:id/dislike', auth, c.dislikeProduct);

router.get('/new-collection', c.newCollection);
router.get('/popular-in-women', c.popularWomen);

module.exports = router;