'use strict'
const router = require('express').Router();
const productModel = require('../models/productModel');
router.get('/shop', (req, res) => {
	res.render('shop');
});


router.get('/single-product', (req, res) => {
	res.render('single-product');
});

router.get('/test', (req, res) => {
	
	productModel.loadAllProduct().then((rows)=>{
		console.log(rows);
		let vm = {
			products: rows,
		}
		res.render('test',vm);
	});
});
module.exports = router;