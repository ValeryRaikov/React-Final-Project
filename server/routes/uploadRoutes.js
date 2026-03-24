const router = require('express').Router();
const upload = require('../utils/multer');

router.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        imageUrl: `http://localhost:${process.env.PORT}/images/${req.file.filename}`,
    });
});

module.exports = router;