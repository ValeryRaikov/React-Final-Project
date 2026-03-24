const router = require('express').Router();
const { adminLogin } = require('../controllers/adminController');

router.post('/admin-login', adminLogin);

module.exports = router;