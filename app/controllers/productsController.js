'use strict'
const router = require('express').Router();
const productModel = require('../models/productModel');
const config = require('../../config/config.js');

function renderShop(lPro,nPro,page,pageName,paramName,res){
	Promise.all([lPro, nPro]).then(([lProducts, nProduct]) => {
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
			nPages: numberPages,
			pageName : pageName,
			paramName: paramName
		};
		res.render('shop', vm);
	})
}

router.get('/shop', (req, res) => {
	let pageName = 'shop';
	let paramName = '';
	let page = req.query.page || 1;
	let offset = (page - 1) * config.PRODUCTS_PER_PAGE;
	let p1 = productModel.loadAllProduct(offset);
	let p2 = productModel.countProduct();
	renderShop(p1,p2,page,pageName,paramName,res);
	// Promise.all([p1, p2]).then(([lProducts, nProduct]) => {
	// 	let totalProduct = nProduct[0].total;
	// 	let numberPages = Math.ceil(totalProduct / config.PRODUCTS_PER_PAGE);
	// 	let numbers = [];
	// 	for (let i = 1; i <= numberPages; i++) {
	// 		numbers.push({
	// 			value: i,
	// 			isCurPage: i === +page
	// 		});
	// 	}

	// 	let vm = {
	// 		products: lProducts,
	// 		noProducts: lProducts.length === 0,
	// 		page_numbers: numbers,
	// 		nPages: numberPages
	// 	};
	// 	res.render('shop', vm);
	// })
});

router.get('/single-product/:id', (req, res) => {
	let id = req.params.id;
	productModel.single(id).then((rows) => {
		console.log(rows);
		let lProducts = rows;
		let curView = rows.views;
		let newView = ++curView;
		let p1 = productModel.load5ProductFromTheSameManufacturer(id, rows.manufacturerId);
		let p2 = productModel.load5ProductInTheSameCategory(id, rows.categoryId);
		let p3 = productModel.updateView(id, newView);
		Promise.all([p1, p2, p3]).then(([proManufacturer, proCategory, value]) => {
			console.log('proManufacturer');
			console.log(proManufacturer);
			let vm = {
				product: lProducts,
				proManufacturer: proManufacturer,
				proCategory: proCategory,
			}
			res.render('single-product', vm);
		})
	});
});

router.get('/search', (req, res) => {
	const keyWord = req.query.key;
	const manufacturerName = req.query.manufacturer || "All";
	const categoryName = req.query.category || "All";
	const optionPrice = req.query.price || "All";
	let maxPrice = 0;
	let minPrice = 0;
	let page = req.query.page || 1;
	let offset = (page - 1) * config.PRODUCTS_PER_PAGE;

	let search;
	let countResult;
	if (optionPrice === "LowerThan100") {
		minPrice = config.MIN_PRICE;
		maxPrice = 5000000;
	} else if (optionPrice === "From100To500") {
		minPrice = 5000000;
		maxPrice = 10000000;
	} else if (optionPrice === "HigherThan500") {
		minPrice = 10000000;
		maxPrice = config.MAX_PRICE;
	} else {
		minPrice = 0;
		maxPrice = config.MAX_PRICE;
	}

	if (manufacturerName === "All") {
		// Category And Manufacturer = All;
		if (categoryName === "All") {
			search = productModel.searchProductByPrice(keyWord, minPrice, maxPrice, offset);
			countResult = productModel.countProductSearchByPrice(keyWord, minPrice, maxPrice, offset);
			result(search,countResult);
		}
		// Search by category
		else {
			console.log('search by category: ');
			console.log('categoryName: '+ categoryName);
			let category = new Promise((resolve, reject) => {
				productModel.getCategoryByName(categoryName).then(rows => {
					resolve(rows);
					console.log("categoryId: ");
					console.log(rows.categoryId);
				}).catch(err => {
					reject(err);
				})
			}).then(rows =>{
				search = productModel.searchProductByCategory(keyWord, rows.categoryId, minPrice, maxPrice, offset);
				countResult = productModel.countProductSearchByCategory(keyWord, rows.categoryId, minPrice, maxPrice);
				result(search,countResult);
			});
			
		}
	} else {
		// Search By Manufacturer
		if (categoryName === "All") {
			console.log('search by Manufacturer');
			let manufacturer = new Promise((resolve, reject) => {
				productModel.getManufacturerByName(manufacturerName).then((rows) => {
					console.log('manufacturer: ');
					console.log(rows);
					resolve(rows);
				}).catch(err => {
					reject(err);
				})
			}).then(manufacturer=>{
				search = productModel.searchProductByManufacturer(keyWord, manufacturer.manufacturerId, minPrice, maxPrice, offset);
				countResult = productModel.countProductSearchByManufacturer(keyWord, manufacturer.manufacturerId, minPrice, maxPrice);
				result(search,countResult);
			});
		} else {
			let category = productModel.getCategoryByName(categoryName);
			let manufacturer = productModel.getManufacturerByName(manufacturerName);
			Promise.all([category, manufacturer]).then(([cate,manu]) => {
				search = productModel.searchProductByCriteria(keyWord, cate.categoryId, manu.manufacturerId, minPrice, maxPrice, offset);
				countResult = productModel.countProductSearchByCriteria(keyWord, cate.categoryId, manu.manufacturerId, minPrice, maxPrice);
				result(search,countResult);
			})

		}

	}

	function result(search,countResult){
		Promise.all([search, countResult]).then(([lProducts, nProduct]) => {
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
			
			let query = {
				key: keyWord,
				manufacturer: manufacturerName,
				category: categoryName,
				optionPrice: optionPrice
			}
			let vm = {
				query: query,
				products: lProducts,
				noProducts: lProducts.length === 0,
				page_numbers: numbers,
				nPages: numberPages
			};
	
			res.render('search_result', vm);
		})
	}
})

router.get('/manufacturer/:name',(req,res)=>{
	let pageName = 'manufacturer';
	let manufacturerName = req.params.name;
	let page = req.query.page || 1;
	let offset = (page - 1) * config.PRODUCTS_PER_PAGE;
	productModel.getManufacturerByName(manufacturerName).then((rows)=>{
		let manufacturerId = rows.manufacturerId;
		let lPro = productModel.loadProductByManufacturer(manufacturerId,offset);
		let nPro = productModel.countProductByManufacturer(manufacturerId);
		renderShop(lPro,nPro,page,pageName,manufacturerName,res);
	});
})

router.get('/category/:name',(req,res)=>{
	let pageName = 'category';
	let categoryName = req.params.name;
	let page = req.query.page || 1;
	let offset = (page - 1) * config.PRODUCTS_PER_PAGE;
	productModel.getCategoryByName(categoryName).then((rows)=>{
		let categoryId = rows.categoryId;
		let lPro = productModel.loadProductByCategory(categoryId,offset);
		let nPro = productModel.countProductByCategory(categoryId);
		renderShop(lPro,nPro,page,pageName,categoryName,res);
	});
})

module.exports = router;