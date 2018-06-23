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
	let p1 = productModel.loadAllProduct(offset);
	let p2 = productModel.countProduct();
	Promise.all([p1,p2]).then(([lProducts,nProduct])=>{
		// console.log(lProducts);
		// console.log(nProduct[0].total);
		let totalProduct = nProduct[0].total;
		let numberPages = Math.ceil(totalProduct / config.PRODUCTS_PER_PAGE);
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


router.get('/single-product/:id',(req,res)=>{
	let id = req.params.id;
	productModel.single(id).then((rows)=>{
		console.log(rows);
		let lProducts = rows;
		let curView = rows.views;
		let newView = ++curView;
		let p1 = productModel.load5ProductFromTheSameManufacturer(id,rows.manufacturerId);
		let p2 = productModel.load5ProductInTheSameCategory(id,rows.categoryId);
		let p3 = productModel.updateView(id,newView);
		Promise.all([p1,p2,p3]).then(([proManufacturer,proCategory,value])=>{
			console.log('proManufacturer');
			console.log(proManufacturer);
			let vm = {
				product: lProducts,
				proManufacturer:proManufacturer,
				proCategory:proCategory,
			}
			res.render('single-product',vm);
		})
	});
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

router.get('/search',(req,res)=>{
	const keyWord = req.query.key;
	let page = req.query.page;
	if(!page){
		page = 1;
	}

	let offset = (page - 1) * config.PRODUCTS_PER_PAGE;
	let p1 = productModel.searchProductByName(keyWord,offset);
	let p2 = productModel.countProductSearch(keyWord);
	Promise.all([p1,p2]).then(([lProducts,nProduct])=>{
		// console.log(lProducts);
		// console.log(nProduct[0].total);
		let totalProduct = nProduct[0].total;
		let numberPages = Math.ceil(totalProduct / config.PRODUCTS_PER_PAGE);
		let numbers = [];
        for (let i = 1; i <= numberPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
		}
		console.log('key: ' + keyWord);
		let vm = {
			key: keyWord,
            products: lProducts,
            noProducts: lProducts.length === 0,
			page_numbers: numbers,
			nPages: numberPages
		};
		
		res.render('search_result',vm);
	})
})
module.exports = router;