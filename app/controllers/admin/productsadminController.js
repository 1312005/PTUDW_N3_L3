const router = require('express').Router();

router.get('/admin/products', (req, res) => {
	 res.render('admin/products_management');
});

module.exports = router;