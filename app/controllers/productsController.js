'use strict'
const router = require('express').Router();
const productModel = require('../models/productModel');
const config = require('../../config/config.js');
router.get('/shop', (req, res) => {
	let page = req.query.page;
	if(!page){
		page = 1;
	}

	let offset = (page - 1) * config.PRODUCTS_PER_PAGE;
	console.log(+page);
	let p1 = productModel.loadAllProduct(offset);
	let p2 = productModel.countProduct();
	Promise.all([p1,p2]).then(([lProducts,nProduct])=>{
		// console.log(lProducts);
		// console.log(nProduct[0].total);
		let totalProduct = nProduct[0].total;
		let numberPages = Math.floor(totalProduct / config.PRODUCTS_PER_PAGE);
		
		if(totalProduct % config.PRODUCTS_PER_PAGE > 0){
			numberPages++;
		}

		let numbers = [];
        for (let i = 1; i <= numberPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
		}
		
		let vm = {
            products: lProducts,
            noProducts: lProducts.length === 0,
			page_numbers: numbers,
			nPages: numberPages
        };
		res.render('shop',vm);
	})
	
	
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