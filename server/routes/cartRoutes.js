const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/cartController');

router.post('/add-to-cart', auth, c.addToCart);
router.post('/remove-from-cart', auth, c.removeFromCart);
router.post('/get-cart', auth, c.getCart);

module.exports = router;