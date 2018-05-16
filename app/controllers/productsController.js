const router = require('express').Router();

router.get('/shop', (req, res) => {
	  res.render('shop');
});


router.get('/single-product', (req, res) => {
	  res.render('single-product');
});

module.exports = router;